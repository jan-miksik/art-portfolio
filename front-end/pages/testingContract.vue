<template>
  <div>
    
    <br />
    <br />
    <br />
    <textarea v-model="message" cols="30" rows="5"/>
    <br />
    <br />
    <button @click="contractActions('sendMessage')" :disabled="trxInProgress">
      {{ trxInProgress ? `Sending...` : `Send message 👋` }}
    </button>
    <br />
    <br />
    -- chain -- <br />
    {{ chainName }}
    <br />

    <span v-if="!isChainOk">
      to use this app please
      <button  @click="switchToSupportedChain">
        switch to {{ supportedNetwork.name }}</button> 
    </span>

    <br />
    <br />
    <br />
    -- connected address -- <br />
    {{ connectedAddress }}
    <br />
    <button @click="handleWalletConnection">
      {{ signer ? 'disconnect' : 'connect' }}
    </button>
    <br />
    <br />
    <br />
  
    <div>
      <p>All messages 📩</p>
      <button @click="retrieveMessages">fetch all of them</button>
      <hr/>

        <div v-for="msg in allMessages">
          <div>
            <p>
              <span class="font-bold"
                >{{ msg.from.slice(0, 5) }}...{{ msg.from.slice(-4) }} &nbsp;&nbsp; {{ msg.datetime.toLocaleDateString() }} &nbsp;{{msg.datetime.getHours()}}:{{ msg.datetime.getMinutes() }}</span
              >
            </p>
            <blockquote class="italic">{{ msg.text }}</blockquote>
          </div>
          <hr/>
        </div>
    </div>
  </div>

</template>

<script setup lang="ts">
import { ethers } from 'ethers'
import contractAbi from '~/../contracts/artifacts/contracts/MessagePortal.sol/MessagePortal.json'
// import Web3Modal from "web3modal";


interface Message {
  from: string
  text: string
  datetime: Date
}

// TODOS

// add web3 modal?
// refactoring after testing on testnet
//better manage eht provider
//support for multiple wallets?


// DONOS
// different chain warning
// switch chain button
// if metamask is not installed
// protect contract interactions
// listening for account change
// listening for chain change
// listening for contract events
// disconnect wallet - kind of / login, logout sessions
// send
// receive


const RPC_URL = import.meta.env.VITE_APP_RPC_URL as string || ''
const CONTRACT_ADDRESS = import.meta.env.VITE_APP_MSG_CONTRACT as string || ''

const trxInProgress = ref(false)
const allMessages = ref<Message[]>([])
const message = ref()

const supportedNetwork = {name: 'localhost', chainId: 31337}
const connectedAddress = ref('nothing')
const signer = ref()
const contract = ref()
const chain = ref()
const isChainOk = ref()
const web3Provider = ref()

let jsonRpcProvider: any = null;
let contractReadOnly: any = null

const chainName = computed(() => {
  if (chain.value) {
    return chain.value.chainId == 31337 ? 'localhost' : chain.value.name
  }
  return 'not connected'
})

const checkWindowEthereum = () => {
  if (window.ethereum !== undefined) {
    if (!web3Provider.value) {
      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
    }
    return true
  } else {
    if(confirm("To use this dapp, please install MetaMask")) {
      window.open("https://metamask.io/")
    }
  }
}

const disconnectWallet = () => {
  connectedAddress.value = 'nothing'
  signer.value = undefined
  localStorage.setItem('connectedAddress', '')
}


const switchToSupportedChain = () => {
  if(!checkWindowEthereum()) return
  console.log('switchToSupportedChain: ');

  window.ethereum.request({
    method: "wallet_addEthereumChain",
    params: [{
        chainId: "0x7a69",
        rpcUrls: ["http://127.0.0.1:8545"],
        chainName: "localhost",
        // nativeCurrency: {
        //     name: "MATIC",
        //     symbol: "MATIC",
        //     decimals: 18
        // },
        // blockExplorerUrls: ["https://polygonscan.com/"]
    }]
});
}

const connectWallet = async () => {
  if(!checkWindowEthereum()) return
  // const providerOptions = {
  // /* See Provider Options Section */
  // };

  // const web3Modal = new Web3Modal({
  //   // chain: "mainnet", // optional
  //   cacheProvider: true, // optional
  //   providerOptions // required
  // });

  // const instance = await web3Modal.connect();

  // signer.value = web3Provider.value.getSigner();

  await web3Provider.value.send('eth_requestAccounts', [])
  signer.value = await web3Provider.value.getSigner()
  connectedAddress.value = await signer.value.getAddress()

  localStorage.setItem('connectedAddress', connectedAddress.value)
}


const handleWalletConnection = async () => {
  if (!signer.value) {
    connectWallet()
  } else {
    disconnectWallet()
  }
}


const sendMessage = async function () {
  if(!message.value) {
    alert('nothing to send')
    return
  }

  trxInProgress.value = true

  contract.value = new ethers.Contract(
    CONTRACT_ADDRESS,
    contractAbi.abi,
    signer.value
  )

  try {
    const transaction = await contract.value.sendMessage(message.value);
    await transaction.wait()
    message.value = ''
    trxInProgress.value = false
  } catch (error) {
    console.error(error)
    trxInProgress.value = false
  }
}


const contractActions = async (action: string) => {
  if(!checkWindowEthereum()) return

  if (!signer.value) {
    
    let isConnectedAddress = null

    try {
      const signer = await web3Provider.value.getSigner()
      isConnectedAddress = await signer.getAddress()
    } catch (error) {
      console.log(error)
    }

    if (isConnectedAddress) {
      if(confirm('Connect to this dapp and continue?')) {
        await connectWallet()
      } else {
        return
      }
    } else {
      await connectWallet()
    }
  }

  if (action == 'sendMessage') {
    sendMessage()
  }
}


const sortMessages = () => {
  allMessages.value.sort((a, b) => (b.datetime.getTime() - a.datetime.getTime()))
}



const retrieveMessages = async function () {
  allMessages.value = []
  try {
    const data = await contractReadOnly.getAllMessages({})

    data.forEach((msg: any) => {
      allMessages.value.push({
        from: msg.from,
        text: msg.text,
        datetime: new Date(msg.datetime * 1000)
      })
    })

    sortMessages()

    
  } catch (error) {
    console.error(error)
  }
}


const checkChain = async () => {
  chain.value = await web3Provider.value.getNetwork();
  console.log('chain.value: ', chain.value);
  if (chain.value.chainId === supportedNetwork.chainId) {
    isChainOk.value = true
  } else {
    isChainOk.value = false
  }
}



const checkConnectedAddress = async() => {
  const connectedAccounts =  await web3Provider.value.listAccounts()
  const lastConnectedAddress = localStorage.getItem('connectedAddress')

  if (connectedAccounts.length > 0 && lastConnectedAddress) {
    signer.value = web3Provider.value.getSigner()
    connectedAddress.value = await signer.value.getAddress()
  }
}

const listenForNewMessages = () => {
  contractReadOnly.on("NewMessage", (fromAddress: any, timestamp: any, message: any) => {

    allMessages.value.push({
        from: fromAddress,
        text: message,
        datetime: new Date(timestamp.toNumber() * 1000)
      })

    sortMessages()
  })
}

const listenForAccountChange = () => {
  window.ethereum.on('accountsChanged', async ([account]: string) => {
    signer.value = web3Provider.value.getSigner()
    connectedAddress.value = await signer.value.getAddress()
    localStorage.setItem('connectedAddress', account)
  });
}



const loadContractData = async () => {
  // if (isChainOk.value) {
    contractReadOnly = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      jsonRpcProvider
    )
    listenForNewMessages()
  // }
}



const listenForChainChange = () => {
  window.ethereum.on('chainChanged', (chainId: any) => {
    
    const chainIdDecimal = parseInt(chainId, 16)

    checkChain()
    
    switch (chainIdDecimal) {
      case 1:
        chain.value = {name: 'mainnet', chainId: 1}
        break;
      case 3:
        chain.value = {name: 'ropsten', chainId: 3}
        break;
      case 4:
        chain.value = {name: 'rinkeby', chainId: 4}
        break;
      case 42:
        chain.value = {name: 'kovan', chainId: 42}
        break;
      case 137:
        chain.value = {name: 'polygon', chainId: 137}
        break;
      case 5777:
        chain.value = {name: 'goerli', chainId: 5777}
        break;
      case 80001:
        chain.value = {name: 'mumbai', chainId: 80001}
        break;
      case 31337:
        chain.value = {name: 'localhost', chainId: 31337}
        break;
      default:
        chain.value = {name: 'unknown', chainId: 0}
        break;
    }
  })
}


const initDapp = async () => {

  jsonRpcProvider = new ethers.providers.JsonRpcProvider(RPC_URL);

  if (window.ethereum !== undefined) {
    web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
    listenForAccountChange()
    listenForChainChange()
    await checkConnectedAddress()
    await checkChain()
  }

  await loadContractData() // jsonRpcProvider ok

}

onMounted(() => {
  initDapp()
})

</script>

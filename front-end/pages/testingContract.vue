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
import { ethers } from 'ethers'
import contractAbi from '~/../contracts/artifacts/contracts/MessagePortal.sol/MessagePortal.json'
import useWeb3 from '~/J/useWeb3'
// import Web3Modal from "web3modal";
const {initDapp, connectWallet, web3Provider, isChainOk, signer, checkWindowEthereum, chain, switchToSupportedChain, supportedNetwork, handleWalletConnection, connectedAddress } = useWeb3()

let jsonRpcProvider: any = null;

interface Message {
  from: string
  text: string
  datetime: Date
}


const CONTRACT_ADDRESS = import.meta.env.VITE_APP_MSG_CONTRACT as string || ''
const contract = ref()

const trxInProgress = ref(false)
const allMessages = ref<Message[]>([])
const message = ref()

let contractReadOnly: any = null



const chainName = computed(() => {
  if (chain.value) {
    return chain.value.chainId == 31337 ? 'localhost' : chain.value.name
  }
  return 'not connected'
})



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


const loadContractData = async () => {
  // if (isChainOk.value) {
    console.log('jsonRpcProvider: loadContractData ', jsonRpcProvider);
    contractReadOnly = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractAbi.abi,
      jsonRpcProvider
    )
    listenForNewMessages()
  // }
}


onMounted(async () => {
  jsonRpcProvider = await initDapp()
  console.log('jsonRpcProvider: ', jsonRpcProvider);
  await loadContractData() // jsonRpcProvider ok
})

</script>

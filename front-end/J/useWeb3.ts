import { ethers } from 'ethers'
import chains, { IChain, connectedChain } from '../constants/chains'

const chain = ref()
const web3Provider = ref()
// const isChainSupported = ref()
const signer = ref()
const connectedAddress = ref('')
let jsonRpcProvider: any = null;



export default function useWeb3() {





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
      return false
    }
  }


  const checkForAnyContractAction = async () => {
    if (!checkWindowEthereum()) return
  
    if (!connectedChain.value?.isChainSupported) {
      if (confirm('Switch to Goerli testnet chain and continue?')) {
        await switchToSupportedChain(chains.goerli)
      } else {
        return
      }
    }
  
    if (!signer.value) {
      let isConnectedAddress = null
  
      try {
        const signer = await web3Provider.value.getSigner()
        isConnectedAddress = await signer.getAddress()
      } catch (error) {}
  
      if (isConnectedAddress) {
        if (confirm('Connect to this dapp and continue?')) {
          await connectWallet()
        } else {
          return
        }
      } else {
        await connectWallet()
      }
    }
  }










  /** Crypto Wallet **/

  const listenForAccountChange = () => {
    window.ethereum.on('accountsChanged', async ([account]: string) => {
      signer.value = web3Provider.value.getSigner()
      connectedAddress.value = await signer.value.getAddress()
      localStorage.setItem('connectedAddress', account)
    });
  }

  const disconnectWallet = () => {
    connectedAddress.value = ''
    signer.value = undefined
    localStorage.setItem('connectedAddress', '')
  }


  const connectWallet = async () => {
    if(!checkWindowEthereum()) return
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


  const checkConnectedAddress = async() => {
    const connectedAccounts =  await web3Provider.value.listAccounts()
    const lastConnectedAddress = localStorage.getItem('connectedAddress')
  
    if (connectedAccounts.length > 0 && lastConnectedAddress) { 
      signer.value = web3Provider.value.getSigner()
      connectedAddress.value = await signer.value.getAddress()

    }
  }

  










  /** Chain **/

  const checkChain = async () => {
    const chain = await web3Provider.value.getNetwork();
    const selectedChain = Object.entries(chains).find(([,chainValue]) => chainValue.chainIdDec === chain.chainId)
    connectedChain.value = selectedChain?.[1]
  }

  const listenForChainChange = () => {
    window.ethereum.on('chainChanged', () => {
      checkChain()
    })
  }




  const switchToSupportedChain = async ({chainIdHex, name, rpcUrls}:IChain) => {
    const CHAIN_NOT_ADDED_TO_METAMASK_CODE = 4902
    if(!checkWindowEthereum()) return
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
    } catch (switchError) {
      if ((switchError as any).code === CHAIN_NOT_ADDED_TO_METAMASK_CODE) {
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                name,
                rpcUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('addError: ', addError)
          
        }
      }
      console.error('switchError: ', switchError)
    }
    // window.location.reload();
  }






  const initDapp = async () => {

    try {
      if (!checkWindowEthereum()) return

      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
      listenForAccountChange()
      listenForChainChange()
      await checkConnectedAddress()
      await checkChain()
      
      if (connectedChain.value?.rpcUrls) {
        jsonRpcProvider = new ethers.providers.JsonRpcProvider(connectedChain.value.rpcUrls[0]);
      }
    } catch (error) {
      alert('problem with connecting the wallet. May try different browser or create new browser profile.')
    }
  }

  return {
    listenForChainChange,
    checkWindowEthereum,
    switchToSupportedChain,
    checkForAnyContractAction,
    handleWalletConnection,
    chain,
    web3Provider,
    connectedAddress,
    signer,
    initDapp,
    connectWallet,
    jsonRpcProvider,
  }
}
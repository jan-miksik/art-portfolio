import { ethers } from 'ethers'
import chains, { IChain, connectedChain } from '../constants/chains'

const chain = ref()
const web3Provider = ref()
// const supportedNetwork = {name: 'goerli', chainId: 5}
const isChainSupported = ref()
const signer = ref()
const connectedAddress = ref('nothing')
// const RPC_URL = import.meta.env.VITE_APP_RPC_URL_GOERLI as string || ''
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
    connectedAddress.value = 'nothing'
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
    chain.value = await web3Provider.value.getNetwork();
        
    // goerli
    if (chain.value.chainId === 5) {
      isChainSupported.value = true
      connectedChain.value = chains.goerli
    // rinkeby
    } else if (chain.value.chainId === 4) {
      isChainSupported.value = true
      connectedChain.value = chains.rinkeby
    } else {
      connectedChain.value = undefined
      isChainSupported.value = false

    }
  }


  const switchToSupportedChain = async ({chainId, chainName, rpcUrls}:IChain) => {
    const CHAIN_NOT_ADDED_TO_METAMASK_CODE = 4902
    if(!checkWindowEthereum()) return
  
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      
    } catch (switchError) {
      if ((switchError as any).code === CHAIN_NOT_ADDED_TO_METAMASK_CODE) {
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId,
                chainName,
                rpcUrls,
              },
            ],
          });
        } catch (addError) {
          console.error('addError: ', addError);
          // handle "add" error
        }
      }
      console.error('switchError: ', switchError);
      // handle other "switch" errors
    }
    window.location.reload();
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
        case 5:
          chain.value = {name: 'goerli', chainId: 5}
          break;
        case 42:
          chain.value = {name: 'kovan', chainId: 42}
          break;
        case 137:
          chain.value = {name: 'polygon', chainId: 137}
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

    if (window.ethereum !== undefined) {
      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
      listenForAccountChange()
      listenForChainChange()
      await checkConnectedAddress()
      await checkChain()
    }
    
    jsonRpcProvider = new ethers.providers.JsonRpcProvider(connectedChain.value?.rpcUrls[0]);
  
  }

  return {
    listenForChainChange,
    checkWindowEthereum,
    switchToSupportedChain,
    handleWalletConnection,
    isChainSupported,
    chain,
    web3Provider,
    // supportedNetwork,
    connectedAddress,
    signer,
    initDapp,
    connectWallet,
    jsonRpcProvider,
  }

}
import { ethers } from 'ethers'
import { mainSupportedChain } from '~/appSetup'
import chains, { IChain, connectedChain } from '~/constants/chains'
import useWeb3Modal from './useWeb3Modal'
import { fetchSigner, watchSigner, switchNetwork, watchNetwork } from '@wagmi/core'

const chain = ref()
const web3Provider = ref()
const signer = ref()
const connectedAddress = ref('')
let jsonRpcProvider: any = null;

const isUserUsingMobile = () => {
  // User agent string method
  let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Screen resolution method
  if (!isMobile) {
      let screenWidth = window.screen.width;
      let screenHeight = window.screen.height;
      isMobile = (screenWidth < 768 || screenHeight < 768);
  }

  // Touch events method
  if (!isMobile) {
      isMobile = (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.maxTouchPoints > 0));
  }
  
  // CSS media queries method
  if (!isMobile) {
      let bodyElement = document.getElementsByTagName('body')[0];
      isMobile = window.getComputedStyle(bodyElement).getPropertyValue('content').indexOf('mobile') !== -1;
  }
  
  return isMobile
}

const unwatch = watchSigner(
  {
    chainId: mainSupportedChain.chainIdDec,
  },
  (provider) => console.log('watchSigner', provider),
)


const unwatchNetwork = watchNetwork((network) => {
  console.log('watchNetwork', network)
})


export default function useWeb3() {


  // Choose the RPC URL based on the desired network (mainnet or testnet)
  const optimismRpcUrl = mainSupportedChain.rpcUrls && mainSupportedChain.rpcUrls[0] 

  // Create a provider for the Optimism network
  const optimismProvider = new ethers.providers.JsonRpcProvider(optimismRpcUrl);

  const checkWindowEthereum = () => {
    console.log('checkWindowEthereum: ');
    if (window.ethereum === undefined) {
      if(confirm("To use this dapp, please install some crypto wallet")) {
        window.open("https://metamask.io/")
      }
      // return false
    }

    if (!web3Provider.value && window.ethereum) {
      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
    } else {
      console.log('132 poiupoiaupoiasudfpoiauf');
      web3Provider.value = new ethers.providers.JsonRpcProvider(optimismRpcUrl);
    }
    return true
  }


  const checkForAnyContractAction = async () => {
    // if (!checkWindowEthereum()) return
  
    if (connectedChain.value?.chainIdDec !== mainSupportedChain.chainIdDec) {
      if (confirm(`Contract is on ${mainSupportedChain.name} chain. Switch to ${mainSupportedChain.name} and continue?`)) {
        await switchToSupportedChain(mainSupportedChain)
      } else {
        return
      }
    }
    
    let isConnectedAddress = null
    if (signer.value) {
      try {
        isConnectedAddress = await signer.value.getAddress()
      } catch (error) {
        console.error('[checkForAnyContractAction error:] ', error);
      }
    }

    if (!signer.value || !isConnectedAddress) {
  
      try {
        const signerLoc = await web3Provider.value.getSigner()
        isConnectedAddress = await signerLoc.getAddress()
      } catch (error) {
        console.error('error:', error)
      }
  
      if (!isConnectedAddress) {
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
    console.log('connectWallet: ');
    // if(!checkWindowEthereum()) return
  
    // await web3Provider.value.send('eth_requestAccounts', [])
    // signer.value = await web3Provider.value.getSigner()
    // connectedAddress.value = await signer.value.getAddress()
    // localStorage.setItem('connectedAddress', connectedAddress.value)

    signer.value = await fetchSigner()
    console.log('signer: ', signer.value);
    if (!signer.value) {
      const { web3modal } = useWeb3Modal()
      await web3modal.openModal()
    }
    signer.value = await fetchSigner()
    console.log('signer.value: 0000000000', signer.value);

  }


  // const handleWalletConnection = async () => {
  //   if (!signer.value) {
  //     connectWallet()
  //   } else {
  //     disconnectWallet()
  //   }
  // }


  // const checkConnectedAddress = async() => {
  //   const connectedAccounts =  await web3Provider.value.listAccounts()
  //   const lastConnectedAddress = localStorage.getItem('connectedAddress')
  //   if (connectedAccounts.length > 0 && lastConnectedAddress) { 
  //     signer.value = web3Provider.value.getSigner()
  //     connectedAddress.value = await signer.value.getAddress()
  //   }
  // }

  










  /** Chain **/

  const checkChain = async () => {
    const chain = await web3Provider.value.getNetwork();
    const chainIdInHex = '0x' + Number(chain.chainId).toString(16);
    switchToChainByHexId(chainIdInHex)
  }


  const switchToChainByHexId = (chainIdHex: string) => {
    const selectedChain = Object.entries(chains).find(([,chainValue]) => chainValue.chainIdHex === chainIdHex)
    connectedChain.value = selectedChain?.[1]
  }


  const listenForChainChange = () => {
    window.ethereum.on('chainChanged', () => {
      checkChain()
    })
  }
  

  const switchToSupportedChain = async ({chainIdHex, name, rpcUrls, nativeCurrency}:IChain) => {
    // const CHAIN_NOT_ADDED_TO_METAMASK_CODE = 4902
    // if(!checkWindowEthereum()) return

    const network = await switchNetwork({
      chainId: mainSupportedChain.chainIdDec,
    })
    console.log('network: ', network);
    
    // try {
    //   await window.ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{ chainId: chainIdHex }],
    //   });
    //   switchToChainByHexId(chainIdHex)
    // } catch (switchError) {
    //   if ((switchError as any).code === CHAIN_NOT_ADDED_TO_METAMASK_CODE) {
        
    //     try {
    //       await window.ethereum.request({
    //         method: 'wallet_addEthereumChain',
    //         params: [
    //           {
    //             chainId: chainIdHex,
    //             chainName: name,
    //             rpcUrls,
    //             nativeCurrency: {
    //               name: nativeCurrency.name,
    //               symbol: nativeCurrency.symbol,
    //               decimals: nativeCurrency.decimals,
    //             },
    //           },
    //         ],
    //       });
    //       switchToChainByHexId(chainIdHex)
    //     } catch (addError) {
    //       console.error('addError: ', addError)
    //     }
    //   }
    // }
    // window.location.reload(); ?
  }






  const initDapp = async () => {
    try {
      // if (!checkWindowEthereum()) return
      console.log('-----------');
      // web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
      // listenForAccountChange()
      // listenForChainChange()
      console.log('0000000000');
      // await checkConnectedAddress()

      // const { web3modal } = useWeb3Modal()
      // await web3modal.openModal()

      console.log('111111111');
      // await checkChain()
      console.log('222222222');


      
      if (mainSupportedChain.rpcUrls) {
        jsonRpcProvider = new ethers.providers.JsonRpcProvider(mainSupportedChain.rpcUrls[0]);
      }
    } catch (error) {
      console.log('error: ', error);
      alert('problem with connecting the wallet. May try different browser or create new browser profile.')
    }
  }

  // async function getGasPrice() {
  //   const gasPrice = await web3Provider.value.getGasPrice();
  //   console.log("Gas price:", gasPrice.toString());
  //   return gasPrice;
  // }




  return {
    listenForChainChange,
    checkWindowEthereum,
    switchToSupportedChain,
    checkForAnyContractAction,
    // handleWalletConnection,
    chain,
    web3Provider,
    optimismProvider,
    connectedAddress,
    signer,
    initDapp,
    connectWallet,
    jsonRpcProvider,
  }
}
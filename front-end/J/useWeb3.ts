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


/** Crypto Wallet **/
const unwatch = watchSigner(
  {
    chainId: mainSupportedChain.chainIdDec,
  },
  async (provider) => {
    if (provider) {
      signer.value = markRaw(provider)
      connectedAddress.value = await provider.getAddress()
    } else {
      signer.value = null
      connectedAddress.value = ''
    }
  }
)

/** Network **/
const unwatchNetwork = watchNetwork((network) => {
  connectedChain.value = Object.values(chains).find(chain => chain.chainIdDec === network?.chain?.id);
})


export default function useWeb3() {
  // Choose the RPC URL based on the desired network (mainnet or testnet)
  const optimismRpcUrl = mainSupportedChain.rpcUrls && mainSupportedChain.rpcUrls[0] 
  // Create a provider for the Optimism network
  const optimismProvider = new ethers.providers.JsonRpcProvider(optimismRpcUrl);

  const checkWindowEthereum = () => {
    if (window.ethereum === undefined) {
      if(confirm("To use this dapp, please install some crypto wallet")) {
        window.open("https://metamask.io/")
      }
      // return false
    }

    if (!web3Provider.value && window.ethereum) {
      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
    } else {
      web3Provider.value = new ethers.providers.JsonRpcProvider(optimismRpcUrl);
    }
    return true
  }


  const switchToSupportedChain = async () => {
    await switchNetwork({
      chainId: mainSupportedChain.chainIdDec,
    })
    

    // const CHAIN_NOT_ADDED_TO_METAMASK_CODE = 4902
    // if(!checkWindowEthereum()) return

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

  const checkForAnyContractAction = async () => {
    if (!signer.value) {
      return false
    }

    // check chain and switch if needed
    if (connectedChain.value?.chainIdDec !== mainSupportedChain.chainIdDec) {
      if (confirm(`Contract is on ${mainSupportedChain.name} chain. Switch to ${mainSupportedChain.name} and continue?`)) {
        await switchToSupportedChain()
        if (connectedChain.value?.chainIdDec !== mainSupportedChain.chainIdDec) {
          return false
        } else {
          return true
        }
      }
    }
    return true
  }






  





  const connectWallet = async () => {
    const fetchedSigner = await fetchSigner()
    signer.value = fetchedSigner ? markRaw(fetchedSigner) : null

    if (!signer.value) {
      const { web3modal } = useWeb3Modal()
      await web3modal.openModal()
      await new Promise((resolve) => {
        const unsubscribe = web3modal.subscribeModal(() => {
          unsubscribe()
          resolve(true)
        })
      })
      const fetchedSignerAfterModal = await fetchSigner()
      signer.value = fetchedSignerAfterModal ? markRaw(fetchedSignerAfterModal) : null
    }
  }

  





  const initDapp = async () => {
    try {

      if (mainSupportedChain.rpcUrls) {
        jsonRpcProvider = new ethers.providers.JsonRpcProvider(mainSupportedChain.rpcUrls[0]);
      }
    } catch (error) {
      alert('problem with connecting the wallet. May try different browser or create new browser profile.')
    }
  }

  // async function getGasPrice() {
  //   const gasPrice = await web3Provider.value.getGasPrice();
  //   console.log("Gas price:", gasPrice.toString());
  //   return gasPrice;
  // }




  return {
    checkWindowEthereum,
    switchToSupportedChain,
    checkForAnyContractAction,
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
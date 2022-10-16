import { ethers } from 'ethers'
import { mainSupportedChain } from '~/appSetup'
import chains, { IChain, connectedChain } from '~/constants/chains'

const chain = ref()
const web3Provider = ref()
const signer = ref()
const connectedAddress = ref('')
let jsonRpcProvider: any = null;

export default function useWeb3() {


  const checkWindowEthereum = () => {
    if (window.ethereum === undefined) {
      if(confirm("To use this dapp, please install MetaMask")) {
        window.open("https://metamask.io/")
      }
      return false
    }

    if (!web3Provider.value) {
      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
    }
    return true
  }


  const checkForAnyContractAction = async () => {
    if (!checkWindowEthereum()) return
  
    if (connectedChain.value?.chainIdDec !== mainSupportedChain.chainIdDec) {
      if (confirm(`Contract is on ${mainSupportedChain.name} chain. Switch to ${mainSupportedChain.name} and continue?`)) {
        await switchToSupportedChain(mainSupportedChain)
      } else {
        return
      }
    }
    
    if (!signer.value) {
      let isConnectedAddress = null
  
      try {
        const signer = await web3Provider.value.getSigner()
        isConnectedAddress = await signer.getAddress()
      } catch (error) {
        console.error('error: ', error)
      }
  
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
    const chainIdInHex = '0x' + Number(chain.chainId).toString(16);
    switchToChainByHexId(chainIdInHex)
  }


  const switchToChainByHexId = (chainIdHex: string) => {
    const selectedChain = Object.entries(chains).find(([,chainValue]) => chainValue.chainIdHex === chainIdHex)
    connectedChain.value = selectedChain?.[1]
    console.log('connectedChain.value: ', connectedChain.value)
  }


  const listenForChainChange = () => {
    window.ethereum.on('chainChanged', () => {
      checkChain()
    })
  }
  

  const switchToSupportedChain = async ({chainIdHex, name, rpcUrls, nativeCurrency}:IChain) => {
    const CHAIN_NOT_ADDED_TO_METAMASK_CODE = 4902
    if(!checkWindowEthereum()) return
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      switchToChainByHexId(chainIdHex)
    } catch (switchError) {
      console.log('switchError: ', switchError);
      if ((switchError as any).code === CHAIN_NOT_ADDED_TO_METAMASK_CODE) {
        
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: chainIdHex,
                chainName: name,
                rpcUrls,
                nativeCurrency: {
                  name: nativeCurrency.name,
                  symbol: nativeCurrency.symbol,
                  decimals: nativeCurrency.decimals,
                },
              },
            ],
          });
          switchToChainByHexId(chainIdHex)
        } catch (addError) {
          console.error('addError: ', addError)
        }
      }
    }
    // window.location.reload(); ?
  }






  const initDapp = async () => {
    try {
      if (!checkWindowEthereum()) return

      web3Provider.value = new ethers.providers.Web3Provider(window.ethereum, "any")
      listenForAccountChange()
      listenForChainChange()
      await checkConnectedAddress()
      await checkChain()
      
      if (mainSupportedChain.rpcUrls) {
        jsonRpcProvider = new ethers.providers.JsonRpcProvider(mainSupportedChain.rpcUrls[0]);
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
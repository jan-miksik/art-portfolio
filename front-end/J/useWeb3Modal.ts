import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createClient } from '@wagmi/core'
import { arbitrum, mainnet, optimism, optimismGoerli, polygon } from '@wagmi/core/chains'
import { mainSupportedChain } from '~/appSetup'

const chains = [optimismGoerli, optimism, arbitrum, mainnet, polygon]
const projectId = import.meta.env.VITE_APP_WALLET_CONNECT_ID as string

const defaultChain = chains.find(chain => chain.id === mainSupportedChain.chainIdDec)

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)
const web3modal = new Web3Modal({ 
  projectId, 
  explorerRecommendedWalletIds: [
    // Metamask
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    // Rainbow
    '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    // Trust Wallet
    '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0',
    // Ledger live
    '19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927',
    // Frame
    'a9751f17a3292f2d1493927f0555603d69e9a3fcbcdf5626f01b49afa21ced91',
    //Coinomi
    '15d7610042217f691385d20e640869dc7273e991b04e8f476417cdc5ec856955',
    // Coinbase
    'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
  ],
  defaultChain,
 }, ethereumClient)

export default function useWeb3Modal() {


  const htmlElement = document.documentElement;
  const w3mModalElements = document.getElementsByTagName('w3m-modal');
  const w3mShadowRoot = w3mModalElements[0].shadowRoot
  const w3mElement = w3mShadowRoot ? w3mShadowRoot.querySelector('#w3m-modal') : null
  
  if (w3mElement && htmlElement && htmlElement.classList.contains('dark-mode')) {
    (w3mElement as HTMLElement).style.filter = 'invert(1)'
  }

  web3modal.setTheme({
    themeMode: 'light',
    themeVariables: {
      // '--w3m-font-family': 'GowunDodum, sans-serif',
      // '--w3m-accent-color': '#DAA300',
      // '--w3m-background-color': '#292F36',
    }
  })

  return {web3modal}
}
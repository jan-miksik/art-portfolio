import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/html'
import { configureChains, createClient } from '@wagmi/core'
import { arbitrum, mainnet, optimism, polygon } from '@wagmi/core/chains'

const chains = [optimism, arbitrum, mainnet, polygon]
const projectId = import.meta.env.VITE_APP_WALLET_CONNECT_ID as string

const { provider } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider
})
const ethereumClient = new EthereumClient(wagmiClient, chains)
const web3modal = new Web3Modal({ projectId }, ethereumClient)

export default function useWeb3Modal() {
  web3modal.setTheme({
    themeMode: 'dark',
    themeVariables: {
      '--w3m-font-family': 'GowunDodum, sans-serif',
      '--w3m-accent-color': '#F5841F'
      // ...
    }
  })

  return {web3modal}
}
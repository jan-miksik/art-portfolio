export interface IChain {
  chainIdHex:string
  chainIdDec: number
  nftRoyaltyContract?:string
  nftIntoPiecesContract?: string
  name:string
  rpcUrls?:string[]
  nftIntoPiecesCollectionName?: string
  nftShowingPortfolioContract?: string
  linkToEtherscanIntoPiecesContract?: string
  isChainSupported: boolean
  keyName: string | 'goerli'
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  }
}

const chains: Record<string, IChain> = {
  sepolia: {
    chainIdHex: '0xaa36a7',
    chainIdDec: 11155111,
    keyName: 'sepolia',
    name: 'Sepolia',
    nftIntoPiecesContract: '0x315706Dd2210315C8eE1e0bB01c5d172301Cae72',
    // nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftIntoPiecesCollectionName: 'into-pieces-2',
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  },
  optimism: {
    chainIdHex: '0xa',
    chainIdDec: 10,
    keyName: 'optimism',
    name: 'Optimism',
    nftIntoPiecesContract: '0xe75b8ffd5df1311d68FfFC93e3bB95F489C7df1A',
    linkToEtherscanIntoPiecesContract: 'https://optimistic.etherscan.io/address/0xe75b8ffd5df1311d68fffc93e3bb95f489c7df1a',
    nftIntoPiecesCollectionName: 'into-pieces-1',
    rpcUrls: ['https://mainnet.optimism.io', 'https://optimism.blockpi.network/v1/rpc/public', 'https://1rpc.io/op'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  localhost: {
    chainIdHex: '0x7a69',
    chainIdDec: 31337,
    name: 'localhost',
    keyName: 'localhost',
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  }
}

export const connectedChain = ref<IChain>()

export default chains
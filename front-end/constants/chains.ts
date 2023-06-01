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
  rinkeby: {
    chainIdHex: '0x4',
    chainIdDec: 4,
    nftIntoPiecesContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    name: 'Rinkeby',
    keyName: 'rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  },
  goerli: { 
    chainIdHex: '0x5',
    chainIdDec: 5,
    keyName: 'goerli',
    name: 'Goerli',
    nftIntoPiecesContract: '0xf3dEd36A5288eC57b478fe2F7ffe0A458bb19025',
    nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftIntoPiecesCollectionName: 'hat-1',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  },
  mainnet: {
    chainIdHex: '0x1',
    chainIdDec: 1,
    name: 'Ethereum',
    keyName: 'mainnet',
    isChainSupported: false,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  ropsten: {
    chainIdHex: '0x3',
    chainIdDec: 3,
    name: 'Ropsten',
    keyName: 'ropsten',
    isChainSupported: false,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  },
  kovan: {
    chainIdHex: '0x2a',
    chainIdDec: 42,
    name: 'Kovan',
    keyName: 'kovan',
    isChainSupported: false,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'tETH',
      decimals: 18,
    },
  },
  polygon: {
    chainIdHex: '0x89',
    chainIdDec: 137,
    name: 'Polygon',
    keyName: 'polygon',
    isChainSupported: false,
    nativeCurrency: {
      name: 'Matic',
      symbol: 'MATIC',
      decimals: 18,
    },
  },
  mumbai: {
    chainIdHex: '0x13881',
    chainIdDec: 80001,
    name: 'Mumbai',
    keyName: 'mumbai',
    nftIntoPiecesContract: '0x985f6e98755666155B36e73c78c345949b844BcE',
    // nftIntoPiecesContract: '0x8E072dcd26eAe73C172bF6ed2a5D00Aa18bD4D20',
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'maticmum',
      symbol: 'tMATIC',
      decimals: 18,
    },
  },
  arbitrumGoerli: { 
    chainIdHex: '0x66eed',
    chainIdDec: 421613,
    keyName: 'arbitrumGoerli',
    name: 'Arbitrum Goerli',
    nftIntoPiecesContract: '0xBE5b9Bc68ac970337b6A9C92A319D3a3750beFfe',
    // nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftIntoPiecesCollectionName: 'into-pieces',
    rpcUrls: ['https://arb-goerli.g.alchemy.com/v2/eb3BLnU8dO9VBaH-JtrdOubjjvjYduLm'],
    isChainSupported: false,
    nativeCurrency: {
      name: 'Arbitrum Goerli ETH',
      symbol: 'AGOR',
      decimals: 18,
    },
  },
  optimismGoerli: {
    chainIdHex: '0x1a4',
    chainIdDec: 420,
    keyName: 'optimismGoerli',
    name: 'Optimism Goerli',
    nftIntoPiecesContract: '0x8E072dcd26eAe73C172bF6ed2a5D00Aa18bD4D20',
    linkToEtherscanIntoPiecesContract: 'https://goerli-optimism.etherscan.io/address/0x8E072dcd26eAe73C172bF6ed2a5D00Aa18bD4D20',
    // nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftIntoPiecesCollectionName: 'into-pieces-1',
    rpcUrls: ['https://goerli.optimism.io','https://optimism-goerli.public.blastapi.io'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Optimism Goerli ETH',
      symbol: 'G-ETH',
      decimals: 18,
    },
  },
  optimism: {
    chainIdHex: '0xa',
    chainIdDec: 10,
    keyName: 'optimism',
    name: 'Optimism',
    
    // https://optimistic.etherscan.io

    nftIntoPiecesContract: '0xe75b8ffd5df1311d68FfFC93e3bB95F489C7df1A',
    linkToEtherscanIntoPiecesContract: 'https://optimistic.etherscan.io/address/0xe75b8ffd5df1311d68fffc93e3bb95f489c7df1a',
    // nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftIntoPiecesCollectionName: 'into-pieces-1',
    rpcUrls: ['https://mainnet.optimism.io', 'https://optimism.blockpi.network/v1/rpc/public', 'https://1rpc.io/op'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Ethereum',
      symbol: 'ETH',
      decimals: 18,
    },
  },
  // 0x8E072dcd26eAe73C172bF6ed2a5D00Aa18bD4D20
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
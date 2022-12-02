export interface IChain {
  chainIdHex:string
  chainIdDec: number
  nftRoyaltyContract?:string
  nftHatContract?: string
  name:string
  rpcUrls?:string[]
  nftHatCollectionName?: string
  nftShowingPortfolioContract?: string
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
    nftHatContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
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
    nftHatContract: '0xf3dEd36A5288eC57b478fe2F7ffe0A458bb19025',
    nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    // nftHatContract: '0xB77Bd694BC9F0C158439629F69A4FA1ee05C5E40',
    // nftHatContract: '0x1121855fafF7FEC9d802F1E66B84F3fa90BFE2f7',
    nftHatCollectionName: 'hat-1',
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
    nftHatContract: '0x985f6e98755666155B36e73c78c345949b844BcE',
    // nftHatContract: '0xcc23d543Ef646976E29f2C737D50f3C24D42c0e2',
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
    nftHatContract: '0xBE5b9Bc68ac970337b6A9C92A319D3a3750beFfe',
    // nftShowingPortfolioContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    nftHatCollectionName: 'hat-v2-1',
    rpcUrls: ['https://arb-goerli.g.alchemy.com/v2/eb3BLnU8dO9VBaH-JtrdOubjjvjYduLm'],
    isChainSupported: true,
    nativeCurrency: {
      name: 'Arbitrum Goerli ETH',
      symbol: 'AGOR',
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
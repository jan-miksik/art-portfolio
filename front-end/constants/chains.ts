export interface IChain {
  chainIdHex:string
  chainIdDec: number
  nftRoyaltyContract?:string
  nftACPContract?: string
  name:string
  rpcUrls?:string[]
  isChainSupported: boolean
  nativeCurrency: string
}

const chains: Record<string, IChain> = {
  rinkeby: {
    chainIdHex: '0x4',
    chainIdDec: 4,
    nftACPContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    name: 'Rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    isChainSupported: true,
    nativeCurrency: 'ETH'
  },
  goerli: { 
    chainIdHex: '0x5',
    chainIdDec: 5,
    name: 'Goerli',
    nftACPContract: '0x1121855fafF7FEC9d802F1E66B84F3fa90BFE2f7',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
    isChainSupported: true,
    nativeCurrency: 'ETH'
  },
  mainnet: {
    chainIdHex: '0x1',
    chainIdDec: 1,
    name: 'Ethereum',
    isChainSupported: false,
    nativeCurrency: 'ETH'
  },
  ropsten: {
    chainIdHex: '0x3',
    chainIdDec: 3,
    name: 'Ropsten',
    isChainSupported: false,
    nativeCurrency: 'ETH'
  },
  kovan: {
    chainIdHex: '0x2a',
    chainIdDec: 42,
    name: 'Kovan',
    isChainSupported: false,
    nativeCurrency: 'ETH'
  },
  polygon: {
    chainIdHex: '0x89',
    chainIdDec: 137,
    name: 'Kovan',
    isChainSupported: false,
    nativeCurrency: 'MATIC'
  },
  mumbai: {
    chainIdHex: '0x13881',
    chainIdDec: 80001,
    name: 'Mumbai',
    nftACPContract: '0xcc23d543Ef646976E29f2C737D50f3C24D42c0e2',
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
    isChainSupported: true,
    nativeCurrency: 'MATIC'
  },
  localhost: {
    chainIdHex: '0x7a69',
    chainIdDec: 31337,
    name: 'localhost',
    isChainSupported: true,
    nativeCurrency: 'ETH'
  }
}

export const connectedChain = ref<IChain>()

export default chains
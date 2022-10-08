export interface IChain {
  chainIdHex:string
  chainIdDec: number
  nftRoyaltyContract?:string
  nftACPContract?: string
  name:string
  rpcUrls?:string[]
  isChainSupported: boolean 
}

const chains: Record<string, IChain> = {
  rinkeby: {
    chainIdHex: '0x4',
    chainIdDec: 4,
    nftRoyaltyContract:'0x475Bfc1B892374A9b6902B7b43375f2f9cdE8168',
    nftACPContract: '0x47488CA96d736E63365d75C471050b5074CBD076',
    name: 'Rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],
    isChainSupported: true
  },
  goerli: { 
    chainIdHex: '0x5',
    chainIdDec: 5,
    name: 'Goerli',
    nftRoyaltyContract:'0xBE5b9Bc68ac970337b6A9C92A319D3a3750beFfe',
    nftACPContract: '0x1121855fafF7FEC9d802F1E66B84F3fa90BFE2f7',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli'],
    isChainSupported: true
  },
  mainnet: {
    chainIdHex: '0x1',
    chainIdDec: 1,
    name: 'Ethereum',
    isChainSupported: false
  },
  ropsten: {
    chainIdHex: '0x3',
    chainIdDec: 3,
    name: 'Ropsten',
    isChainSupported: false
  },
  kovan: {
    chainIdHex: '',
    chainIdDec: 42,
    name: 'Kovan',
    isChainSupported: false
  },
  polygon: {
    chainIdHex: '',
    chainIdDec: 137,
    name: 'Kovan',
    isChainSupported: false
  },
  mumbai: {
    chainIdHex: '',
    chainIdDec: 80001,
    name: 'mumbai',
    nftACPContract: '0xcc23d543Ef646976E29f2C737D50f3C24D42c0e2',
    isChainSupported: true,
    rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
  },
  localhost: {
    chainIdHex: '',
    chainIdDec: 31337,
    name: 'localhost',
    isChainSupported: true
  }
} 

export const connectedChain = ref<IChain>()

export default chains
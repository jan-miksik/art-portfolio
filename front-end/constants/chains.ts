export interface IChain {
  chainId:string
  nftRoyaltyContract:string
  chainName:string
  rpcUrls:string[]
}

const chains = {
  rinkeby: {
    chainId:'0x4',
    // nftRoyaltyContract: '0x89aE06D5a5385F3F614e1Df9ba38387beCc95A56',
    // nftRoyaltyContract: '0x4C1b9d662470317C66950aa1cE829c7c6270Cd0A',
    nftRoyaltyContract:'0x475Bfc1B892374A9b6902B7b43375f2f9cdE8168',
    chainName: 'Rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
  },
  goerli: { 
    chainId: '0x5',
    chainName: 'Goerli',
    nftRoyaltyContract:'0xBE5b9Bc68ac970337b6A9C92A319D3a3750beFfe',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli']
  }
}

export const connectedChain = ref<IChain>()

export default chains
export interface IChain {
  chainId:string
  nftRoyaltyContract:string
  chainName:string
  rpcUrls:string[]
}

const chains = {
  rinkeby: {
    chainId:'0x4',
    nftRoyaltyContract: '0x89aE06D5a5385F3F614e1Df9ba38387beCc95A56',
    chainName: 'Rinkeby',
    rpcUrls: ['https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161']
  },
  goerli: { 
    chainId: '0x5',
    chainName: 'Goerli',
    nftRoyaltyContract:'0x90219b9ABcA9533220a3E0B71e765908EE6d20C8',
    rpcUrls: ['https://rpc.ankr.com/eth_goerli']
  }
}

export const connectedChain = ref<IChain>()

export default chains
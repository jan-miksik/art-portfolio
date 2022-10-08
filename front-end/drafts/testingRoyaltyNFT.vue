<template>
  <div>
    
    <br />
    <br />
    -- chain -- <br />
    {{ chain?.name }}
    <br />

    
    
    <span v-if="!isChainSupported">
     ## #Is connected unsupported chain ## .#
    </span>

    <span>
      usable options
      <button v-if="connectedChain?.chainId !== chains.goerli.chainId" @click="switchToSupportedChain(chains.goerli)"> 
        {{ chains.goerli.name }}</button>  
        <button v-if="connectedChain?.chainId !== chains.rinkeby.chainId"  @click="switchToSupportedChain(chains.rinkeby)">
          {{ chains.rinkeby.name }}</button>
    </span>
    

    <br />
    <br />
    -- connected address -- <br />
    {{ connectedAddress }}
    <br />
    <button @click="handleWalletConnection">
      {{ signer ? 'disconnect' : 'connect' }}
    </button>
    <br />
    <br />
    <button @click="giveContractWithSigner">
      give contract with signer
    </button>
    <br />
    <br />
    <span>
      Royalty free threshold {{royaltyFreeThreshold}} ETH
    </span>

    <div class="nfts" v-if="NFTImagesLoaded">
      <div class="nft" v-for="metadata in NFTsMetadata" :key="metadata.name">
        <img class="nft-image" :src="metadata?.image" />
        <div class="nft-name">{{ metadata?.name }}</div>
        <div v-if="NFTsState[metadata.id]?.isMinted" >
          minted
        </div>
        <div v-else>
          
          
          requested price
          <br />
          <div class="mint-form">
            <input
              class="mint-input"
              required
              name="image-name"
              v-model="requestedPriceArr[metadata.id]"
            /> 
            <span class="mint-form-eth">
              ETH
            </span> 
            
            <button  @click="mintNFT(metadata)" :disabled="NFTsState[metadata.id]?.mintInProgress">{{ NFTsState[metadata.id]?.mintInProgress ? "minting" : 'mint' }} </button>

          </div>
          contract royalty: {{ calculateRoyalty(requestedPriceArr[metadata.id]) }}

        </div>
      </div>

    </div>

  </div>
</template>


<script setup lang="ts">
// TODOS
// dynamic royalties based on price

// fix - reject mint
// fix minting
// look at hardhat-deploy https://www.npmjs.com/package/hardhat-deploy
// upload image to ipfs
// add tests


// add web3 modal?
// refactoring after testing on testnet
//better manage eht provider
//support for multiple wallets?


// DONOS
// prevent mint button falsy actions(different chain ...)
// add emit event to contract
// listen is nft is minted
// get NFT state
// mint NFT
// read contract
// fetch ipfs metadata
// fetch images and show them

import { BigNumber, ethers } from 'ethers'
// import contractAbi from '~/../contracts/artifacts/contracts/TestNFT.sol/TestNFT.json'
import useWeb3 from '~/J/useWeb3'
import chains, {connectedChain} from '~/constants/chains'
import contractAbi from '~/../contracts/artifacts/contracts/NftArbitraryPrice.sol/NftArbitraryPrice.json';

// import Web3Modal from "web3modal";
interface Message {
  from: string
  text: string
  datetime: Date
}

const {initDapp, connectWallet, web3Provider, isChainSupported, signer, checkWindowEthereum, chain, switchToSupportedChain, handleWalletConnection, connectedAddress } = useWeb3()

const baseUri = import.meta.env.VITE_APP_TEST_NFT_BASE_URI as string || ''


// let jsonRpcProvider: any = null;
let contractReadOnly: any = null

const NFTImagesIds = ref([...Array(12).keys()])
const NFTsMetadata = ref<any>([])
const NFTsState = ref<any>([])
const NFTImagesLoaded = ref(false)
const requestedPriceArr = ref([])
const contract = ref()
const royaltyFreeThreshold = ref('')





// const connectedChain.value.nftRoyaltyContract = import.meta.env.VITE_APP_TEST_NFT_CONTRACT_GOERLI as string || ''

// onMounted(() => {

// })

const checkIsMinted = async (NFTId: number) => {
  
  try {
    const isMintedAndOwnedBy = await contractReadOnly.ownerOf(NFTId)
    if (isMintedAndOwnedBy) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

const calculateRoyalty = (requestedPrice: any) => {
  
  royaltyFreeThreshold.value
  if (requestedPrice >= royaltyFreeThreshold.value) return '0 %'
  const pricePercent = 100 - (+requestedPrice / (+royaltyFreeThreshold.value / 100))
  return pricePercent ? `${pricePercent} %` : '-'
}

const fetchNFTsMetadata = async () => {
  
  NFTImagesLoaded.value = false

  await Promise.all(NFTImagesIds.value.map(async (id: number) => {
    const metadata = await fetch(`${baseUri}${id}`).then(res => res.json())
    const NFTId = metadata.name.substring(metadata.name.indexOf('#') + 1)
    metadata.id = NFTId
    NFTsMetadata.value.push(metadata)
  }))
  
  
  NFTsMetadata.value.sort((a: any, b: any) => {
    const formattedA = a.name.substring(a.name.indexOf('#') + 1)
    const formattedB = b.name.substring(b.name.indexOf('#') + 1)
    return +formattedA - +formattedB
  })

    
  await Promise.all(NFTsMetadata.value.map(async (metadata: any) => {
    const id = metadata.name.substring(metadata.name.indexOf('#') + 1)
    const isMinted: boolean = await checkIsMinted(id)
      
    NFTsState.value[id] = {
      name: metadata.name,
      isMinted,
      mintInProgress: false,
    }
  }))

  NFTImagesLoaded.value = true

}


const mintNFT = async (metadata: any) => {

  NFTsState.value[metadata.id].mintInProgress = true
  const confirmation = await contractActions('mint', metadata.id)

  
  NFTsState.value[metadata.id].mintInProgress = false
  if (confirmation) {
    NFTsState.value[metadata.id].isMinted = true
  }
}



// const connectedChainName = computed(() => {
//   if (chain.value) {
//     return chain.value.chainId == 31337 ? 'localhost' : chain.value.name
//   }
//   return 'not connected'
// })


const giveContractWithSigner = () => {

  contract.value = new ethers.Contract(
      connectedChain.value?.nftRoyaltyContract || '',
      contractAbi.abi,
      signer.value
    )

  window.contract = contract.value;
  window.ethers = ethers

    
}

const mint = async (NFTId: number) => {
  

  contract.value = new ethers.Contract(
    connectedChain.value?.nftRoyaltyContract || '',
    contractAbi.abi,
    signer.value
  )

  const requestedPrice = requestedPriceArr.value[NFTId] as string
  
  const val =  ethers.utils.parseUnits(requestedPrice, "ether")
  

  const txMint = await contract.value.mint(NFTId, { value: ethers.utils.parseUnits(requestedPrice, "ether") })
  
  return await txMint.wait()
}



const contractActions = async (action: string, value: any) => {
  if(!checkWindowEthereum()) return
  
    

  if(!isChainSupported.value) {
    
    if(confirm('Switch to Rinkeby testnet chain and continue?')) {
      await switchToSupportedChain(chains.rinkeby)
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
      
    }

    if (isConnectedAddress) {
      if(confirm('Connect to this dapp and continue?')) {
        await connectWallet()
      } else {
        return
      }
    } else {
      await connectWallet()
    }
  }

  if (action == 'mint') {
    return await mint(value)
  }
}



const loadContractData = async () => {
    
  contractReadOnly = new ethers.Contract(
    connectedChain.value?.nftRoyaltyContract || '',
    contractAbi.abi,
    useWeb3().jsonRpcProvider
  )
  
  window.contractReadOnly = contractReadOnly
  window.jsonRpcProvider = useWeb3().jsonRpcProvider

  // const price = await contractReadOnly.PRICE()
  // const maxMultimint = await contractReadOnly.MAX_MULTIMINT()
  // const mintLimitPerWallet = await contractReadOnly.MINT_LIMIT_PER_WALLET()
  // const saleIsActive = await contractReadOnly.saleIsActive()
  // const totalSupply = await contractReadOnly.totalSupply()
  // const maxSupply = await contractReadOnly.MAX_SUPPLY()

  const royaltyFreeThresholdBigNum = await contractReadOnly.royaltyFreeThreshold()
  // 
  
  royaltyFreeThreshold.value = ethers.utils.formatEther(royaltyFreeThresholdBigNum.toString())
  
  // 
  // 
  // 
  // 
  // 
  // 
  // 
  // 

  // 
}


const listenForNewMints = () => {
  contractReadOnly.on("NewMint", (NFTIds: any) => {
    NFTIds.map((NFTId: BigNumber) => {
      if (NFTsState.value[NFTId.toNumber()]) {
        NFTsState.value[NFTId.toNumber()].isMinted = true
      }
    })
  })
}


onMounted(async () => {
  await initDapp()

  await loadContractData() // jsonRpcProvider ok
  fetchNFTsMetadata()
  listenForNewMints()
})

</script>

<style scoped lang="stylus">
.nfts
  display flex
  flex-wrap wrap
  gap 2rem
  margin 3rem
  justify-content center
  align-items center

.nft
  width 200px
  height 250px
  margin 1rem

.nft-image
  object-fit contain
  max-width 200px
  max-height 200px

.mint-form
  display flex
  margin 0.5rem

.mint-input
  width 90px

.mint-form-eth
  margin 0 0.5rem

</style>
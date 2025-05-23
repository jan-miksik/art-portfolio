<template>
  <!-- <Web3ConnectionInfo /> -->
  <div class="nft-collection" >
    <img src="/into-pieces/IntoPieces.webp" class="nft-collection__mint-image"/>
    <div class="nft-collection__amount">{{ maxSupply }} / {{ mintedNfts }}</div>

    <div class="nft-collection__successfully-minted">
      <Transition name="fade">
        <span class="nft-collection__successfully-minted-message" v-if="isMinted && !mintInProgress">
          𓀆 !minted! 𓀊
        <a :href="openseaAssetLink" class="nft-collection__opensea-link" target="_blank">
          <img src="/opensea-blue-ship.svg" width="30" height="30" alt="opensea logo"/>
        </a>
        <div @click="isMinted = false" class="nft-collection__hide-is-minted-msg">✖</div>
        </span>
      </Transition>
    </div>

    <Transition name="fade">
      <OLoader v-if="mintInProgress" size="large" class="nft-collection__minting-in-progress" />
    </Transition>

    <span class="nft-collection__limit-exceeded" v-if="mintLimitExceeded">
      max 3 pieces per address
    </span>

    <div>
      <form class="nft-collection__mint-form" @submit.prevent="handleMintNFT">
        <div class="nft-collection__input-and-currency">
          <OInput required type="number" step="any" v-model="requestedPrice" label="custom valuation"/>
          <span title="Optimism - second layer of Ethereum">
            <span>{{mainSupportedChain?.nativeCurrency.symbol}}</span>
            <img class="nft-collection__optimism-logo" src="/optimism-ethereum-logo.svg" width="12" height="12" alt="optimism logo"/>
          </span>
        </div>
        <IntoPiecesMintButton class="nft-collection__mint-button" :is-disabled="mintInProgress || mintLimitExceeded">
          <span class="nft-collection__mint-button-text">
            {{mintInProgress ? 'minting' : 'mint'}}
          </span>
        </IntoPiecesMintButton>
      </form>

      <div class="nft-collection__valuation">
        <span class="nft-collection__valuation-full-price">~${{fullMintPrice}}</span>
      </div>

      <div class="nft-collection__links">
        <a :href="openseaCollectionLink" title="collection on Opensea" class="nft-collection__collection-link" target="_blank">
          <img src="/opensea-blue-ship.svg" width="25" height="25" alt="opensea logo"/>
        </a>
        <a :href="mainSupportedChain?.linkToEtherscanIntoPiecesContract" title="contract on Etherscan" class="nft-collection__collection-link" target="_blank">
          <img src="/etherscan-logo.svg" width="23" height="23" alt="etherscan logo"/>
        </a>
      </div>
      <p class="nft-collection__info">
        When we meet,<br/> this NFT will allow you to claim a reward.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">

import { mainSupportedChain } from '~/appSetup'
import contractAbi from '~/abi/IntoPieces.json'
import { switchChain, getGasPrice, estimateGas, writeContract } from '@wagmi/core'
import { config } from '~/config'
import { encodeFunctionData, formatEther, parseEther } from 'viem'
import { createPublicClient, http } from 'viem'
import { optimism, sepolia } from 'viem/chains'
import { useAppKit } from '@reown/appkit/vue'
import { useAccount } from '@wagmi/vue'

const requestedPrice = ref()
const mintInProgress = ref(false)
const isMinted = ref(false)
const maxSupply = ref()
const mintLimitExceeded = ref(false)
const mintedNfts = ref()
const mintPrice = ref()
const fetchingMintPrice = ref()
const ethToUsdExchangeRate = ref()

const account = useAccount()

// Create a public client directly with viem
const client = createPublicClient({
  chain: optimism,
  transport: http()
  // TODO: left for testing on sepolia
  // chain: sepolia,
  // transport: http()
})


const nftId = computed(() => mintedNfts.value ? Number(mintedNfts.value) - 1 : 0)

const openseaAssetLink = computed(() => (`https://opensea.io/assets/${mainSupportedChain.keyName}/${mainSupportedChain.nftIntoPiecesContract}/${nftId.value}`))

const openseaCollectionLink = computed(() => (`https://opensea.io/collection/${mainSupportedChain.nftIntoPiecesCollectionName}`))

const fullMintPrice = computed(() => {
  const hasRequestedPrice = requestedPrice.value || requestedPrice.value === 0
  if(fetchingMintPrice.value && hasRequestedPrice) {
    return '...'
  }
  if(hasRequestedPrice) {
    return mintPrice.value?.fullPriceUsd
  }
  return '?'
})

const getMintPrice = async () => {
  fetchingMintPrice.value = true
  const DEMO_ADDRESS = '0x70ABD75498bE15Ca935C4c514B49D58D9Ae17B51'
  const gasPrice = await getGasPrice(config, {
    chainId: optimism.id, 
  })

  const encodedFunctionData = encodeFunctionData({
    abi: contractAbi.abi,
    functionName: 'safeMint',
    args: [DEMO_ADDRESS]
  });

  const gasEstimate = await estimateGas(config, {
    chainId: optimism.id,
    account: DEMO_ADDRESS,
    to: mainSupportedChain.nftIntoPiecesContract as `0x${string}`,
    value: parseEther('0'),
    data: encodedFunctionData
  })
  const ethToUsdRate = await getEthToUsdExchangeRate();
  const feeCostWei = gasPrice * BigInt(gasEstimate);
  const feeCostEth = formatEther(feeCostWei);
  const feeCostUsd = roundUp(parseFloat(feeCostEth) * ethToUsdRate, 1);
  const customPriceUsd = roundUp((requestedPrice.value || 0) * ethToUsdRate, 1);
  const fullPriceUsd = roundUp(feeCostUsd + customPriceUsd, 1)
  fetchingMintPrice.value = false
  mintPrice.value = { feeCostUsd, customPriceUsd, fullPriceUsd }
}


const mintAction = async () => {
  try {
    const resultHash = await writeContract(config, {
      abi: contractAbi.abi,
      address: mainSupportedChain.nftIntoPiecesContract as `0x${string}`,
      functionName: 'safeMint',
      args: [account.address.value],
      value: parseEther(requestedPrice.value.toString())
    })
    return await client.waitForTransactionReceipt({
      hash: resultHash
    })
  } catch (error) {
    throw error
  }
 
}


const contractActions = async (action: string) => {
  try {
    if (action == 'mint') {
      await mintAction()
      return true
    }
  } catch (error) { 
    mintInProgress.value = false
    if (!(error as Error)?.message) {
      alert('Error')
      return
    }
    
    if ((error as Error)?.message?.startsWith('err: insufficient funds') || (error as any).data?.message?.startsWith('err: insufficient funds')) {
      alert('insufficient funds for transaction')
      return
    }

    if ((error as any)?.message?.startsWith('user rejected transaction')) {
      alert('Transaction rejected')
      return
    } else {
      alert((error as Error)?.message)
    }
    return false
  }
}

const getMintedNFTs = async () => {
  return await client.readContract({
    address: mainSupportedChain.nftIntoPiecesContract as `0x${string}`,
    abi: contractAbi.abi,
    functionName: 'mintedNFTs'
  })
}

const modal = ref()
const isContinueMintAfterConnect = ref(false)

const handleMintNFT = async (event?: Event) => {
  event?.preventDefault()
  modal.value = useAppKit()

  // Wait for user to connect and switch network if needed
  if (!account.address.value) {
    isContinueMintAfterConnect.value = true
    modal.value?.open()
    return
  }
  isContinueMintAfterConnect.value = false

  if (Number(account.chainId) !== mainSupportedChain.chainIdDec) {
    await switchChain(config, { chainId: mainSupportedChain.chainIdDec as 10 })
  }
  
  isMinted.value = false
  mintInProgress.value = true
  const confirmation = await contractActions('mint')
  mintInProgress.value = false
  if (confirmation) {
    requestedPrice.value = undefined
    mintedNfts.value = await getMintedNFTs()
    isMinted.value = true
  }
}

watch(account.address, async (newVal) => {
  if (newVal && isContinueMintAfterConnect.value) {
    await handleMintNFT()
  }
}, { immediate: true })




const checkMintingLimit = async () => {
  if (account?.address.value) {
    const remainingMints = await client.readContract({
      address: mainSupportedChain.nftIntoPiecesContract as `0x${string}`,
      abi: contractAbi.abi,
      functionName: 'allowedMintCount',
      args: [account?.address.value]
    });
    mintLimitExceeded.value = remainingMints === 0
  }
}



const roundUp = (num: number, decimals: number) => Math.ceil(num * 10 ** decimals) / 10 ** decimals;




async function getEthToUsdExchangeRate() {
  try {
    const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
    const data = await response.json();
    ethToUsdExchangeRate.value = data.ethereum.usd;
    return data.ethereum.usd;
  } catch (err) {
    return ethToUsdExchangeRate.value
  }
}



watch(requestedPrice, async () => {
  await getMintPrice()
})



const loadContractData = async () => {

  try {
    const maxSupplyResult = await client.readContract({
      address: mainSupportedChain.nftIntoPiecesContract as `0x${string}`,
      abi: contractAbi.abi,
      functionName: 'MAX_SUPPLY'
    })

    const mintedNftsResult = await getMintedNFTs()

    maxSupply.value = Number(maxSupplyResult ?? 0);
    mintedNfts.value = Number(mintedNftsResult ?? 0);

    await checkMintingLimit(); 

  } catch (error) {
    if (error instanceof Error) {
      console.error('Detailed error:', error.message)
    }
  }
}

onMounted(async () => {
  await loadContractData()
  getMintPrice();
})
</script>

<style scoped lang="stylus">
.nft-collection
  display flex
  justify-content center
  align-items center
  flex-direction column
  color black
  position relative
  background-repeat no-repeat
  border-radius 100%
  width 37rem
  height 32rem
  background-size 190%
  margin-top 5rem

  @media screen and (min-width 370px)
    height 37rem
    background-size 160%

  @media screen and (min-width 410px)
    background-size 150%

  @media screen and (min-width 430px)
    background-size 135%

  @media screen and (min-width 470px)
    background-size 115%

  @media screen and (min-width 530px)
    background-size 100%

  &__mint-image
    object-fit contain
    max-height 370px
    margin-bottom 0.3rem
    border-radius 3px
    max-width 100%

  &__amount
    margin-bottom 1rem
    border-radius 5px
    opacity 0.2

  &__mint-form
    display flex
    align-items center
    justify-content center
    flex-wrap wrap
    gap 0 1rem
    margin 0.5rem 1.5rem

    @media screen and (min-width 330px)
      margin 0.5rem 1.5rem -0.5rem

  &__mint-input
    width 135px

  &__input-and-currency
    display flex
    align-items center

  &__label
    margin-top 0.5rem
    margin-left 0.9rem
    align-self flex-start

  &__successfully-minted
    filter invert(0)
    margin 0.3rem
    color #fff0b8

    &-message
      font-size 3.2rem
      position absolute
      text-align center
      bottom 5rem
      left -5.5rem
      filter drop-shadow(-2px 7px 7px black) drop-shadow(-2px 7px 25px white) drop-shadow(-2px 7px 25px black) drop-shadow(-2px 7px 25px white)

  &__minting-in-progress
    font-size 3.2rem
    position relative
    bottom 15rem
    left 0
    height 0
    filter drop-shadow(-2px 7px 7px #000) drop-shadow(-2px 7px 25px #fff) drop-shadow(-2px 7px 25px #000) drop-shadow(-2px 7px 25px #fff)

  &__limit-exceeded
    color tomato

  &__title
    margin 0 0 0.5rem
    font-family Neonderthaw, sans-serif
    font-size 3rem
    font-weight 300

  &__opensea-link
    position absolute
    cursor pointer
    top -20px
    right 7px
    transition all 0.391s
    opacity 0.5

    &:hover
      opacity 1
      scale 1.1

  &__looksrare-link
    position absolute
    cursor pointer
    top 47px
    right 20px
    transition all 0.391s
    opacity 0.6

    &:hover
      opacity 1
      scale 1.1

  &__hide-is-minted-msg
    position absolute
    cursor pointer
    left 0
    font-size 2rem
    top 0
    color ghostwhite
    transition all 0.391s

    &:hover
      color red

  &__links
    display flex
    align-items center
    justify-content flex-end
    gap 0.5rem
    margin-top 2rem


  &__collection-link
    filter grayscale(1) opacity(0.5)
    transition all 0.391s

    &:hover
      scale 1.17
      filter grayscale(1) opacity(1)

  &__collection-label
    position absolute
    bottom 16px
    right 61px
    rotate 50deg
    color black
    text-shadow -1px 1px 0 #fff

  &__valuation
    display flex
    align-items center
    justify-content center
    flex-direction column

  &__valuation-info
    opacity 0.2
    font-size 0.6rem

  &__valuation-full-price
    opacity 0.6

  &__optimism-logo
    position relative
    top -8px
    filter grayscale(1) opacity(0.3)

  &__mint-button-text:hover
    scale 0.9 1

  &__info
    margin-top 3rem
    max-width 21rem
    text-align center

.dark-mode .nft-collection__successfully-minted
.dark-mode .nft-collection__limit-exceeded
.dark-mode .nft-collection__looksrare-link
.dark-mode .nft-collection__opensea-link
  filter invert(1)


// / Animation /
.fade-enter-active
.fade-leave-active
  transition opacity 0.5s

.fade-enter-from
  opacity 0

.fade-leave-to
  opacity 0

</style>



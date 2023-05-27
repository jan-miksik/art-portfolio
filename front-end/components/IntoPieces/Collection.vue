<template>
  <!-- <Web3ConnectionInfo /> -->
  <div class="nft-collection" >
    <!-- <h2 class="nft-collection__title">Into Pieces</h2> -->


    <img src="/into-pieces/IntoPieces.webp" class="nft-collection__mint-image"/>
    <div class="nft-collection__amount">{{ maxSupply }} / {{ mintedNfts }}</div>

    <div class="nft-collection__successfully-minted">
      <Transition name="fade">
        <span class="nft-collection__successfully-minted-message" v-if="isMinted && !mintInProgress">
          𓀆 !minted! 𓀊
        <a :href="getExplorerLink({type: 'asset', marketplace: 'opensea', nftId})" class="nft-collection__opensea-link" target="_blank">
          <img src="/opensea-blue-ship.svg" width="30" height="30" alt="opensea logo"/>
        </a>
        <!-- <a :href="getExplorerLink({type: 'asset', marketplace: 'looksrare', nftId})" class="nft-collection__looksrare-link" target="_blank">
          <img src="/looksrare.svg" width="45" height="45" alt="looksrare logo"/>
        </a> -->
        <div @click="isMinted = false" class="nft-collection__hide-is-minted-msg">✖</div>
        </span>
      </Transition>
    </div>

    <Transition name="fade">
      <Loader v-if="mintInProgress" size="large" class="nft-collection__minting-in-progress" />
    </Transition>

    <span class="nft-collection__limit-exceeded" v-if="mintLimitExceeded">
      max 3 pieces per address
    </span>

    <div>
      <form class="nft-collection__mint-form" @submit.prevent="handleMintNFT">
        <div class="nft-collection__input-and-currency">
          <Input required type="number" step="any" v-model="requestedPrice" label="custom valuation"/>
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
        <span class="nft-collection__valuation-full-price">~${{fullMintPrice}}~</span>
        <!-- <span class="nft-collection__valuation-info">(${{customPriceUsd}} custom valuation
        + ${{feeCostUsd}} Network fee)</span> -->
      </div>

      <div class="nft-collection__links">
        <!-- <a :href="getExplorerLink({type: 'collection', marketplace: 'quix'})" title="collection on Quix" class="nft-collection__collection-link" target="_blank">
          <img src="/quix.svg" width="23" height="23" alt="quix logo"/>
        </a> -->
        <a :href="getExplorerLink({type: 'collection', marketplace: 'opensea'})" title="collection on Opensea" class="nft-collection__collection-link" target="_blank">
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
  <!-- <ThreeJsTesting /> -->
</template>



<script setup lang="ts">

import { BigNumberish, ethers } from 'ethers'
import useWeb3 from '~/J/useWeb3'
import { mainSupportedChain } from '~/appSetup'
import { connectedChain } from '~/constants/chains'
import contractAbi from '~/abi/IntoPieces.json'
import useCryptoExplorer from '~/J/useCryptoExplorer'

const { initDapp, signer, checkForAnyContractAction, connectedAddress, connectWallet, optimismProvider } = useWeb3()
const { getExplorerLink } = useCryptoExplorer()

let contractReadOnly: any = null

const requestedPrice = ref()
const contract = ref()
const mintInProgress = ref(false)
const isMinted = ref(false)
const maxSupply = ref<BigNumberish>()
const mintLimitExceeded = ref(false)
const mintedNfts = ref<BigNumberish>()
const mintPrice = ref()
const fetchingMintPrice = ref()
const ethToUsdExchangeRate = ref()

const nftId = computed(() => mintedNfts.value ? Number(mintedNfts.value) - 1 : 0)
// const explorerLink = computed(() => getExplorerLink({type: 'asset', marketplace: 'opensea', nftId: nftId.value}))

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
// const customPriceUsd = computed(() => fetchingMintPrice.value ? '...' : mintPrice.value?.customPriceUsd)
// const feeCostUsd = computed(() => fetchingMintPrice.value ? '...' : mintPrice.value?.feeCostUsd)

const getMintPrice = async () => {
  fetchingMintPrice.value = true

  const DEMO_ADDRESS = '0x70ABD75498bE15Ca935C4c514B49D58D9Ae17B51'
  const gasPrice = await optimismProvider.getGasPrice();
  const gasEstimate = await contractReadOnly.estimateGas.safeMint(DEMO_ADDRESS, {
    value: ethers.utils.parseEther('0')
  });
  const ethToUsdRate = await getEthToUsdExchangeRate();
  const feeCostWei = gasPrice.mul(gasEstimate);
  const feeCostEth = ethers.utils.formatEther(feeCostWei);
  const feeCostUsd = roundUp(parseFloat(feeCostEth) * ethToUsdRate, 1);
  const customPriceUsd = roundUp((requestedPrice.value || 0) * ethToUsdRate, 1);
  const fullPriceUsd = roundUp(feeCostUsd + customPriceUsd, 1)
  fetchingMintPrice.value = false
  
  mintPrice.value = { feeCostUsd, customPriceUsd, fullPriceUsd }
}


const mintAction = async () => {
  contract.value = new ethers.Contract(
    connectedChain.value?.nftIntoPiecesContract || '',
    contractAbi.abi,
    signer.value
    )

  try {
    const txMint = await contract.value.safeMint(connectedAddress.value, {
      value: ethers.utils.parseEther(requestedPrice.value.toString())
    })
    return await txMint.wait()
  } catch (error) {
    throw error
  }
 
}

const contractActions = async (action: string) => {
  const canContinue = await checkForAnyContractAction()
  console.log('canContinue: ', canContinue);
  if (!canContinue) return
  try {
    if (action == 'mint') {
      await mintAction()
      return true
    }
  } catch (error) { 
    console.log('error: ', error);
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




const handleMintNFT = async (event: Event) => {
  event.preventDefault()
  await connectWallet()
  isMinted.value = false
  mintInProgress.value = true
  const confirmation = await contractActions('mint')
  mintInProgress.value = false
  if (confirmation) {
    requestedPrice.value = undefined
    mintedNfts.value = await contractReadOnly.mintedNFTs()
    isMinted.value = true
  }
}




const checkMintingLimit = async (account?: string) => {
  if (account || connectedAddress.value) {
    const remainingMints: BigNumberish = await contractReadOnly.allowedMintCount(
      account || connectedAddress.value
      )
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
  contractReadOnly = new ethers.Contract(
    mainSupportedChain.nftIntoPiecesContract || '',
    contractAbi.abi,
    useWeb3().jsonRpcProvider
    )

  window.contractReadOnly = contractReadOnly
  window.jsonRpcProvider = useWeb3().jsonRpcProvider

  maxSupply.value = await contractReadOnly.MAX_SUPPLY()
  mintedNfts.value = +await contractReadOnly.mintedNFTs()

  checkMintingLimit()
}

onMounted(async () => {
  await initDapp()
  await loadContractData()
  getMintPrice();
  // listenForAccountChange()
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
  // background-image url("collect/breeze-edit-bg.png")
  background-repeat no-repeat
  border-radius 100%
  width 37rem
  height 32rem
  background-size 190%
  margin-top: 5rem;
  // animation morphing 2s infinite alternate ease-in-out

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
    // position absolute
    // min-width 100%
    max-height 370px
    margin-bottom 0.3rem
    border-radius 3px
    max-width 100%
    // box-shadow 0 1px 3px 1px #cac9cf

  &__amount
    margin-bottom 1rem
    border-radius 5px
    opacity 0.2
    // font-family system-ui

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

    // font-family AlumniSans, sans-serif
    // color white

  &__opensea-link
    position absolute
    cursor pointer
    top -20px
    right 7px
    transition all 0.391s
    opacity 0.5

    &:hover
      // rotate -17deg
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
    // gap: 0.2rem;
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
    margin-top: 3rem;
    max-width: 21rem;

.dark-mode .nft-collection__successfully-minted
.dark-mode .nft-collection__limit-exceeded
// .dark-mode .nft-collection__mint-button
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



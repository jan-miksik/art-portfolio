<template>
  <!-- <Web3ConnectionInfo /> -->
  <div class="nft-collection">
    <h2 class="nft-collection__title-breeze-edit">Hat</h2>
    <img src="/collect/collect.webp" class="nft-collection__mint-image" />
    <div class="nft-collection__amount">{{ maxSupply?.toNumber() }} / {{mintedNfts?.toNumber()}}</div>

    <div class="nft-collection__successfully-minted">
      <Transition name="fade">
        <span class="nft-collection__successfully-minted-message" v-if="isMinted && !mintInProgress">
          𓀆 !minted! 𓀊
        <a :href="getExplorerLink({type: 'asset', marketplace: 'opensea', nftId: nftId})" class="nft-collection__opensea-link" target="_blank">
          <img src="/opensea-blue-ship.svg" width="30" height="30" alt="opensea logo"/>
        </a>
        <a :href="getExplorerLink({type: 'asset', marketplace: 'looksrare', nftId})" class="nft-collection__looksrare-link" target="_blank">
          <img src="/looksrare.svg" width="45" height="45" alt="looksrare logo"/>
        </a>
        <div @click="isMinted = false" class="nft-collection__hide-is-minted-msg">✖</div>
        </span>
      </Transition>
    </div>

    <Transition name="fade">
      <Loader v-if="mintInProgress" size="large" class="nft-collection__minting-in-progress" />
    </Transition>
    <span class="nft-collection__limit-exceeded" v-if="mintLimitExceeded">
      max 7 pieces per address
    </span>

    <form class="nft-collection__mint-form" @submit.prevent="handleMintNFT">
      <div class="nft-collection__input-and-currency">
        <Input required type="number" step="any" v-model="requestedPrice"/>
        <span>{{mainSupportedChain?.nativeCurrency.symbol}}</span>
      </div>

      <Button class="nft-collection__mint-button" :disabled="mintInProgress || mintLimitExceeded">
        {{mintInProgress ? 'Minting' : 'Mint'}}
      </Button>

      <a :href="getExplorerLink({type: 'collection', marketplace: 'opensea'})" title="collection on Opensea" class="nft-collection__opensea-collection-link" target="_blank">
          <img src="/opensea-blue-ship.svg" width="25" height="25" alt="opensea logo"/>
        </a>
        <a :href="getExplorerLink({type: 'collection', marketplace: 'looksrare'})" title="collection on Looksrare" class="nft-collection__looksrare-collection-link" target="_blank">
          <img src="/looksrare.svg" width="35" height="35" alt="looksrare logo"/>
        </a>
    </form>
    <!-- <div @click="handleOpenseaAssetLink">TEST</div>-->
    <div @click="isMinted = !isMinted">Like a Minted</div> 
    <div class="nft-collection__collection-label">collection</div>
  </div>
  <!-- <ThreeJsTesting /> -->
</template>



<script setup lang="ts">

// TODOS



//////// extra stuff /////////
  // restyling #2
  // links to markets - styling #2
  // refactor useWeb3 into more general usage
  // ?replace browser alert & confirm pop-ups with modal windows, (if user does not have installed metamask). (if user is on different chain)
  // create description text, name and select or modify picture #2

  // refactoring after testing on testnet
  // successfully minted - next iteration
  
  // add web3 modal?
  //support for multiple wallets?
  //better manage eht provider


// DONOS
// warning if user does not have enough funds
// links to opensea and another open markets
// create description text, name and select or modify picture
// restyling
// polygon/mumbai version
// add maxSupply/minted

// error messages limit exceeded
// info about wallet and connected chain

import { BigNumber, ethers } from 'ethers'
import useWeb3 from '~/J/useWeb3'
import { mainSupportedChain } from '~/appSetup'
import { connectedChain } from '~/constants/chains'
import contractAbi from '~/abi/NftHat.json'
import useCryptoExplorer from '~/J/useCryptoExplorer'

const { initDapp, signer, checkForAnyContractAction, connectedAddress } =
  useWeb3()

const { getExplorerLink } = useCryptoExplorer()

let contractReadOnly: any = null

const requestedPrice = ref()
const contract = ref()
const mintInProgress = ref(false)
const isMinted = ref(false)
const maxSupply = ref<BigNumber>()
const mintLimitExceeded = ref(false)
const mintedNfts = ref<BigNumber>()

const handleMintNFT = async () => {
  
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

const nftId = computed(() => mintedNfts.value?.toNumber() ? mintedNfts.value?.toNumber() - 1 : 0)

const mintAction = async () => {
  
  contract.value = new ethers.Contract(
    connectedChain.value?.nftHatContract || '',
    contractAbi.abi,
    signer.value
    )

  try {
    const txMint = await contract.value.mint(connectedAddress.value, {
      value: ethers.utils.parseEther(requestedPrice.value.toString())
    })
    return await txMint.wait()
  } catch (error) {
    console.error('mintAction error: ', error)
    throw error
  }
 
}

const contractActions = async (action: string) => {
  
  await checkForAnyContractAction()

  try {
    if (action == 'mint') {
      return await mintAction()
    }
  } catch (error) { 
    if (!(error as Error).message) return alert('Error')
    if ((error as Error).message.startsWith('insufficient funds for')) {
      alert('insufficient funds for transaction')
    } else {
      alert((error as Error).message)
    }

    
  }
}

const checkMintingLimit = async (account?: string) => {
  if (account || connectedAddress.value) {
    const remainingMints: BigNumber = await contractReadOnly.allowedMintCount(
      account || connectedAddress.value
    )
    mintLimitExceeded.value = remainingMints.toNumber() === 0
  }
}

const listenForAccountChange = () => {
  window.ethereum.on('accountsChanged', async ([account]: string) => {
    checkMintingLimit(account)
  })
}

const loadContractData = async () => {
  contractReadOnly = new ethers.Contract(
    mainSupportedChain.nftHatContract || '',
    contractAbi.abi,
    useWeb3().jsonRpcProvider
    )

  window.contractReadOnly = contractReadOnly
  window.jsonRpcProvider = useWeb3().jsonRpcProvider

  maxSupply.value = await contractReadOnly.MAX_SUPPLY()
  mintedNfts.value = await contractReadOnly.mintedNFTs()

  checkMintingLimit()
}

onMounted(async () => {
  await initDapp()
  await loadContractData()
  listenForAccountChange()
})
</script>

<style scoped lang="stylus">
.nft-collection
  display flex
  justify-content center
  align-items center
  flex-direction column
  color floralwhite
  position relative
  background-image url("collect/breeze-edit-bg.png")
  background-repeat no-repeat
  border-radius 100%
  width 35rem
  height 39rem
  background-size 190%
  // animation morphing 2s infinite alternate ease-in-out

  @media screen and (min-width 370px)
    height 35rem
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
    max-height 250px
    margin-bottom 0.3rem
    border-radius 3px
    max-width 100%
    box-shadow 0 1px 3px 1px #cac9cf

  &__amount
    margin-bottom 1rem
    border-radius 5px
    font-family system-ui

  &__mint-form
    display flex
    align-items center
    justify-content center
    flex-wrap wrap
    gap 0.5rem
    margin 0.5rem 1.5rem 2rem

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
    bottom 12rem
    left 0
    height 0
    filter drop-shadow(-2px 7px 7px #000) drop-shadow(-2px 7px 25px #fff) drop-shadow(-2px 7px 25px #000) drop-shadow(-2px 7px 25px #fff)

  &__limit-exceeded
    color tomato

  &__title-breeze-edit
    margin 0 0 0.5rem
    font-family system-ui
    color whitesmoke

  &__opensea-link
    position absolute
    bottom 37px
    left 12px
    transition all 0.391s
    opacity 0.5

    &:hover
      // rotate -17deg
      opacity 1
      scale 1.1

  &__looksrare-link
    position absolute
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

  &__opensea-collection-link
    position absolute
    bottom 27px
    right 70px
    transition all 0.391s

    &:hover
      scale 1.17

  &__looksrare-collection-link
    position absolute
    bottom 0
    right 100px
    transition all 0.391s

    &:hover
      scale 1.17

  &__collection-label
    position absolute
    bottom 16px
    right 61px
    rotate 50deg
    color black
    text-shadow -1px 1px 0 #fff


.dark-mode .nft-collection__successfully-minted
.dark-mode .nft-collection__limit-exceeded
.dark-mode .nft-collection__mint-button
.dark-mode .nft-collection__looksrare-link
.dark-mode .nft-collection__opensea-link
  filter invert(1)


// / Animation /
.fade-enter-active
.fade-leave-active
  transition opacity 0.5s


.fade-enter-from
  opacity 0
  // translate 0 0
  // rotate 20deg

.fade-leave-to
  opacity 0
  // translate 0 100px
  // rotate 20deg

/* unused variant with morphing circle
.nft-collection

background ghostwhite
background-clip padding-box // !importanté
border solid 5px transparent // !importanté
border-radius 33% 67% 58% 42% / 63% 68% 32% 37%
animation morphing 60s infinite alternate ease-in-out

&::before
  content ""
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index -1
  margin -1px // !importanté
  border-radius inherit // !importanté
  // margin -1px
  // border-radius inherit
  background linear-gradient(346deg, #1e9e6aa8, #0d0a023b 28%, #0f0d000a 80%, #448acc8a)

@keyframes morphing
  0%
    border-radius 78% 80% 78% 89%/66% 59% 91% 57%

  25%
    border-radius 58% 42% 75% 25% / 76% 46% 54% 24%

  50%
    border-radius 50% 50% 33% 67% / 55% 27% 73% 45%

  100%
    border-radius 33% 67% 58% 42% / 63% 68% 32% 37%
*/

</style>



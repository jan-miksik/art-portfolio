<template>
  <div class="nft-collection">
    <img
      src="geometry/indoor,2018,drawing on paper,21x30cm.jpg"
      class="nft-collection__mint-image"
    />
    <div>{{maxSupply?.toNumber()}}</div>
    <div class="nft-collection__successfully-minted">
        <div>
          <Transition name="fade">
          <span class="nft-collection__successfully-minted-message" v-if="isMinted && !mintInProgress">
            𓀆📨 !minted! 📨𓀊
          </span>
        </Transition>
        <Transition name="fade">
          <Loader v-if="mintInProgress" size="large" class="nft-collection__minting-in-progress"/>
        </Transition>
        </div>
    </div>

    <label  class="nft-collection__label">arbitrary price</label>
    <form class="nft-collection__mint-form" @submit.prevent="handleMintNFT">
      <input
        class="nft-collection__mint-input"
        required
        type="number"
        step="any"
        v-model="requestedPrice"
        name="image-name"
      />

      <span>ETH</span>
      <input type="submit" :value="mintInProgress ? 'minting' : 'mint'" :disabled="mintInProgress">
    </form>
    <button @click="isMinted = !isMinted">give contract with signer</button>
    <button @click="mintInProgress = !mintInProgress">switch loading</button>
  </div>
</template>

<script setup lang="ts">
// TODOS


// error messages limit exceeded
// polygon/mumbai version

// add maxSupply/minted

// links to opensea and another open markets
// restyling
// create description text, name and select or modify picture
// replace browser alert & confirm pop-ups with modal windows, (if user does not have installed metamask). (if user is on different chain)


//////// extra stuff /////////
// refactoring after testing on testnet
// successfully minted - next iteration


// ???
// add web3 modal?
//support for multiple wallets?
//better manage eht provider

// DONOS


import { BigNumber, ethers } from 'ethers'
import useWeb3 from '~/J/useWeb3'
import { connectedChain } from '~/constants/chains'
import contractAbi from '~/../contracts/artifacts/contracts/NftArbitraryPrice.sol/NftArbitraryPrice.json'

const {
  initDapp,
  signer,
  checkForAnyContractAction,
  connectedAddress
} = useWeb3()

let contractReadOnly: any = null

const requestedPrice = ref()
const contract = ref()
const mintInProgress = ref(true)
const isMinted = ref(false)
const maxSupply = ref<BigNumber>()

const handleMintNFT = async () => {
  // event.preventDefault()
  isMinted.value = false
  mintInProgress.value = true
  const confirmation = await contractActions('mint')

  mintInProgress.value = false
  if (confirmation) {
    isMinted.value = true
  }
}

// const giveContractWithSigner = () => {
//   contract.value = new ethers.Contract(
//     connectedChain.value?.nftACPContract || '',
//     contractAbi.abi,
//     signer.value
//   )
//   window.contract = contract.value
//   window.ethers = ethers
// }

const mintAction = async () => {
  contract.value = new ethers.Contract(
    connectedChain.value?.nftACPContract || '',
    contractAbi.abi,
    signer.value
  )

  const requestedPriceParsed = ethers.utils.parseUnits(
    requestedPrice.value.toString(),
    'ether'
    )
  const txMint = await contract.value.mint(connectedAddress.value, 1, {
    value: ethers.utils.parseUnits(
    requestedPrice.value.toString(),
    'ether'
    )
  })

  return await txMint.wait()
}



const contractActions = async (action: string) => {
  await checkForAnyContractAction()

  try {
    if (action == 'mint') {
      return await mintAction()
    }
  } catch (error) {}
}

const loadContractData = async () => {
  contractReadOnly = new ethers.Contract(
    connectedChain.value?.nftACPContract || '',
    contractAbi.abi,
    useWeb3().jsonRpcProvider
  )

  window.contractReadOnly = contractReadOnly
  window.jsonRpcProvider = useWeb3().jsonRpcProvider

  maxSupply.value = await contractReadOnly.MAX_SUPPLY()
}

onMounted(async () => {
  await initDapp()
  await loadContractData()
})
</script>

<style scoped lang="stylus">
.nft-collection
  display flex
  justify-content center
  align-items center
  flex-direction column

  &__mint-image
    object-fit contain
    max-width 250px
    max-height 350px
    margin-bottom 0.3rem

  &__mint-form
    display flex
    align-items center
    gap 0.5rem
    margin 0.5rem 0 2rem

  &__mint-input
    width 135px

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

.dark-mode .nft-collection__successfully-minted
  filter invert(1)

// / Animation /
.fade-enter-active
.fade-leave-active
  transition opacity 0.7s


.fade-enter-from
  opacity 0


.fade-leave-to
  opacity 0

</style>

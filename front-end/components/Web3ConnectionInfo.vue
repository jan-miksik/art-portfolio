<template>

  <div class="web3-connection-info">
    <div :class="['web3-connection-info__chain', {'web3-connection-info__chain--hover': !connectedChain?.isChainSupported }]" @click="switchToSupportedChain(mainSupportedChain)" :title="connectedChain?.isChainSupported ? 'connected chain' : 'please connect to supported chain'">
      <span v-if="connectedChain" >
        {{connectedChain?.name}}
      </span>
      <span v-else>
        unknown chain
      </span>
      <svg v-if="!connectedChain?.isChainSupported" class="web3-connection-info__exlamation" style="color: tomato" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" fill="tomato"></path></svg>
    </div>

    <div class="web3-connection-info__connected-address" @click="connectWallet">
      <span v-if="connectedAddress">
        {{shortenCryptoAddress(connectedAddress)}}
      </span>
      <span v-else>
        connect wallet
      </span>
    </div>

  </div>
</template>

<script setup lang="ts">
import useWeb3 from '~/J/useWeb3'
import { mainSupportedChain } from '~/appSetup'
import shortenCryptoAddress from '~/utils/shortenCryptoAddress'
import { connectedChain } from '~/constants/chains' 

const {
  connectedAddress,
  switchToSupportedChain,
  connectWallet,
} = useWeb3()

</script>

<style scoped lang="stylus">
.web3-connection-info
  display flex
  gap 1rem
  position absolute
  top 0.5rem
  right 1%

  &__chain
    display flex
    align-items center
    border-radius 5px
    padding 0.15rem 0.5rem
    opacity 0.8
    background palegoldenrod
    box-shadow 0 1px 1px 0 #b0b0b0

    &--hover
      cursor pointer

      &:hover
        opacity 1

  &__connected-address
    border-radius 5px
    padding 0.15rem 0.5rem
    box-shadow 0 1px 1px 0 #b0b0b0
    background-color snow
    display flex
    text-align center
    justify-content center
    width 6.5rem
    align-items center
    opacity 0.9
    // cursor pointer

    // &:hover
    //   opacity 1

  &__connected-address-text
    &:hover
      content "disconnect"

  &__exlamation
    margin-left 0.5rem
    height 15px

  &__please-switch
    color red

.dark-mode .web3-connection-info__chain
  box-shadow 0 1px 1px 0 #fff
  filter invert(1)

.dark-mode .web3-connection-info__connected-address
  filter invert(1)

</style>
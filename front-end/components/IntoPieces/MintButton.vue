<template>
  <button type="submit" :class="['mint-into-pieces-button', {'animated-button': !isDisabled, 'button--disabled': isDisabled}]"
    :disabled="isDisabled">
    <slot/>
    <!-- <div v-if="!isDisabled" class="animated-button__hover">
      <img src="/collect/leaffy-mint.png" class="mint-into-pieces-button__mint-image" />
    </div> -->
  </button>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
// import { useAppKit } from '@reown/appkit/vue'

interface Props {
  isDisabled?: boolean
  type?: string
}
// const modal = ref()

// onMounted(() => {
//   nextTick(() => {
//     modal.value = useAppKit()
//   })
// })

// const handleMint = () => {
//   if (props.isDisabled) return
//   modal.value?.open()
// }

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  type: "submit"
})

</script>

<style lang="stylus" scoped>
.mint-into-pieces-button
  border-radius 5px
  font-size 1rem
  border 1px solid transparent
  // border none
  cursor pointer
  padding 0.5rem 0.7rem
  // box-shadow 0 1px 2px 0 #b0b0b0
  // background-color #2bc121
  background #1e9e6a
  color white
  text-align center
  justify-content center
  font-family Kurland, sans-serif
  // color black
  text-transform uppercase
  // opacity 0.8
  transition all 0.2s
  // box-shadow 0 1px 2px 0 #1e9e6a, 0 1px 5px 0 #979797
  // border 1px solid black

  &--disabled
    opacity 0.5
    cursor not-allowed

.dark-mode .mint-into-pieces-button
  background #db6394
  color black

.mint-into-pieces-button:hover:not(:disabled)
  // opacity 1
  // filter: drop-shadow(0px 0px 1px #1e9e6a);
  // scale: 1.1 0.9;
  color: #b0f9db;
  // transition all 0.2s
  // animation-name background-color-palette
  // animation-duration 3.5s
  // animation-iteration-count infinite
  // animation-direction alternate

  @media (min-width: 600px)
    opacity 1
  // box-shadow 0 1px 0 0 #1e9e6a
.dark-mode .mint-into-pieces-button:hover:not(:disabled)
  color: #520d29;
// .animated-button:hover
//   background-color #1e9e6a

// .animated-button::before
//   // content ""
//   position absolute
//   top 50%
//   left 50%
//   width 0
//   height 0
//   background-color #1e9e6a
//   opacity 0.5
//   border-radius 5%
//   transform translate(-50%, -50%) scale(0)
//   transition width 0.3s, height 0.3s

//   @media (min-width: 600px)
//     content ""

// .animated-button:hover::before
//   width 100%
//   height 100%
//   transform translate(-50%, -50%) scale(1)

// .animated-button__hover
//   display none
//   position absolute
//   font-size 5rem
//   transform translate(-64%, -91%) scale(1)
//   width 100%
//   height 100%
//   color white
//   max-width 75%

// .dark-mode .animated-button__hover
// .dark-mode .animated-button::before
//   filter invert(1)


// .animated-button:hover .animated-button__hover
//   display none
  
//   @media (min-width: 600px)
//     display flex
//     justify-content center
//     align-items center

// .mint-into-pieces-button__mint-image
//   max-width 100%

</style>
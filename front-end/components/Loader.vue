<template>
  <div class="loader">
    <div v-if="isText">{{ props.loadingText }}</div>
    <div :class="['loader__content ml-3', `loader__content-${props.size}`]">
      <span :class="`loader__circle-${props.ringColor}`"></span>
      <span :class="`loader__circle-${props.ringColor}`"></span>
      <span :class="`loader__circle-${props.ringColor}`"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  loadingText?: string
  isText?: boolean
  size?: 'small' | 'medium' | 'large'
  ringColor?: 'black' | 'white'
}

const props = withDefaults(defineProps<Props>(), {
  loadingText: 'loading',
  isText: false,
  size: 'small',
  ringColor: 'black',
})
</script>

<style lang="stylus" scoped>
.loader
  position relative
  display flex
  justify-content center
  align-items center
  width 100%


.loader__content
  position relative
  display flex
  justify-content center
  align-items center

  // color: #fff;
  font-family "Courier New", Courier, monospace
  font-weight 500


.loader__content-small
  width 25px
  height 25px


.loader__content-medium
  width 35px
  height 35px


.loader__content-large
  width 70px
  height 70px


.loader__content span
  position absolute
  top 0
  left 0
  width 100%
  height 100%
  pointer-events none
  animation animateThreads 5s linear infinite


.loader__circle-white
  border 1px solid rgb(255 255 255)


.loader__circle-black
  border 1px solid rgb(0 0 0)


.loader__content span:nth-child(1)
  border-radius 30% 70% 70% 30% / 30% 30% 70% 70%


.loader__content span:nth-child(2)
  animation-direction reverse
  border-radius 67% 33% 70% 30% / 75% 65% 35% 25%


.loader__content span:nth-child(3)
  animation-duration 3s
  border-radius 52% 48% 70% 30% / 41% 65% 35% 59%


// stylelint-disable-next-line keyframes-name-pattern
@keyframes animateThreads
  0%
    transform rotate(0deg)

  100%
    transform rotate(360deg)

</style>

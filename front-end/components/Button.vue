<template>
  <button type="submit" class="button animated-button"
    :disabled="isDisabled">
    <slot/>
  </button>
</template>

<script setup lang="ts">

interface Props {
  isDisabled?: boolean
  type?: string
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  type: "submit"
})

</script>

<style lang="stylus" scoped>
.button
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
  // color black
  // opacity 0.8
  transition all 0.2s
  // box-shadow 0 1px 2px 0 #1e9e6a, 0 1px 5px 0 #979797
  // border 1px solid black


  &:hover
    opacity 1
    transition all 0.2s
    // box-shadow 0 1px 0 0 #1e9e6a

.animated-button:hover
  background-color #1e9e6a


.animated-button::before
  content "mint"
  position absolute
  top 50%
  left 50%
  width 0
  height 0
  background-color #1e9e6a
  opacity 0.5
  border-radius 5%
  transform translate(-50%, -50%) scale(0)
  transition width 0.3s, height 0.3s


.animated-button:hover::before
  width 100%
  height 100%
  transform translate(-50%, -50%) scale(1)

</style>
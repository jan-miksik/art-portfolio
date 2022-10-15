<template>
  <button type="submit" class="button"
    :disabled="isDisabled">
    <slot/>
  </button>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

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
  // border 1px solid transparent
  cursor pointer
  padding 0.5rem 0.7rem
  // box-shadow 0 1px 2px 0 #b0b0b0
  // background-color #2bc121
  text-align center
  justify-content center
  color black
  // opacity 0.8
  transition all 0.2s
  box-shadow 0 1px 2px 0 #1e9e6a, 0 1px 5px 0 #979797
  border 1px solid black


  &:hover
    opacity 1
    transition all 0.2s
    box-shadow 0 1px 0 0 #1e9e6a


</style>
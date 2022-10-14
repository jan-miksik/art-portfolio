<template>
  <div class="input">
    <label class="input__label">setup own price</label>
    <input class="input__body" :step="step" :required="required" :type="type" v-model="vModel"
      name="image-name" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

interface Props {
  isDisabled?: boolean
  type?: string
  vModel?: string | number
  step?: string
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
  type: "submit"
})
</script>

<style lang="stylus" scoped>
.input
  display flex
  flex-direction column
  align-items flex-start
  gap 0.1rem
  outline 10px solid #fff
  background white
  border-radius 0 1px
  margin 0 0.5rem 1rem

  &__label
    opacity 0.7
    font-size 0.9rem

  &__body
    padding 0.5rem
    border-radius 5px
    // border 1px solid #7c7c7c
    outline none
    border 2px solid #e8e8e8
    border-style ridge
    box-shadow inset 0 0 11px 0 #f1f1ff

</style>
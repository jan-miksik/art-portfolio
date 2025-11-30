<template>
  <button 
    type="submit" 
    :class="['mint-into-pieces-button', {'animated-button': !props.isDisabled, 'button--disabled': isDisabled}]"
    :disabled="isDisabled"
    :aria-label="ariaLabel || 'Mint NFT'"
    :aria-disabled="isDisabled"
  >
    <slot/>
  </button>
</template>

<script setup lang="ts">

interface Props {
  isDisabled?: boolean
  ariaLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  isDisabled: false,
})

</script>

<style lang="stylus" scoped>
.mint-into-pieces-button
  border-radius 5px
  font-size 1rem
  border 1px solid transparent
  cursor pointer
  padding 0.5rem 0.7rem
  background #1e9e6a
  color white
  text-align center
  justify-content center
  font-family Kurland, sans-serif
  text-transform uppercase
  transition all 0.2s

  &--disabled
    opacity 0.5
    cursor not-allowed

.dark-mode .mint-into-pieces-button
  background #db6394
  color black

.mint-into-pieces-button:hover:not(:disabled)
  color: #b0f9db;

  @media (min-width: 600px)
    opacity 1

.dark-mode .mint-into-pieces-button:hover:not(:disabled)
  color: #520d29;

</style>
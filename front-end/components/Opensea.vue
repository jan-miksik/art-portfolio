<template>
    <a
      class="opensea"
      :style="openseaStyle"
      href="https://opensea.io/collection/various-pictures-2"
      target="_blank"
      rel="noopener noreferrer"
    >
        opensea <img src="~/assets/external.svg" class="opensea__external-icon" width="35" height="35" alt="external" />
    </a>
  </template>
  
<script setup lang="ts">
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const openseaPosition = ref({
  x: 10100,
  y: 5200
})

const openseaStyle = computed(() => {
  return {
    left: `${openseaPosition.value.x + LEFT_OFFSET}px`,
    top: `${openseaPosition.value.y + TOP_OFFSET}px`,
  }
})

// alternative way style
// &:hover
// cursor: url("/jan.png") 35 35, pointer;

</script>

<style lang="stylus" scoped>
.opensea
  position absolute
  font-size: 5rem;
  color: black;

.opensea__external-icon
  position: absolute;
  right: -30px;
  top: 20px;

</style>
  

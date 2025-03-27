<template>
    <a
      class="jan-miksik-com"
      :style="janMiksikComStyle"
      href="https://janmiksik.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
        janmiksik.com
    </a>
  </template>
  
<script setup lang="ts">
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const janMiksikComPosition = ref({
  x: 8500,
  y: 7000
})

const janMiksikComStyle = computed(() => {
  return {
    left: `${janMiksikComPosition.value.x + LEFT_OFFSET}px`,
    top: `${janMiksikComPosition.value.y + TOP_OFFSET}px`,
  }
})

// alternative way style
// &:hover
// cursor: url("/jan.png") 35 35, pointer;

</script>

<style lang="stylus" scoped>
.jan-miksik-com
  position absolute
  font-size: 5rem;
  color: black;

</style>
  

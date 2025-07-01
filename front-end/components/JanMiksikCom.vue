<template>
    <a
      class="jan-miksik-com"
      :style="janMiksikComStyle"
      href="https://janmiksik.com/"
      target="_blank"
      rel="noopener noreferrer"
    >
        janmiksik.com
        <img src="~/assets/external.svg" class="jan-miksik-com__external-icon" width="35" height="35" alt="external" />
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

</script>

<style lang="stylus" scoped>
.jan-miksik-com
  position absolute
  font-size: 5rem;
  color: black;
  width: max-content;

.jan-miksik-com__external-icon
  position: absolute;
  right: -30px;
  top: 20px;

</style>
  

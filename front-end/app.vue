<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import useContentful from '~/api/useContentful'
import usePieces from '~/J/usePieces'

const { fetchContentfulData } = useContentful()
const { mergeContentfulDataWithLocalData } = usePieces()

onMounted(async () => {
  await fetchContentfulData()
  mergeContentfulDataWithLocalData()
})


declare global {
  interface Window {
    ethereum?: any;
  }
}

</script>

<style lang="stylus">
:root
  --image-filter-invert 1


html
  scroll-behavior smooth
  transition all 0.6s

@font-face
  font-family RalewayDots
  unicode-range U+000-5FF
  src url("~/assets/fonts/Raleway_Dots/RalewayDots-Regular.ttf")

@font-face
  font-family BungeeHairline
  font-weight normal
  unicode-range U+000-5FF
  src url("~/assets/fonts/Bungee_Hairline/BungeeHairline-Regular.ttf")

body
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin 0
  overflow-x hidden
  background-color ghostwhite


.dark-mode
  filter invert(1)


.dark-mode img
  filter invert(var(--image-filter-invert))

.rotate-all
  transform rotate(1080deg)
  transition all 3s

</style>

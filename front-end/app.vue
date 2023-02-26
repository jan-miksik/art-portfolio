
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

</script>

<style lang="stylus">
:root
  --image-filter-invert 1


html
  scroll-behavior smooth
  transition all 0.6s
  overflow-y scroll
  overflow-x hidden

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

// Scrollbar
body
  --scrollbar-foreground rgb(248 248 255)
  --scrollbar-background #000
  // Foreground, Background
  scrollbar-color var(--scrollbar-foreground) var(--scrollbar-background)

body::-webkit-scrollbar
  width 5px
  height 5px

body::-webkit-scrollbar-thumb // Foreground
  background var(--scrollbar-foreground)

body::-webkit-scrollbar-track // Background
  background var(--scrollbar-background)


.dark-mode
  filter invert(0.97)


.dark-mode img
  filter invert(var(--image-filter-invert))

.rotate-all
  transform rotate(1080deg)
  transition all 3s

// Chrome, Safari, Edge, Opera
input::-webkit-outer-spin-button
input::-webkit-inner-spin-button
  appearance none
  margin 0


// Firefox
input[type="number"]
  appearance textfield


</style>

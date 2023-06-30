
<template>
  <div      
    ref="scrollable"
    :class="['app', { 'dragging': isDragging }]"
    @mousedown="handleOnMouseDown"
    @mousemove="mouseMoveHandler"
    @mouseup="mouseUpHandler"
    @mouseleave="mouseUpHandler">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import useContentful from '~/api/useContentful'
import usePieces from '~/J/usePieces'

const { fetchContentfulData } = useContentful()
const { mergeContentfulDataWithLocalData } = usePieces()

const scrollable = ref<HTMLElement | null>(null)

let isDragging = false
let lastX = 0
let lastY = 0

const handleOnMouseDown = (event: MouseEvent) => {
  if (event.target === scrollable.value) {
    isDragging = true
    lastX = event.clientX
    lastY = event.clientY
    if (scrollable.value) {
      scrollable.value.classList.add('dragging')
    }
  }
}

const mouseMoveHandler = (event: MouseEvent) => {
  if (isDragging && scrollable.value) {
    const deltaX = lastX - event.clientX
    const deltaY = lastY - event.clientY
    lastX = event.clientX
    lastY = event.clientY
    scrollable.value.scrollLeft += deltaX
    scrollable.value.scrollTop += deltaY
  }
}

const mouseUpHandler = () => {
  isDragging = false
  if (scrollable.value) {
    scrollable.value.classList.remove('dragging')
  }
}

onMounted(async () => {
  await fetchContentfulData()
  mergeContentfulDataWithLocalData()
})

</script>

<style lang="stylus">
// stylelint-disable-next-line selector-anb-no-unmatchable
:root
  --image-filter-invert 1


html
  scroll-behavior smooth
  transition all 0.6s
  overflow-y scroll
  overflow-x hidden

@font-face
  font-family AlumniSans
  font-weight 300
  unicode-range U+000-5FF
  src url("~/assets/fonts/Alumni_Sans_Collegiate_One/AlumniSansCollegiateOne-Regular.ttf")

@font-face
  font-family GowunDodum
  font-weight normal
  unicode-range U+000-5FF
  src url("~/assets/fonts/Gowun_Dodum/GowunDodum-Regular.ttf")

@font-face
  font-family Kurland
  font-weight normal
  unicode-range U+000-5FF
  src url("~/assets/fonts/Kurland/Kurland.ttf")

@font-face
  font-family Neonderthaw
  // font-weight normal
  font-weight 300
  unicode-range U+000-5FF
  src url("~/assets/fonts/Neonderthaw/Neonderthaw-Regular.ttf")

body
  font-family GowunDodum, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  // letter-spacing 2px
  color #0e0e0e
  margin 0
  overflow-x hidden
  background-color #dbdae1
  user-select none


// ///////////////////////////////////////////
// ///////////// Scrollbar ///////////////////
body
.app
  --scrollbar-foreground rgb(248 248 255)
  --scrollbar-background #000
  // Foreground, Background
  scrollbar-color var(--scrollbar-foreground) var(--scrollbar-background)

.app::-webkit-scrollbar
  width 0
  height 0

body::-webkit-scrollbar
  width 0
  height 0

body::-webkit-scrollbar-thumb // Foreground
.app::-webkit-scrollbar-thumb
  background var(--scrollbar-foreground)

body::-webkit-scrollbar-track // Background
.app::-webkit-scrollbar-track
  background var(--scrollbar-background)

.dark-mode body
  background-color #f1f1f1

.dark-mode:not(.w3m-active)
  filter invert(0.97)


.dark-mode img
  filter invert(var(--image-filter-invert))

  // &:hover
  //   filter invert(0)

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

// .dark-mode .w3m-active
//   filter invert(1)
.app
  position relative
  overflow auto
  height 100vh

.dragging
  cursor grabbing

</style>

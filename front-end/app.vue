<template>
  <div
    ref="scrollable"
    :class="['app', { dragging: isDragging }]"
    @mousedown="handleOnMouseDown"
    @mousemove="mouseMoveHandler"
    @mouseup="mouseUpHandler"
    @mouseleave="mouseUpHandler"
  >
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import useContentful from '~/api/useContentful'
import usePieces from '~/J/usePieces'

const { fetchContentfulData } = useContentful()
const { mergeContentfulDataWithLocalData, pieces } = usePieces()

const scrollable = ref<HTMLElement | null>(null)
// const scrollableRef = ref<HTMLElement | null>(null)
// const cursorPosition = ref({ x: 0, y: 0 })

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

  // window.addEventListener('mousemove', updateCursorPosition)
})

// onMounted(async () => {
//   await fetchContentfulData()
//   // mergeContentfulPiecesWithLocalData()
// })

// // admin
// const updateCursorPosition = (event: MouseEvent) => {
//   if (!scrollableRef.value) return
//   cursorPosition.value = {
//     x: event.clientX + scrollableRef.value.scrollLeft,
//     y: event.clientY + scrollableRef.value.scrollTop
//   }
// }

// onUnmounted(() => {
//   window.removeEventListener('mousemove', updateCursorPosition)
// })

// const drop = (event: DragEvent) => {
//   console.log('event: ', event)
//   if (!useAdminPage().isOnAdminPage.value) return

//   const files = event?.dataTransfer?.files
//   console.log('files: ', files)
//   if (!files) return
//   const imageFile = Array.from(files)[0]
//   if (files.length !== 1 && !imageFile) return

//   const id = uuidv4()
//   const newPiece = reactive(
//     new Piece({
//       id,
//       name: 'TBD',
//       topic: 'anything',
//       image: {
//         id,
//         url: URL.createObjectURL(imageFile as File),
//         lastUpdated: new Date().getTime()
//       },
//       technique: '',
//       techniqueDescription: '',
//       created: new Date(),
//       sizeInCm: {
//         x: 30,
//         y: 0
//       },
//       imageRaw: imageFile,
//       sizeOnWeb: {
//         width: 350,
//         widthMob: 250
//         // height?: number
//       },
//       position: {
//         x: Math.floor(cursorPosition.value.x),
//         y: Math.floor(cursorPosition.value.y),
//         deg: 0,
//         yMob: Math.floor(cursorPosition.value.y),
//         xMob: Math.floor(cursorPosition.value.x),
//         degMob: 0
//       }
//     })
//   )

//   pieces.value?.push(newPiece)
//   useContentfulPiece().uploadPiece(newPiece)
// }
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
  background-color #f1f1f1
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

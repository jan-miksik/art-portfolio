<template>
      <div
        class="piece"
        ref="pieceRef"
        :style="handlePieceStyle(piece)"
        @mousedown="handleOnMouseDown"
        @mousemove="mouseMoveHandler"
        @mouseup="mouseUpHandler"
      >
      <!-- :height="piece.sizeOnWeb.height" -->
        <OImage
          v-if="piece"
          :id="piece.id"
          :image-file="piece.image"
          :class="[
            'piece__image',
            {
              'piece__image--not-published': !piece.isPublished && isOnAdminPage
            }
          ]"
          :width="piece.sizeOnWeb.width"
          @click="selectImage(piece)"
        />

        <!-- <div
          v-if="piece"
          class='piece__piece-description-unselected'
        >
          <strong>{{ piece.name }} </strong>, <br/> {{ piece.created.getFullYear() }},
          {{ piece.techniqueDescription }}, {{ piece.sizeInCm.x }}cm x
          {{ piece.sizeInCm.y }}cm
        </div> -->
      </div>
      <Transition name="images">
        <div
          v-if="selectedPiece"
          :class="[{ 'piece__selected-piece-backdrop': selectedPiece }]"
          @click="handleOnBackdropClick"
          @touchstart="handleOnBackdropClick"
        >
          <OImage
            :image-file="selectedPiece.image"
            class="piece__selected-piece-image"
            @click.stop
            @touchstart.stop
          />
          <button
            v-if="isOnAdminPage"
            class="piece__remove-button"
            @click="handlePublishChanges"
            @click.stop="handleRemovePiece"
            @touchstart.stop="handleRemovePiece"
          >
            Smazat
          </button>
          <div class="piece__selected-piece-info" @click.stop
            @touchstart.stop>
            <strong>{{ selectedPiece.name }} </strong> <br />
            {{ selectedPiece.created.getFullYear() }},
            {{ selectedPiece.techniqueDescription }},
            {{ selectedPiece.sizeInCm.x }}cm x {{ selectedPiece.sizeInCm.y }}cm
          </div>
        </div>
      </Transition>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector' 
import usePieces from '~/J/usePieces'
import useAdminPage from '~/J/useAdminPage'
import useContentfulPiece from '~/J/useContentfulPiece'

const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()
const { zIndexOfLastSelectedPiece, pieces } = usePieces()
const { isOnAdminPage, isSetupForMobile } = useAdminPage()

const localZIndex = ref(1)
const pieceRef = ref()
const selectedPiece = ref<Piece>()

const props = defineProps<{
  piece: Piece
}>()

const { piece } = toRefs(props)

onMounted(() => {
  interact(pieceRef.value)
    .draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          piece.value.isPublished = false
          console.log('piece.value: ', piece.value);
          if (isSetupForMobile.value) {
            const xRaw = (piece.value.position.xMob || piece.value.position.x) + event.dx
            const yRaw = (piece.value.position.yMob || piece.value.position.y) + event.dy
            const x = xRaw > 0 ? xRaw : 0
            const y = yRaw > 0 ? yRaw : 0
            piece.value.position.xMob = x
            piece.value.position.yMob = y
          } else {
            const xRaw = (piece.value.position.x || piece.value.position.xMob) + event.dx
            const yRaw = (piece.value.position.y || piece.value.position.yMob) + event.dy
            const x = xRaw > 0 ? xRaw : 0
            const y = yRaw > 0 ? yRaw : 0
            piece.value.position.x = x
            piece.value.position.y = y
          }
        }
      }
    })
    .resizable({
      // resize from edges and corners
      edges: { left: false, right: true, bottom: false, top: false },

      listeners: {
        move(event) {
          const target = event.target
          let x = parseFloat(target.getAttribute('data-x')) || 0
          let y = parseFloat(target.getAttribute('data-y')) || 0

          // update the element's style
          if (piece.value.sizeOnWeb.width === event.rect.width) return

          if (isSetupForMobile.value) {
            piece.value.sizeOnWeb.widthMob = event.rect.width
          } else {
            piece.value.sizeOnWeb.width = event.rect.width
          }

          piece.value.isPublished = false
        }
      },
      modifiers: [
        // keep the edges inside the parent
        // interact.modifiers.restrictEdges({
        //   outer: 'parent'
        // }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 10, height: 10 }
        })
      ],
      inertia: true
    })
  })



// const getRandomNumberInRange = (min: number, max: number) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }


// const defaultRandomization = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 300)
//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//   }
//   if (!piece.sizeOnWeb?.height) {
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//   }
//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 1920)
//   }
//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2200)
//   }
// }


// const randomizationPuzzle = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 350)
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//     piece.position.x = getRandomNumberInRange(0, window.innerWidth + 200)
//     piece.position.y = getRandomNumberInRange(100, 1200)
// }


// const randomizationNodeAvatars = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 70 : 100)

//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(35, maxRandomImageWidth)
//   }

//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 2000)
//   }

//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2700)
//   }
// }


const handleOnMouseDown = () => {
  mouseDownHandler()
  localZIndex.value = zIndexOfLastSelectedPiece.value
  zIndexOfLastSelectedPiece.value++
}

const handleRemovePiece = async () => {
  if (confirm('Smazat?')) {
    await useContentfulPiece().removePiece(piece.value)
    pieces.value = pieces.value?.filter((p) => p.id !== piece.value.id)
    alert('Smazáno')
  }
}


// const handlePieceStyle = (piece: Piece) => {
//   if (!piece) return

  

//   return {
//     width: `${piece.sizeOnWeb?.width}px`,
//     maxHeight: `${piece.sizeOnWeb?.height}px`,
//     left: `${piece.position?.x}px`,
//     top: `${piece.position?.y}px`,
//     deg: `${piece.position?.deg}deg`,
//     zIndex: `${localZIndex.value}`
//   }
// }

const handlePieceStyle = (piece: Piece) => {
  if (!piece) return

  // TODO add randomization during move for selected piece

  if (isSetupForMobile.value) {
    return {
      width: `${piece.sizeOnWeb?.widthMob || piece.sizeOnWeb?.width}px`,
      // maxHeight: `${piece.sizeOnWeb?.height}px`,
      left: `${piece.position?.xMob || piece.position?.x}px`,
      top: `${piece.position?.yMob || piece.position?.y}px`,
      deg: `${piece.position?.deg}deg`,
      zIndex: `${localZIndex.value}`
    }
  }

  return {
    width: `${piece.sizeOnWeb?.width || piece.sizeOnWeb?.widthMob}px`,
    // maxHeight: `${piece.sizeOnWeb?.height}px`,
    left: `${piece.position?.x || piece.position?.xMob}px`,
    top: `${piece.position?.y || piece.position?.yMob}px`,
    deg: `${piece.position?.degMob}deg`,
    zIndex: `${localZIndex.value}`
  }
}



const handleOnBackdropClick = () => {
  selectedPiece.value = undefined
}


// onMounted(() => {
  // switch (props.piece.topic) {
  //   case Topics.PUZZLE:
  //     randomizationPuzzle(props.piece)
  //     break
  //   case Topics.NODE_AVATARS:
  //     randomizationNodeAvatars(props.piece)
  //     break
  //   default:
  //     defaultRandomization(props.piece)
  // }
// })

const selectImage = (piece: Piece) => {
  if (!isDragging.value) {
    selectedPiece.value = piece
  }
}
</script>

<style lang="stylus" scoped>

.piece
  // transition all 0.25s
  position absolute
  touch-action none
  user-select none

.piece__image
  position relative
  width 100%
  max-height 85vh
  max-width 100%
  object-fit contain
  min-width 10px
  min-height 10px
  // transition all 0.3s

  &--not-published
    border 2px #12b321 solid

.piece__image:hover
  cursor cell
  z-index 10
  // filter drop-shadow(0 0 1px black)

.dark-mode .piece__image:hover
  // filter drop-shadow(0 0 1px black) invert(1)

.piece__selected-piece-image
  max-height 87vh
  max-width 95%
  margin-top 3rem
  cursor default
  z-index 10000

.piece__selected-piece-info
  background-color #eee
  color #919191
  border-radius 15px 15px 20px 20px
  z-index 1000
  max-width 90%
  width max-content
  padding 0.7rem 1rem
  box-shadow 0 0 5px 0 #0000002e
  text-align center
  font-size 1rem
  align-self center
  position absolute
  top 0.3rem
  cursor auto
  user-select text


.dark-mode .piece__selected-piece-info
  background-color rgb(17 17 17)


.piece__selected-piece-backdrop
  position fixed
  display flex
  align-items center
  justify-content center
  flex-direction column
  gap 1rem
  inset 0
  height 100vh
  z-index 1000
  background-color #00000050
  backdrop-filter sepia(1) blur(2px)
  cursor url("/close.svg"), auto

.dark-mode .piece__selected-piece-backdrop
  background-color unset

.piece__publish-button
  position absolute
  bottom 0%
  left 50%
  transform translate(-50%, -50%)
  background #f1f9ffd6
  padding 0.5rem
  border-radius 5px
  z-index 10
  cursor pointer
  border 1px solid black
  visibility hidden

.piece__remove-button
  position absolute
  top 0
  right 0
  z-index 1000
  margin 0.3rem
  padding 0.3rem
  cursor pointer
  transition all 0.2s
  background white
  border 1px solid crimson
  color crimson
  border-radius 5px


// / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0

</style>

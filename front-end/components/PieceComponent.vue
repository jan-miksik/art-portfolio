<template>
      <div
        class="piece"
        ref="pieceRef"
        :style="handlePieceStyle(piece)"
        @mousedown="handleOnMouseDown"
        @mousemove="mouseMoveHandler"
        @mouseup="mouseUpHandler"
      >
        <OImage
          v-if="piece"
          :id="piece.id"
          :image-file="piece.image"
          class="piece__image"
          :width="piece.sizeOnWeb.width"
          :height="piece.sizeOnWeb.height"
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
          />
          <div class="piece__selected-piece-info">
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
import { Topics } from '~/components/piecesData'
import usePieces from '~/J/usePieces'

const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()
const { zIndexOfLastSelectedPiece } = usePieces()
const localZIndex = ref(1)
const pieceRef = ref()
const selectedPiece = ref<Piece>()

const props = defineProps<{
  piece: Piece
}>()


onMounted(() => {
  interact(pieceRef.value).draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          props.piece.position.x += event.dx
          props.piece.position.y += event.dy
        }
      }
    })
})


const getRandomNumberInRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


const defaultRandomization = (piece: Piece) => {
  const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 300)
  if (!piece.sizeOnWeb?.width) {
    piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
  }
  if (!piece.position?.x) {
    piece.position.x = getRandomNumberInRange(0, 1920)
  }
  if (!piece.position?.y) {
    piece.position.y = getRandomNumberInRange(100, 2200)
  }
}


const randomizationNodeAvatars = (piece: Piece) => {
  // const maxRandomPositionX = window.innerWidth - (piece.sizeOnWeb?.width || 250)
  // const maxRandomPositionY = window.innerHeight
  const maxRandomImageWidth = (window.innerWidth < 800 ? 150 : 200)

  if (!piece.sizeOnWeb?.width) {
    piece.sizeOnWeb.width = getRandomNumberInRange(60, maxRandomImageWidth)
  }

  if (!piece.position?.x) {
    piece.position.x = getRandomNumberInRange(0, 3000)
  }

  if (!piece.position?.y) {
    piece.position.y = getRandomNumberInRange(100, 3200)
  }
}


const handleOnMouseDown = () => {
  mouseDownHandler()
  localZIndex.value = zIndexOfLastSelectedPiece.value
  zIndexOfLastSelectedPiece.value++
}


const handlePieceStyle = (piece: Piece) => {
  if (!piece) return
  if (piece.topic === Topics.NODE_AVATARS) {
    randomizationNodeAvatars(piece)
  } else {
    defaultRandomization(piece)
  }
  return {
    width: `${piece.sizeOnWeb?.width}px`,
    height: `${piece.sizeOnWeb?.height}px`,
    left: `${piece.position?.x}px`,
    top: `${piece.position?.y}px`,
    deg: `${piece.position?.deg}deg`,
    zIndex: `${localZIndex.value}`
  }
}


const handleOnBackdropClick = () => {
  selectedPiece.value = undefined
}


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
  touch-action: none;
  user-select: none;

.piece__image
  position relative
  width 100%
  max-height 85vh
  max-width 100%
  object-fit contain
  // transition all 0.3s

.piece__image:hover
  cursor cell
  z-index 10
  filter: drop-shadow(0px 0px 1px black);

.dark-mode .piece__image:hover
  filter: drop-shadow(0px 0px 1px black) invert(1);

.piece__selected-piece-image
  max-height: 87vh;
  max-width: 95%;
  margin-top: 3rem;

.piece__selected-piece-info
  background-color #eee
  color #919191
  text-align left
  border-radius: 15px 15px 20px 20px;
  z-index 10
  max-width 90%
  width max-content
  position relative
  padding: 0.7rem 1rem
  box-shadow 0 0 5px 0 #0000002e
  text-align center
  font-size 1rem
  align-self: center;
  position: absolute;
  top: 0.3rem;


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
  backdrop-filter: sepia(1) blur(2px);

.dark-mode .piece__selected-piece-backdrop
  background-color unset


// / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0

</style>

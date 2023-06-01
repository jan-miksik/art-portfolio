<template>
  <Transition name="images">
    <div
      v-if="props.pieces && props.type === props.selectedTopic"
      :class="[
        'pieces__images', `pieces__images--${props.selectedTopic}`,
        { 'pieces__selected-image': activeImage },
        props.pieces && props.type === props.selectedTopic
          ? 'pieces__is-section-visible'
          : 'pieces__is-section-hidden'
      ]"
    >
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
          @click="selectImage(piece)"
        />

        <div
          v-if="piece"
          :class="[
            piece.id === activeImage
              ? handleImageClass(piece)
              : 'pieces__piece-description-unselected'
          ]"
        >
          <strong>{{ piece.name }} </strong>, {{ piece.created.getFullYear() }},
          {{ piece.techniqueDescription }}, {{ piece.sizeInCm.x }}cm x
          {{ piece.sizeInCm.y }}cm
        </div>
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
      </div>
      <div
        :class="[{ 'pieces__is-active-image-backdrop': activeImage }]"
        @click="handleOnBackdropClick"
        @touchstart="handleOnBackdropClick"
      />
      <BallThreeJs v-if="Topics.GEOMETRY === props.type" />
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
  pieces?: Piece[]
  type: Topics
  selectedTopic?: Topics
}>()

const getScale = (coordinates: any) => {
  const widthRatio = window.innerWidth / coordinates.width
  const heightRatio = window.innerHeight / (coordinates.height + 50)
  const scale = widthRatio > heightRatio ? heightRatio : widthRatio

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
  if (!piece.sizeOnWeb?.height) {
    piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
  }
  if (!piece.position?.x) {
    piece.position.x = getRandomNumberInRange(0, 1920)
  }
  if (!piece.position?.y) {
    piece.position.y = getRandomNumberInRange(100, 2200)
  }
}


const randomizationPuzzle = (piece: Piece) => {
  const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 350)
    piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
    piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
    piece.position.x = getRandomNumberInRange(0, window.innerWidth + 200)
    piece.position.y = getRandomNumberInRange(100, 1200)
}


const randomizationNodeAvatars = (piece: Piece) => {
  const maxRandomImageWidth = (window.innerWidth < 800 ? 70 : 100)

  if (!piece.sizeOnWeb?.width) {
    piece.sizeOnWeb.width = getRandomNumberInRange(35, maxRandomImageWidth)
  }

  if (!piece.position?.x) {
    piece.position.x = getRandomNumberInRange(0, 2000)
  }

  if (!piece.position?.y) {
    piece.position.y = getRandomNumberInRange(100, 2700)
  }
}


const handleOnMouseDown = () => {
  mouseDownHandler()
  localZIndex.value = zIndexOfLastSelectedPiece.value
  zIndexOfLastSelectedPiece.value++
}


const handlePieceStyle = (piece: Piece) => {
  if (!piece) return

  // TODO add randomization during move

  return {
    width: `${piece.sizeOnWeb?.width}px`,
    maxHeight: `${piece.sizeOnWeb?.height}px`,
    left: `${piece.position?.x}px`,
    top: `${piece.position?.y}px`,
    deg: `${piece.position?.deg}deg`,
    zIndex: `${localZIndex.value}`
  }
}


const handleOnBackdropClick = () => {
  activeImage.value = undefined
}


onMounted(() => {
  switch (props.piece.topic) {
    case Topics.PUZZLE:
      randomizationPuzzle(props.piece)
      break
    case Topics.NODE_AVATARS:
      randomizationNodeAvatars(props.piece)
      break
    default:
      defaultRandomization(props.piece)
  }
})

const selectImage = (piece: Piece) => {
  if (!isDragging.value) {
    selectedPiece.value = piece
  }
}
</script>

<style lang="stylus" scoped>
.pieces__images
  position absolute
  padding 10rem 1.5rem 30rem
  left 0
  right 0
  margin auto
  z-index -1
  display flex
  gap 5rem
  align-items center
  justify-content center
  flex-wrap wrap
  overflow-x hidden


.pieces__images--geometry
  padding 10rem 1.5rem 45rem


@media (min-width 1000px)
  .pieces__images
    gap 1rem


.pieces__selected-image
  z-index 5


.pieces__image
  transition all 0.3s
  max-width clamp(230px, 87vw, 750px)
  width 100%
  position relative
  object-fit contain
  max-height 85vh


.pieces__piece
.pieces__piece-node-avatar
  transition all 0.25s
  position relative
  width 100%


.pieces__image:hover
  cursor cell
  transform translateY(0) translateX(0) rotate(0) scale(1.1) !important
  z-index 100


.pieces__piece-description-unselected
  display none

.dark-mode .piece__image:hover
  filter: drop-shadow(0px 0px 1px black) invert(1);

.piece__selected-piece-image
  max-height: 87vh;
  max-width: 95%;
  margin-top: 3rem;

.pieces__piece-description-selected
.pieces__piece-description-selected-higher-img
.pieces__piece-description-unselected
  transition all 0.2s
  background-color #eee
  padding 1rem 0.7rem
  font-size 0.7rem
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


.dark-mode .pieces__piece-description-selected
.dark-mode .pieces__piece-description-selected-higher-img
.dark-mode .pieces__piece-description-unselected
  background-color rgb(17 17 17)


.pieces__image:hover + .pieces__piece-description-unselected
  display block


@media (min-width 1000px)
  .pieces__piece
    max-width 500px


  .pieces__piece-node-avatar
    max-width 200px
    margin 1rem


.pieces__image-node-avatar
  max-width clamp(190px, 75vw, 190px)
  width 100%


@media (min-width 1000px)
  .pieces__piece-description-selected
    bottom -45vh
    z-index 100


  .pieces__piece-description-selected-higher-img
    bottom -20vh
    z-index 100


.pieces__piece-description:hover
  visibility visible


.pieces__is-active-image
  transition all 0.35s
  z-index 10
  transform translateY(0) translateX(0) rotate(0) scale(1.1) !important


.pieces__is-active-image-replacement
  width 500px


.pieces__is-active-image-backdrop
  position fixed
  left 0
  top 0
  bottom 0
  right 0
  height 140vh
  z-index 1
  background-color #00000050
  backdrop-filter: sepia(1) blur(2px);

.dark-mode .pieces__is-active-image-backdrop
  background-color unset


// / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0

</style>

<template>
      <div
        class="piece"
        ref="pieceRef"
        :style="handlePieceStyle(piece)"
      >
        <Image
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
          <Image
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

// import { Topics } from '~/components/pieceData'
const pieceRef = ref()
const selectedPiece = ref<Piece>()
// const mapOfImages = ref()
const props = defineProps<{
  piece: Piece
}>()


onMounted(() => {
  interact(pieceRef.value).draggable({
      // inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          props.piece.position.x += event.dx
          props.piece.position.y += event.dy
        }
      }
    })
})


const handlePieceStyle = (piece: Piece) => {

  return {
    width: `${piece.sizeOnWeb?.width}px`,
    height: `${piece.sizeOnWeb?.height}px`,
    left: `${piece.position?.x}px`,
    top: `${piece.position?.y}px`,
    deg: `${piece.position?.deg}deg`
  }
}

const handleOnBackdropClick = () => {
  selectedPiece.value = undefined
}

const selectImage = (piece: Piece) => {
  // selectedPiece.value = piece
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

.piece__selected-piece-image
  max-height 85vh
  max-width: 95%;

.piece__selected-piece-info
  background-color #eee
  color #919191
  text-align left
  border-radius: 50px 0 0 0;
  z-index 10
  // transition all 0.2s
  max-width 90%
  width max-content
  position relative
  bottom 0px
  padding 1rem 0.7rem
  margin-top: 1rem
  box-shadow 0 0 5px 0 #0000002e
  text-align center
  font-size 1rem

.piece__selected-piece-info
  align-self: flex-end;
  position: absolute;
  bottom: 0;

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
  // backdrop-filter blur(1px) grayscale(1)
  backdrop-filter: sepia(1) blur(2px);
  // transition all 0.5s

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

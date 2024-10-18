<template>
  <!-- TODO resolve style typings -->
  <div
    class="piece"
    ref="pieceRef"
    :style="(handlePieceStyle(piece) as any)"
    @mousedown="handleOnMouseDown"
    @mousemove="(event) => mouseMoveHandler(event, piece)"
    @mouseleave="mouseLeaveHandler"
    @mouseup="mouseUpHandler"
    @touchmove="(event) => touchmoveHandler(event, piece)"
    @touchend="touchendHandler"
  >
    <OImage
      v-if="piece"
      :id="piece.id"
      :image-file="piece.image"
      :piece="piece"
      :class="[
        'piece__image',
        {
          'piece__image--not-published': !piece.isPublished && isOnAdminPage
        }
      ]"
      :width="piece.sizeOnWeb.width"
      @click="selectImage(piece)"
    />
    <!-- x:{{ piece?.position.x }} y: {{ piece?.position.y }} -->
  </div>
  <PieceComponentAdmin
    v-if="isOnAdminPage"
    :initialPiece="selectedPiece"
    @close-modal="handleClosePieceDetail"
  />
  <PieceComponentPublicView
    v-else
    :initialPiece="selectedPiece"
    @close-modal="handleClosePieceDetail"
  />
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import usePieces from '~/J/usePieces'
import useAdminPage from '~/J/useAdminPage'
import useMapper from '~/J/useMapper'
import '@vuepic/vue-datepicker/dist/main.css'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'
import { TechniqueDescription, Topics } from "../components/piecesData"

const {
  mouseDownHandler,
  mouseMoveHandler,
  mouseUpHandler,
  mouseLeaveHandler,
  isDragging,
  touchmoveHandler,
  touchendHandler
} = useMouseActionDetector()
const { zIndexOfLastSelectedPiece, pieces, edgePositions } = usePieces()
const { isOnAdminPage } = useAdminPage()
const { mapperEventData } = useMapper()

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
          if (!isOnAdminPage.value && !piece.value.isMoveableInPublic) return
          const scale = mapperEventData.value.scale
          piece.value.isPublished = false
          const xRaw = piece.value.position.x + event.dx / scale
          const yRaw = piece.value.position.y + event.dy / scale
          const x = xRaw > -2000 ? xRaw : -2000
          const y = yRaw > -2000 ? yRaw : -2000
          piece.value.position.x = x
          piece.value.position.y = y
          edgePositions.value.x = Math.max(
            edgePositions.value.x,
            x + (piece.value?.sizeOnWeb?.width || 0) + 2000
          )
          edgePositions.value.y = Math.max(edgePositions.value.y, y + 2000)
          // }
        }
      }
    })
    .resizable({
      // resize from edges and corners
      edges: { left: false, right: true, bottom: false, top: false },

      listeners: {
        move(event) {
          // should use proportional size from cm of piece
          return
          const scale = mapperEventData.value.scale
          const target = event.target
          let x = parseFloat(target.getAttribute('data-x')) || 0
          let y = parseFloat(target.getAttribute('data-y')) || 0

          // update the element's style
          if (piece.value.sizeOnWeb.width === event.rect.width) return

          // if (isSetupForMobile.value) {
          //   piece.value.sizeOnWeb.widthMob = (event.rect.width / scale)
          // } else {
          piece.value.sizeOnWeb.width = event.rect.width / scale
          // }

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

const handleClosePieceDetail = () => {
  selectedPiece.value = undefined
}

const handleOnMouseDown = () => {
  mouseDownHandler()
  localZIndex.value = zIndexOfLastSelectedPiece.value
  zIndexOfLastSelectedPiece.value++
}

const handlePieceStyle = (piece: Piece) => {
  if (!piece) return { width: '50px' }

  // TODO nice to have: add randomization during move for selected piece

  // const sizeX = () => {
  //   if (piece.sizeInCm?.x) {
  //     return `${piece.sizeInCm?.x * 5}px`
  //   }
  //   if (piece.sizeInPx?.x) {
  //     return `${piece.sizeInPx?.x / 5}px`
  //   }
  //   return 'unset'
  // }



  const sizeX = () => {
    // const sizeXToCheck = piece.sizeInCm?.x * 5
    if (piece.sizeInCm?.x) {
      return `${piece.sizeInCm?.x * 5}px`
    }
    if (piece.sizeInPx?.x) {
      if (piece.topic === Topics.NODE_AVATARS && piece.techniqueDescription === TechniqueDescription.DIGITAL_BITMAP) {
        return `${piece.sizeInPx?.x / 15}px`
      }
      return `${piece.sizeInPx?.x / 9}px`
    }
    return 'unset'
  }

  const sizeY = () => {
    if (piece.sizeInCm?.y) {
      return `${piece.sizeInCm?.y * 5}px`
    }
    if (piece.sizeInPx?.y) {
      if (piece.topic === Topics.NODE_AVATARS && piece.techniqueDescription === TechniqueDescription.DIGITAL_BITMAP) {
        return `${piece.sizeInPx?.y / 15}px`
      }
      return `${piece.sizeInPx?.y / 9}px`
    }
    return 'unset'
  }

  // console.log('sizeY(): ', sizeY());
  return {
    width: sizeX(),
    maxHeight: sizeY(),
    height: sizeY(),
    left: `${piece.position?.x + LEFT_OFFSET}px`,
    top: `${piece.position?.y + TOP_OFFSET}px`,
    deg: `${piece.position?.deg}deg`,
    zIndex: `${localZIndex.value}`
  }
}

const selectImage = (piece: Piece) => {
  if (!isDragging.value) {
    selectedPiece.value = piece
  }
}
</script>

<style lang="stylus" scoped>

.piece
  position absolute
  touch-action none
  user-select none

.piece__image
  position relative
  object-fit contain
  width 100%
  max-width 100%
  min-width 20px
  min-height 20px
  height 100%

  &--not-published
    // border 1px #12b5225e solid

.piece__image:hover
  cursor cell
  z-index 10
</style>


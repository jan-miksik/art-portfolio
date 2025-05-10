<template>
  <!-- TODO resolve style typings -->
  <div
    class="piece"
    ref="pieceRef"
    v-if="showPiece"
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
    <div class="piece__rotate"/>
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
import useArchive from '~/J/useArchive'

const { isArchiveVisible } = useArchive()
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
  if (!pieceRef.value) return
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
        },
      },
    })
    .resizable({
      // resize from edges and corners
      edges: { left: false, right: true, bottom: false, top: false },

      /* rotation disabled for now */
      // listeners: {
      //   move(event) {
      //     if (!isOnAdminPage.value && !piece.value.isMoveableInPublic) return
      //     const scale = mapperEventData.value.scale
      //     piece.value.isPublished = false
      //     const xRaw = event.dx / scale
      //     const yRaw = event.dy / scale
      //     piece.value.position.deg += yRaw + xRaw
      //   }
      // },
      modifiers: [
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

const calculateSize = (dimension: 'x' | 'y') => {
  const size = piece.value

  // CM size takes precedence
  if (size.sizeInCm?.[dimension]) {
    return `${size.sizeInCm[dimension] * 5}px`
  }

  // Handle large images (over 2000px)
  if (size.sizeInPx?.[dimension] > 2000) {
    const sizeOver2000 = size.sizeInPx[dimension] - 2000
    const baseSize = 2000 / 12
    return `${baseSize + (sizeOver2000 / 70)}px`
  }

  // Handle pixel sizes
  if (size.sizeInPx?.[dimension]) {
    const divider = (
      size.topic === Topics.NODE_AVATARS && 
      size.techniqueDescription === TechniqueDescription.DIGITAL_BITMAP
    ) ? 15 : 9
    return `${size.sizeInPx[dimension] / divider}px`
  }

  return 'unset'
}

const sizeX = () => calculateSize('x')
const sizeY = () => calculateSize('y')

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


  return {
    width: sizeX(),
    maxHeight: sizeY(),
    height: sizeY(),
    left: `${piece.position?.x + LEFT_OFFSET}px`,
    top: `${piece.position?.y + TOP_OFFSET}px`,
    rotate: `${piece.position?.deg}deg`,
    zIndex: `${localZIndex.value}`
  }
}

const selectImage = (piece: Piece) => {
  if (!isDragging.value) {
    selectedPiece.value = piece
  }
}

const showPiece = computed(() => {
  if (piece.value.isArchived) {
    return isArchiveVisible.value
  }
  return true
})

</script>

<style lang="stylus" scoped>

.piece {
  position absolute
  touch-action none
  user-select none

  &__image {
    position relative
    object-fit contain
    width 100%
    max-width 100%
    min-width 20px
    min-height 20px
    height 100%

    &--not-published {
      // border 1px #12b5225e solid
    }
  }

  &__image:hover {
    cursor cell
    z-index 10
  }

  /* Add this for the rotation cursor */
  &__rotate {
    position absolute
    top 0
    right 0
    cursor pointer
    z-index 20
    width 10px
    height 10px
    background-color transparent
    cursor grab
  }

  &__rotate:hover {
    cursor grabbing
  }
}
</style>


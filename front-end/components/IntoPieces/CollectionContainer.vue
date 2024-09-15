<template>
  <!-- @mousemove="mouseMoveHandlerPublicPage"
  @mouseleave="mouseLeaveHandlerPublicPage"
  @touchmove="touchmoveHandlerPublicPage"
  @touchend="touchendHandlerPublicPage" -->
  <div
    class="collection-container"
    :style="IntoPiecesCollectionStyle"
    ref="IntoPiecesCollectionRef"
    >
      <IntoPiecesCollection />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useAdminPage from '~/J/useAdminPage'
import useMapper from '~/J/useMapper'
// import useMouseActionDetector from '~/J/useMouseActionDetector'
import usePieces from '~/J/usePieces'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

// const {
//   mouseMoveHandlerPublicPage,
//     mouseLeaveHandlerPublicPage,
//     touchmoveHandlerPublicPage,
//     touchendHandlerPublicPage,
// } = useMouseActionDetector()

const IntoPiecesCollectionRef = ref<HTMLCanvasElement>()
const IntoPiecesCollectionPosition = ref({
  x: 10000,
  y: 6500
})

const IntoPiecesCollectionStyle = computed(() => {
  return {
    left: `${IntoPiecesCollectionPosition.value.x + LEFT_OFFSET}px`,
    top: `${IntoPiecesCollectionPosition.value.y + TOP_OFFSET}px`,
  }
})

onMounted(() => {
  const { isOnAdminPage } = useAdminPage()
  const { mapperEventData } = useMapper()
  const { edgePositions } = usePieces()

  if (!IntoPiecesCollectionRef.value) return
  interact(IntoPiecesCollectionRef.value).draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        if (!isOnAdminPage.value) return
        const scale = mapperEventData.value.scale

        const xRaw = IntoPiecesCollectionPosition.value.x + event.dx / scale
        const yRaw = IntoPiecesCollectionPosition.value.y + event.dy / scale
        const x = xRaw > -2000 ? xRaw : -2000
        const y = yRaw > -2000 ? yRaw : -2000
        IntoPiecesCollectionPosition.value.x = x
        IntoPiecesCollectionPosition.value.y = y
        edgePositions.value.x = Math.max(edgePositions.value.x, x + 2300)
        edgePositions.value.y = Math.max(edgePositions.value.y, y + 2000)
        // }
      }
    }
  })
})
// import Piece from '~/models/Piece'
// import { Topics } from '~/components/piecesData'

// const activeImage = ref()
// const props = defineProps<{
//   pieces?: Piece[]
//   type: Topics
//   selectedTopic?: Topics
// }>()

// const getScale = (coordinates: any) => {
//   const widthRatio = window.innerWidth / coordinates.width
//   const heightRatio = window.innerHeight / (coordinates.height + 50)
//   const scale = widthRatio > heightRatio ? heightRatio : widthRatio

//   if (scale > 2.2) return 2.2
//   return scale
// }

// const handleImagePosition = (piece: Piece) => {
//   if (piece.id !== activeImage.value || window.innerWidth <= 1000) {
//     return piece.randomizedPosition
//   }
//   const selectedImage = document.getElementById(piece.id)
//   const coordinates = selectedImage?.getBoundingClientRect()
//   if (!coordinates || !selectedImage) return
//   const translateY = coordinates.height < 320 ? 110 : 100

//   return {
//     transform: `rotate(0deg) scale(${getScale(
//       coordinates
//     )}) translateY(${translateY}px) translateX(${
//       (window.innerWidth / 2 - (coordinates.width / 2 + coordinates.left)) / 2
//     }px) !important`
//   }
// }

// const handleImageClass = (piece: Piece) => {
//   const selectedImage = document.getElementById(piece.id)
//   const coordinates = selectedImage?.getBoundingClientRect()
//   if (!coordinates || !selectedImage) return
//   const heightRatio = coordinates.height / coordinates.width

//   const isHigherThanWider = heightRatio > 1

//   return isHigherThanWider && coordinates.height > 350
//     ? 'nft-collection-pieces__piece-description-selected-higher-img'
//     : 'nft-collection-pieces__piece-description-selected'
// }

// const selectImage = (id: string) => {
//   if (activeImage.value === id) {
//     activeImage.value = undefined
//     return
//   }
//   const selectedImage = document.getElementById(id)
//   const coordinates = selectedImage?.getBoundingClientRect()
//   if (!coordinates || !selectedImage) return

//   const heightRatio = coordinates.height / coordinates.width

//   const isHigherThanWider = heightRatio > 1.15

//   if (window.innerHeight > window.innerWidth) {
//     const targetPosition = window.scrollY + (coordinates?.y || 0) - 185
//     window.scrollTo(0, targetPosition)
//   } else {
//     const targetPosition =
//       window.scrollY + (coordinates?.y || 0) + (isHigherThanWider ? 85 : 0)

//     window.scrollTo(0, targetPosition)
//   }
//   activeImage.value = id
// }
</script>

<style lang="stylus" scoped>
/* .nft-collection-pieces__images {
  position: absolute;
  padding: 5rem 1.5rem;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  gap: 5rem;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

@media (min-width: 1000px) {
  .nft-collection-pieces__images {
    gap: 1rem;
  }
}

.nft-collection-pieces__selected-image {
  z-index: 5;
}

.nft-collection-pieces__image {
  transition: all 0.3s;
  max-width: clamp(230px, 87vw, 750px);
  width: 100%;
  position: relative;
  object-fit: contain;
  max-height: 85vh;
}

.nft-collection-pieces__piece,
.nft-collection-pieces__piece-node-avatar {
  transition: all 0.25s;
  position: relative;
  width: 100%;
}

.nft-collection-pieces__image:hover {
  cursor: cell;
  transform: translateY(0) translateX(0) rotate(0) scale(1.1) !important;
  z-index: 100;
}

.nft-collection-pieces__piece-description-unselected {
  display: none;
}

.nft-collection-pieces__piece-description-selected,
.nft-collection-pieces__piece-description-selected-higher-img,
.nft-collection-pieces__piece-description-unselected {
  transition: all 0.2s;
  background-color: #eee;
  padding: 1rem 0.7rem;
  font-size: 0.7rem;
  text-align: left;
  color: #919191;
  border-radius: 2px;
  z-index: 10;
  width: max-content;
  max-width: 500px;
  position: absolute;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 5px 0 rgb(0 0 0 / 12%);
}

.dark-mode .nft-collection-pieces__piece-description-selected,
.dark-mode .nft-collection-pieces__piece-description-selected-higher-img,
.dark-mode .nft-collection-pieces__piece-description-unselected {
  background-color: rgb(17 17 17);
}

.nft-collection-pieces__image:hover + .nft-collection-pieces__piece-description-unselected {
  display: block;
}

@media (min-width: 1000px) {
  .nft-collection-pieces__piece {
    max-width: 500px;
  }

  .nft-collection-pieces__piece-node-avatar {
    max-width: 200px;
    margin: 1rem;
  }
}

.nft-collection-pieces__image-node-avatar {
  max-width: clamp(190px, 75vw, 190px);
  width: 100%;
}

@media (min-width: 1000px) {
  .nft-collection-pieces__piece-description-selected {
    bottom: -45vh;
    z-index: 100;
  }

  .nft-collection-pieces__piece-description-selected-higher-img {
    bottom: -20vh;
    z-index: 100;
  }
}

.nft-collection-pieces__piece-description:hover {
  visibility: visible;
}

.nft-collection-pieces__is-active-image {
  transition: all 0.35s;
  z-index: 10;
  transform: translateY(0) translateX(0) rotate(0) scale(1.1) !important;
}

.nft-collection-pieces__is-active-image-replacement {
  width: 500px;
}

.nft-collection-pieces__is-active-image-backdrop {
  position: fixed;
  inset: 0;
  height: 140vh;
  z-index: 1;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(1px) grayscale(1);
  transition: all 0.5s;
}

.dark-mode .nft-collection-pieces__is-active-image-backdrop {
  background-color: unset
} */

// / Animation /

/* .images-enter-active,
.images-leave-active {
  transition: all 0.5s;
}

.images-enter-from {
  opacity: 0;
}

.images-leave-to {
  opacity: 0;
  */
.collection-container
  position absolute


</style>

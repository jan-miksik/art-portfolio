<template>
  <Transition name="images">
      <div
        v-if="props.type === props.selectedTopic"
        :class="[
          'nft-collection-pieces__images',
          { 'nft-collection-pieces__selected-image': activeImage },
          props.type === props.selectedTopic
            ? 'nft-collection-pieces__is-section-visible'
            : 'nft-collection-pieces__is-section-hidden'
        ]"
      >
      <NFTCollection />
      </div>
  </Transition>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import { Topics } from '~/components/piecesData'

const activeImage = ref()
const props = defineProps<{
  pieces?: Piece[]
  type: Topics
  selectedTopic?: Topics
}>()

const getScale = (coordinates: any) => {
  const widthRatio = window.innerWidth / coordinates.width
  const heightRatio = window.innerHeight / (coordinates.height + 50)
  const scale = widthRatio > heightRatio ? heightRatio : widthRatio

  if (scale > 2.2) return 2.2
  return scale
}

const handleImagePosition = (piece: Piece) => {
  if (piece.id !== activeImage.value || window.innerWidth <= 1000) {
    return piece.randomizedPosition
  }
  const selectedImage = document.getElementById(piece.id)
  const coordinates = selectedImage?.getBoundingClientRect()
  if (!coordinates || !selectedImage) return
  const translateY = coordinates.height < 320 ? 110 : 100

  return {
    transform: `rotate(0deg) scale(${getScale(
      coordinates
    )}) translateY(${translateY}px) translateX(${
      (window.innerWidth / 2 - (coordinates.width / 2 + coordinates.left)) / 2
    }px) !important`
  }
}

const handleImageClass = (piece: Piece) => {
  const selectedImage = document.getElementById(piece.id)
  const coordinates = selectedImage?.getBoundingClientRect()
  if (!coordinates || !selectedImage) return
  const heightRatio = coordinates.height / coordinates.width

  const isHigherThanWider = heightRatio > 1

  return isHigherThanWider && coordinates.height > 350
    ? 'nft-collection-pieces__piece-description-selected-higher-img'
    : 'nft-collection-pieces__piece-description-selected'
}

const selectImage = (id: string) => {
  if (activeImage.value === id) {
    activeImage.value = undefined
    return
  }
  const selectedImage = document.getElementById(id)
  const coordinates = selectedImage?.getBoundingClientRect()
  if (!coordinates || !selectedImage) return

  const heightRatio = coordinates.height / coordinates.width

  const isHigherThanWider = heightRatio > 1.15

  if (window.innerHeight > window.innerWidth) {
    const targetPosition = window.scrollY + (coordinates?.y || 0) - 185
    window.scrollTo(0, targetPosition)
  } else {
    const targetPosition =
      window.scrollY + (coordinates?.y || 0) + (isHigherThanWider ? 85 : 0)

    window.scrollTo(0, targetPosition)
  }
  activeImage.value = id
}
</script>

<style scoped>
.nft-collection-pieces__images {
  position: absolute;
  padding: 10rem 1.5rem 30rem;
  left: 0;
  right: 0;
  margin: auto;
  z-index: -1;
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
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 140vh;
  z-index: 1;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(1px) grayscale(1);
  transition: all 0.5s;
}

.dark-mode .nft-collection-pieces__is-active-image-backdrop {
  background-color: rgb(255 255 255 / 50%);
}

/* / Animation / */
.images-enter-active,
.images-leave-active {
  transition: all 0.5s;
}

.images-enter-from {
  opacity: 0;
}

.images-leave-to {
  opacity: 0;
}
</style>

<template>
  <Transition name="images">
    <div
      v-if="props.pieces && props.type === props.selectedTopic"
      :class="[
        'pieces__images',
        { 'pieces__selected-image': activeImage },
        props.pieces && props.type === props.selectedTopic
          ? 'pieces__is-section-visible'
          : 'pieces__is-section-hidden'
      ]"
    >
      <div
        v-for="(piece, index) in props.pieces"
        :key="piece?.id || index"
        :class="[
          'pieces__piece',
          { 'pieces__piece-node-avatar': Topics.NODE_AVATARS === props.type },
          { 'pieces__active-image-container': piece.id === activeImage }
        ]"
      >
        <Image
          v-if="piece"
          :id="piece.id"
          :src="piece.image"
          :class="[
            'pieces__image',
            { 'pieces__image-node-avatar': Topics.NODE_AVATARS === props.type },
            { 'pieces__is-active-image': piece.id === activeImage }
          ]"
          width="500"
          height="400"
          :style="handleImagePosition(piece)"
          @click="selectImage(piece.id)"
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
      <div
        :class="[{ 'pieces__is-active-image-backdrop': activeImage }]"
        @click="activeImage = undefined"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Piece from '@/models/Piece'
import { Topics } from '@/components/piecesData'
import { ref } from 'vue'
import Image from './Image.vue'

const activeImage = ref()
const props = defineProps<{
  pieces?: Piece[]
  type: Topics
  selectedTopic: Topics
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
    ? 'pieces__piece-description-selected-higher-img'
    : 'pieces__piece-description-selected'
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

// const getImagePath = (imagePath: string) => {
//   if (!imagePath) {
//     return
//   }
//   if (imagePath.includes('https://')) return imagePath
//   return new URL(`../assets/${imagePath}`, import.meta.url)?.href
// }
</script>

<style scoped>
.pieces__images {
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
  .pieces__images {
    gap: 1rem;
  }
}

.pieces__selected-image {
  z-index: 5;
}

.pieces__image {
  transition: all 0.3s;
  max-width: clamp(230px, 87vw, 750px);
  width: 100%;
  position: relative;
  object-fit: contain;
  max-height: 85vh;
}

.pieces__active-image-container {
}

.pieces__piece,
.pieces__piece-node-avatar {
  transition: all 0.25s;
  position: relative;
  width: 100%;
}

.pieces__image:hover {
  cursor: cell;
  transform: translateY(0) translateX(0) rotate(0) scale(1.1) !important;
  z-index: 100;
}
.pieces__image:hover + .pieces__piece-description-unselected {
  display: block;
}

@media (min-width: 1000px) {
  .pieces__piece {
    max-width: 500px;
  }
  .pieces__piece-node-avatar {
    max-width: 200px;
    margin: 1rem;
  }

  .pieces__active-image-container {
    /* max-width: 100%; */
  }
}
.pieces__image-node-avatar {
  max-width: clamp(190px, 75vw, 190px);
  width: 100%;
}

.pieces__piece-description-unselected {
  display: none;
}
.pieces__piece-description-selected,
.pieces__piece-description-selected-higher-img,
.pieces__piece-description-unselected {
  transition: all 0.2s;
  background-color: #eee;
  padding: 1rem 0.7rem;
  font-size: 0.7rem;
  text-align: left;
  color: #919191;
  border-radius: 2px;
  z-index: 10;
  width: fit-content;
  max-width: 500px;

  position: absolute;

  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 1000px) {
  .pieces__piece-description-selected {
    bottom: -50vh;
    z-index: 100;
  }

  .pieces__piece-description-selected-higher-img {
    bottom: -20vh;
    z-index: 100;
  }
}
.pieces__piece-description:hover {
  visibility: visible;
}

.pieces__is-active-image {
  transition: all 0.35s;
  z-index: 10;
  transform: translateY(0) translateX(0) rotate(0) scale(1.1) !important;
}

.pieces__is-active-image-replacement {
  width: 500px;
}

.pieces__is-active-image-backdrop {
  position: fixed;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  height: 140vh;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(1px) grayscale(1);
  transition: all 0.5s;
}

/*/ Animation /*/
.images-enter-active,
.images-leave-active {
  transition: all 2.5s;
  /* transition-delay: 10s; */
}

.images-enter-from {
  opacity: 0;
}

.images-leave-to {
  opacity: 0;
}
</style>

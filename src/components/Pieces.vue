<template>
  <Transition name="images">
    <div
      :class="[
        'pieces__images',
        { 'pieces__selected-image': activeImage },
        (props.pieces && props.type === props.selectedTopic) ? 'pieces__is-section-visible':'pieces__is-section-hidden'
      ]"
      v-if="props.pieces && props.type === props.selectedTopic"
    >
      <div
        v-for="(piece, index) in props.pieces"
        :key="piece.id"
        :class="[
          'pieces__piece',
          { 'pieces__active-image-container': piece.id === activeImage },
        ]"
        
      >
        <img
          @click="selectImage(piece.id)"
          :id="piece.id"
          :src="getImagePath(piece.image)"
          :class="[
            'pieces__image',
            { 'pieces__image-node-avatar': Topics.NODE_AVATARS === props.type },
            { 'pieces__is-active-image': piece.id === activeImage },
          ]"
          :style="piece.randomizedPosition"
        />

        <div
          :class="[
            piece.id === activeImage
              ? 'pieces__piece-description-selected'
              : 'pieces__piece-description-unselected',
          ]"
        >
          <strong>{{ piece.name }} </strong>, {{ piece.created.getFullYear() }},
          {{ piece.techniqueDescription }}, {{ piece.sizeInCm.x }}cm x
          {{ piece.sizeInCm.y }}cm
        </div>
      </div>
      <div
        @click="activeImage = undefined"
        :class="[{ 'pieces__is-active-image-backdrop': activeImage }]"
      />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import Piece from "@/models/Piece";
import { Topics } from "@/components/piecesData";
import { onMounted, ref } from "vue";
const activeImage = ref();
const isInitialized = ref(false);

const props = defineProps<{
  pieces?: Piece[];
  type: Topics;
  selectedTopic: Topics;
}>();

const selectImage = (id: string) => {
  if (activeImage.value === id) {
    activeImage.value = undefined;
    return;
  }
  const coordinates = document.getElementById(id)?.getBoundingClientRect();
  if (window.innerHeight > window.innerWidth) {
    const targetPosition = window.scrollY + (coordinates?.y || 0) - 185;
    window.scrollTo(0, targetPosition);
  } else {
    const targetPosition = window.scrollY + (coordinates?.y || 0);
    window.scrollTo(0, targetPosition);
  }
  activeImage.value = id;
};

const getImagePath = (imagePath: string) => {
  if (!imagePath) {
    return;
  }
  return new URL(`../assets/${imagePath}`, import.meta.url)?.href;
};
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

.pieces__selected-image {
  z-index: 5;
  /* max-height: 85vh; */
}



.pieces__image {
  transition: all 0.3s;
  max-width: clamp(230px, 87vw, 750px);
  width: 100%;
  position: relative;
      object-fit: contain;
    max-height: 85vh;
}

/* .pieces__is-section-visible {
  display: flex;
}

.pieces__is-section-hidden {
  display: none;
} */

/* .pieces__image:hover {
  
  transform: scale(1.1) !important;
} */

.pieces__active-image-container {
}

.pieces__piece {
  transition: all 0.25s;
  position: relative;
  width: 100%;
}

.pieces__image:hover + .pieces__piece-description {
  visibility: visible;
}

.pieces__image-node-avatar {
  max-width: clamp(190px, 75vw, 190px);
  width: 100%;
}

.pieces__piece-description-unselected {
  display: none;
}
.pieces__piece-description-selected {
  /* visibility: hidden; */
  transition: all 0.2s;
  background-color: #eee;
  padding: 1rem 0.7rem;
  /* border-radius: 1px 1px 10px 10px; */
  font-size: 0.7rem;
  text-align: left;
  color: #919191;
  border-radius: 2px;
  z-index: 10;

  position: absolute;

  width: fit-content;
  max-width: 500px;
  bottom: -90px;
  left: 50%;
  transform: translateX(-50%);
}

.pieces__piece-description:hover {
  visibility: visible;
}

.pieces__is-active-image {
  transition: all 0.35s;
  z-index: 10;
  transform: translateY(0) translateX(0) rotate(0) scale(1.1) !important;
  /* min-width: 93vw; */
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

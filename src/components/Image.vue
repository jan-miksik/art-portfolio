<template>
  <img
    ref="imageRef"
    loading="lazy"
    :src="getImagePath(props.src || '')"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const imageRef = ref()
const props = defineProps<{
  src: string
}>()

const loaded = () => {
  imageRef.value.classList.remove('animBg')
}

onMounted(() => {
  // imageRef.value.style.backgroundColor = '#797979'
  imageRef.value.classList.add('animBg')
  imageRef.value.addEventListener('load', loaded)
})

onUnmounted(() => {
  imageRef.value?.removeEventListener('load', loaded)
})

const getImagePath = (imagePath: string) => {
  if (!imagePath) {
    return
  }
  if (imagePath.includes('https://')) return imagePath
  return new URL(`../assets/${imagePath}`, import.meta.url)?.href
}
</script>

<style scoped>

@keyframes backgroundColorPalette {
  0% {
    background: #fb648fb1;
  }
  25% {
    background: #87ed69;
  }
  50% {
    background: #4c6ee6;
  }
  75% {
    background: #ffd97d;
  }
  100% {
    background: #644b6f;
  }
}

.animBg {
  animation-name: backgroundColorPalette;
  animation-duration: 3.5s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  /* filter: opacity(0.3) blur(7px); */
}

</style>

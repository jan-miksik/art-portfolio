<template>
  <img
    ref="imageRef"
    loading="lazy"
    :src="getImagePath(props.src || '')"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

// import { StyleValue } from 'vue'
const imageRef = ref()
const props = defineProps<{
  src: string
}>()

// const options = {
//   // root: imageRef.value,
//   // rootMargin: '0px',
//   threshold: [0, 0.25, 0.5, 0.75, 1]
// }

// const handleImageLoaded = () => {
//   console.log('imageRef: 000000', imageRef)
//   console.log('handleImageLoaded')
// }

// const observer = new IntersectionObserver((entries, observer) => {
//   console.log('entries: ', entries)
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       console.log('entry.isIntersecting')
//       handleImageLoaded()
//       // observer.unobserve(imageRef.value)
//     }
//   })
// }, options)

const loaded = () => {
  console.log('loaded')
  console.log('imageRef.value: ', imageRef.value)
  imageRef.value.classList.remove('animBg')
  // imageRef.value.style.backgroundColor = 'transparent'
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
    background: #ee6055;
  }
  25% {
    background: #60d394;
  }
  50% {
    background: #aaf683;
  }
  75% {
    background: #ffd97d;
  }
  100% {
    background: #ff9b85;
  }
}

.animBg {
  animation-name: backgroundColorPalette;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  /* filter: opacity(0.3) blur(7px); */
}

</style>

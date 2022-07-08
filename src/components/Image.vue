<template>
  <img
    ref="imageRef"
    loading="lazy"
    :src="imageSrc"
  />
</template>

<script setup lang="ts">
import Piece from '@/models/Piece'
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import { updateImage, addImage, getImage } from '@/services/idb'
const imageRef = ref()
const imageSrc = ref()
const props = defineProps<{
  piece: Piece
}>()

const { piece } = toRefs(props)

const loaded = () => {
  imageRef.value?.classList.remove('animBg')
}

onMounted(() => {
  giveImageSourcePlease()
  imageRef.value?.classList.add('animBg')
  imageRef.value.addEventListener('load', loaded)
})

onUnmounted(() => {
  imageRef.value?.removeEventListener('load', loaded)
})

const giveImageSourcePlease = async () => {
  const showImageFromProps = (url: string) => {
    if (url.includes('https://')) {
      imageSrc.value = url
    } else {
      imageSrc.value = new URL(`../assets/${url}`, import.meta.url)?.href
    }
  }

  if (!piece.value) return

  const { image, id } = piece.value
  const imageFromIDB = await getImage(piece.value.id)

  if (!imageFromIDB) {
    await addImage({ image, id })
  }

  if (imageFromIDB) {
    if (imageFromIDB.lastUpdated !== image.lastUpdated) {
      updateImage({ image, id })
      showImageFromProps(image.url)
      return
    }
    imageSrc.value = URL.createObjectURL(imageFromIDB.blob)
  }

  showImageFromProps(image.url)
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

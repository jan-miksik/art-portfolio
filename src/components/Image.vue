<template>
  <img
    ref="imageRef"
    loading="lazy"
    :src="imageSrc"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, toRefs } from 'vue'
import { updateImage, addImage, getImage } from '@/services/idb'
import ImageFile from '@/models/ImageFile'
const imageRef = ref()
const imageSrc = ref()
const props = defineProps<{
  imageFile: ImageFile
}>()

const { imageFile } = toRefs(props)

const loaded = () => {
  imageRef.value?.classList.remove('anim-bg')
}

onMounted(() => {
  giveImageSourcePlease()
  imageRef.value?.classList.add('anim-bg')
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

  if (!imageFile.value) return
  const imageFromIDB = await getImage(imageFile.value.id)

  if (!imageFromIDB) {
    await addImage(imageFile.value)
  }

  if (imageFromIDB) {
    if (imageFromIDB.lastUpdated !== imageFile.value.lastUpdated) {
      updateImage(imageFile.value)
      showImageFromProps(imageFile.value.url)
      return
    }
    imageSrc.value = URL.createObjectURL(imageFromIDB.blob)
    return
  }

  showImageFromProps(imageFile.value.url)
}

</script>

<style scoped lang="stylus">
@keyframes background-color-palette
  0%
    background #fb648fb1

  25%
    background #87ed69

  50%
    background #4c6ee6

  75%
    background #ffd97d

  100%
    background #644b6f

.anim-bg
  animation-name background-color-palette
  animation-duration 3.5s
  animation-iteration-count infinite
  animation-direction alternate

</style>

<template>
  <img
    ref="imageRef"
    loading="lazy"
    :src="isVisible ? imageSrc : ''"
  />
</template>

<script setup lang="ts">
import { updateImage, addImage, getImage } from '~/services/idb'
import ImageFile from '~/models/ImageFile' 
// import VLazyImage from "v-lazy-image";

const imageRef = ref()
const imageSrc = ref()
const isVisible = ref(false)
const props = defineProps<{
  imageFile: ImageFile
}>()

const { imageFile } = toRefs(props)


const giveImageSourcePlease = async () => {

  // if (!isVisible.value) return
  
  const imageFromIDB = await getImage(imageFile.value.id)

  if (!imageFromIDB) {
    await addImage(imageFile.value)
  }

  if (imageFromIDB) {
    if (imageFromIDB.lastUpdated !== imageFile.value.lastUpdated) {
      updateImage(imageFile.value)
      imageSrc.value = imageFile.value.url
      return
    }
    imageSrc.value = URL.createObjectURL(imageFromIDB.blob)
    return
  }

  imageSrc.value = imageFile.value.url
}

const loaded = () => {
  imageRef.value?.classList.remove('anim-bg')
}

onMounted(async () => {
  const observer = new IntersectionObserver((entries) => {
    // The callback will be called when the image enters or leaves the viewport
    if (entries[0].isIntersecting) {
      // The image has entered the viewport
      isVisible.value = true
      // We don't need the observer anymore, so we disconnect it
      observer.disconnect()
    }
  }, {
    threshold: 0
  })

  // Start observing the image
  observer.observe(imageRef.value)

  await giveImageSourcePlease()
})

watch(isVisible, (newVal) => {
  if (newVal) {
    imageRef.value?.classList.add('anim-bg')
    imageRef.value.addEventListener('load', loaded)
  }
})

onUnmounted(() => {
  imageRef.value?.removeEventListener('load', loaded)
})



// onUnmounted(() => {
//   imageRef.value?.removeEventListener('load', loaded)
// })

// const giveImageSourcePlease = async () => {
//   const imageFromIDB = await getImage(imageFile.value.id)

//   if (!imageFromIDB) {
//     await addImage(imageFile.value)
//   }

//   if (imageFromIDB) {
//     if (imageFromIDB.lastUpdated !== imageFile.value.lastUpdated) {
//       updateImage(imageFile.value)
//       imageSrc.value = imageFile.value.url
//       return
//     }
//     imageSrc.value = URL.createObjectURL(imageFromIDB.blob)
//     return
//   }

//   imageSrc.value = imageFile.value.url
// }

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

<template>
  <div class="image">
    <img
      :class="[{ 'image__low': !externalCssClass }, externalCssClass]"
      v-show="showLowImage"
      ref="lowImageRef"
      :loading="lowImageLoading"
      :fetchpriority="lowImageFetchpriority"
      :src="lowImageSrcComputed"
      :style="externalCssClass"
    />
    <img
      :class="[{ 'image__full': !externalCssClass }, externalCssClass]"
      v-show="selectedResolutionType === RESOLUTION.FULL"
      ref="fullImageRef"
      :loading="fullImageLoading"
      :fetchpriority="fullImageFetchpriority"
      :src="fullImageSrcComputed"
    />
  </div>
</template>

<script setup lang="ts">
import { updateImage, addImage, getImage } from '~/services/idb'
import ImageFile from '~/models/ImageFile'
import useMapper from '~/J/useMapper'
import { IPiece } from '~/models/Piece'
import { ImageIDB } from '../../services/idb';

const { mapperEventData } = useMapper()

enum RESOLUTION {
  LOW = 'LOW',
  FULL = 'FULL'
}

const props = defineProps<{
  imageFile: ImageFile
  piece?: IPiece
  isFullSize?: boolean
  externalCssClass?: any
}>()
const { imageFile, piece, isFullSize, externalCssClass } = toRefs(props)

const isVisible = ref(false)

const selectedResolutionType = computed(() => {
  if (isFullSize?.value) return RESOLUTION.FULL

  if (mapperEventData.value?.scale > 1) {
    return RESOLUTION.FULL
  } else {
    return RESOLUTION.LOW
  }
})



// LOW IMAGE
const lowImageRef = ref()
const lowImageFileFromIDB = ref<ImageIDB>()
const lowImageSrc = ref('')


const showLowImage = computed(() => 
  selectedResolutionType.value === RESOLUTION.LOW || 
  !isFullImageLoaded.value
)

const lowImageLoading = computed(() => {
  if (isVisible.value && selectedResolutionType.value === RESOLUTION.LOW)
    return 'eager'
  return 'lazy'
})


const lowImageFetchpriority = computed(() => {
  if (isVisible.value && selectedResolutionType.value === RESOLUTION.LOW)
    return 'high'
  return 'low'
})


const lowImageSrcComputed = computed(() => {
  if (!piece?.value) return imageFile.value.url
  return lowImageSrc.value
})


const lowImageWidthByScale = computed(() => {
  if (piece?.value?.sizeInPx?.x) {
    const primaryWidthForPx = (piece?.value?.sizeInPx?.x || 150) / 5
    if (primaryWidthForPx < 150) return 150
    return Math.floor(primaryWidthForPx)
  }

  const primaryWidth = (piece?.value?.sizeInCm?.x || 30) * 5
  if (primaryWidth < 150) return 150
  return primaryWidth
})


const lowImageFileByScale = computed(() => {
  if (!piece?.value?.isUploadedToCf) {
    return imageFile.value
  }

  const imageFileCopy = JSON.parse(JSON.stringify(imageFile.value))
  imageFileCopy.url = `${imageFile.value.url}?w=${lowImageWidthByScale.value}`
  imageFileCopy.id = `${imageFile.value?.id}-scale-less-than-1`
  return imageFileCopy
})


const giveLowImageSourcePlease = async () => {

  if (lowImageSrc.value || lowImageFileFromIDB.value) return
  lowImageFileFromIDB.value = await getImage(lowImageFileByScale.value.id)
  
  if (!lowImageFileFromIDB.value) {
    addImage(lowImageFileByScale.value)
    lowImageSrc.value = lowImageFileByScale.value.url
    return
  }

  if (lowImageFileFromIDB.value) {
    if (lowImageFileFromIDB.value.lastUpdated !== lowImageFileByScale.value.lastUpdated) {
      updateImage(lowImageFileByScale.value)
      lowImageSrc.value = lowImageFileByScale.value.url
      return
    }
  
    lowImageSrc.value = URL.createObjectURL(lowImageFileFromIDB.value.blob)
  }
}












// FULL IMAGE

const fullImageSrc = ref('')
const fullImageFileInIDB = ref<ImageIDB>()
const fullImageRef = ref()
const isFullImageLoaded = ref(false)


const fullImageLoading = computed(() => {
  if (isVisible.value && selectedResolutionType.value === RESOLUTION.FULL)
    return 'eager'
  return 'lazy'
})


const fullImageFetchpriority = computed(() => {
  if (isVisible.value && selectedResolutionType.value === RESOLUTION.FULL)
    return 'high'
  return 'low'
})


const fullImageSrcComputed = computed(() => {
  if (!piece?.value) return imageFile.value.url
  return fullImageSrc.value
})


const giveFullImageSourcePlease = async () => {

  if (fullImageSrc.value || fullImageFileInIDB.value) return
  fullImageFileInIDB.value = await getImage(imageFile.value.id)
  
  if (!fullImageFileInIDB.value) {
    addImage(imageFile.value)
    fullImageSrc.value = imageFile.value.url
    return
  }

  if (fullImageFileInIDB.value) {
    if (fullImageFileInIDB.value.lastUpdated !== imageFile.value.lastUpdated) {
      updateImage(imageFile.value)
      fullImageSrc.value = imageFile.value.url
      return
    }
  
    fullImageSrc.value = URL.createObjectURL(fullImageFileInIDB.value.blob)
  }
}



const loadedLowImage = () => {
  lowImageRef.value?.classList.remove('anim-bg')
}

const loadedFullImage = () => {
  fullImageRef.value?.classList.remove('anim-bg')
  isFullImageLoaded.value = true
}

watch(isVisible, (newVal) => {
  if (newVal) {

  }
})

watch([isVisible, () => mapperEventData.value?.scale], async (newVal) => {
  
  if (!isVisible) return

  if (isFullSize.value) {
    // giveLowImageSourcePlease() 
    giveFullImageSourcePlease()
    return
  }

  if (mapperEventData.value?.scale > 1) {
    giveFullImageSourcePlease()
  } else {
    giveLowImageSourcePlease() 
  }
})

onMounted(async () => {
  lowImageRef.value?.classList.add('anim-bg')
  lowImageRef.value.addEventListener('load', loadedLowImage)

  fullImageRef.value?.classList.add('anim-bg')
  fullImageRef.value.addEventListener('load', loadedFullImage)

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
  observer.observe(lowImageRef.value)
  observer.observe(fullImageRef.value)
})


onUnmounted(() => {
  lowImageRef.value?.removeEventListener('load', loadedLowImage)
  fullImageRef.value?.removeEventListener('load', loadedFullImage)
})

</script>

<style scoped lang="stylus">

.image__low
.image__full
  border 1px solid transparent
  position absolute
  object-fit contain
  width 100%
  left 0
  min-width 10px
  min-height 10px


.image__low
  z-index 10000000000

@keyframes background-color-palette
  0%
    background #f53b5a

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

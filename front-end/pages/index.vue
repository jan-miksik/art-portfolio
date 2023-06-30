<template>
    <ODarkModeSwitcher />
    <!-- <div class="homepage__open-topic-icons"> -->
      <!-- <SelectTopicIcon :icon="sansTopicIcon" label="Free Topic" :topic="Topics.SANS_TOPIC" class="homepage__sans-topic-link" />

      <SelectTopicIcon :icon="geometryIcon" label="Geometry" :topic="Topics.GEOMETRY" class="homepage__geometry-link"/>

      <SelectTopicIcon :icon="nodeAvatarsIcon" label="Node Avatars" :topic="Topics.NODE_AVATARS" class="homepage__node-avatars-link"/>

      <SelectTopicIcon :icon="puzzleIcon" label="Puzzle" :topic="Topics.PUZZLE" class="homepage__puzzle-link"/>

      <SelectTopicIcon :icon="collectIcon" label="Into Pieces" :topic="Topics.NFT_COLLECTION" class="homepage__nft-collection-link"/> -->
    <!-- </div> -->

    <Contact />  

    <PinchScrollZoom
      v-if="windowObject?.innerWidth && edgePositions.x"
      ref="mapperRef"
      :width="windowObject.innerWidth"
      :height="windowObject.innerHeight"
      within
      class="pinch-scroll-zoom"
      :min-scale="0.01"
      :max-scale="100"
      @scaling="e => onMapperEvent('scaling', e)"
      @startDrag="e => onMapperEvent('startDrag', e)"
      @stopDrag="e => onMapperEvent('stopDrag', e)"
      @dragging="e => onMapperEvent('dragging', e)"
      :draggable="isMapperDraggable"
      :wheelVelocity="0.001"
      :throttleDelay="20"
      :content-width="edgePositions.x"
      :content-height="edgePositions.y">
      <Pieces />
    </PinchScrollZoom>

</template>

<script setup lang="ts">
import '@coddicat/vue-pinch-scroll-zoom/style.css';

import PinchScrollZoom, {
  type PinchScrollZoomEmitData,
  type PinchScrollZoomExposed
} from '@coddicat/vue-pinch-scroll-zoom';
import usePieces from '~/J/usePieces'
import 'swiper/css'
import 'swiper/css/navigation'
import useMapper from '~/J/useMapper';
import useAdminPage from '~/J/useAdminPage';

const { edgePositions } = usePieces()
const { onMapperEvent, isMapperDraggable } = useMapper()

const mapperRef = ref<PinchScrollZoomExposed>();
const isMapperSet = ref(false)


const windowObject = computed(() => window)

const {
  isSetupForMobile
} = useAdminPage()
// const windowWidth = ref()
// const windowHeight = ref()
  
// onMounted(() => {
//   windowWidth.value = window.innerWidth
//   windowHeight.value = window.innerHeight
// })

// function onMapperEvent(name: string, event: PinchScrollZoomEmitData): void {
//   if (name === 'dragging' && isOverPieceOrSetup.value) {
//     isMapperDraggable.value = false;
//   } else {
//     isMapperDraggable.value = true;
//   }
//   mapperEventData.value = event
// }

watch(mapperRef, (newVal) => {
  console.log('newVal: ', newVal);
  if (!newVal || isMapperSet.value) return
  isMapperSet.value = true
  if (isSetupForMobile.value) {
    mapperRef.value?.setData({
      scale: 0.25,
      originX: 4412,
      originY: 6505,
      translateX: -4200,
      translateY: -6000,
    });
  } else {
    mapperRef.value?.setData({
      scale: 0.7,
      originX: 4725,
      originY: 6388,
      translateX: -3970,
      translateY: -6017,
    });
  }
})

useHead({
  title: 'Jan Mikšík',
  meta: [{
    content: 'Drawings, paintings, digital pieces and others'
  }]
})



// const sansTopicIcon = ref(
//   new ImageFile({
//     url: 'topics-entry-icons/sans-topic-icon.webp',
//     id: 'title-sans-topic-img',
//     lastUpdated: new Date('1991').getTime()
//   })
// )

// const geometryIcon = ref(
//   new ImageFile({
//     url: 'topics-entry-icons/geometry-icon.png',
//     id: 'geometry-title-img',
//     lastUpdated: new Date('1991').getTime()
//   })
// )

// const nodeAvatarsIcon = ref(
//   new ImageFile({
//     url: 'topics-entry-icons/node-avatars-icon.webp',
//     id: 'node-avatars-title-img',
//     lastUpdated: new Date('1997').getTime()
//   })
// )

// const puzzleIcon = ref(
//   new ImageFile({
//     url: 'topics-entry-icons/puzzle-icon.webp',
//     id: 'puzzle-title-img',
//     lastUpdated: new Date('1993').getTime()
//   })
// )

// const collectIcon = ref(
//   new ImageFile({
//     url: 'topics-entry-icons/collect-icon.png',
//     id: 'collect',
//     lastUpdated: new Date('1993').getTime()
//   })
// )

</script>

<style lang="stylus">

.pinch-scroll-zoom
  cursor move

.swiper-wrapper
  min-width 100vh
  width 100vh

.slide
  background floralwhite
  height 90vh
</style>

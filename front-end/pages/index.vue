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

  <!-- <div class="index__pinch-scroll-zoom-container" ref="mapperContainerRef"> -->
    <!-- :style="mapperContainerStyle" -->
    <PinchScrollZoom
      v-if="windowObject?.innerWidth && edgePositions.x"
      ref="mapperRef"
      :width="windowObject.innerWidth"
      :height="windowObject.innerHeight"
      class="pinch-scroll-zoom"
      :min-scale="0.01"
      :max-scale="100"
      @scaling="(e) => onMapperEvent('scaling', e)"
      @startDrag="(e) => onMapperEvent('startDrag', e)"
      @stopDrag="(e) => onMapperEvent('stopDrag', e)"
      @dragging="(e) => onMapperEvent('dragging', e)"
      :wheelVelocity="0.001"
      :throttleDelay="20"
      :content-width="edgePositions.x"
      :content-height="edgePositions.y"
      :draggable="!isOverPieceOrSetupInPublicPage"
      >
      <Pieces />
    </PinchScrollZoom>
  <!-- </div> -->
</template>

<script setup lang="ts">
import '@coddicat/vue-pinch-scroll-zoom/style.css'
import PinchScrollZoom from '@coddicat/vue-pinch-scroll-zoom'
import usePieces from '~/J/usePieces'
import useMapper from '~/J/useMapper'
import useAdminPage from '~/J/useAdminPage'
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'

const { edgePositions } = usePieces()
const { onMapperEvent } = useMapper()

const { isOverPieceOrSetupInPublicPage } = useMouseActionDetector()
const isMapperSet = ref(false)
const mapperRef = ref()
// const mapperContainerPosition = ref({ x: 0, y: 0 })
// const mapperContainerRef = ref()

const windowObject = computed(() => window)

const { isSetupForMobile } = useAdminPage()

watch(mapperRef, (newVal) => {
  if (!newVal || isMapperSet.value) return
  isMapperSet.value = true
  if (isSetupForMobile.value) {
    mapperRef.value?.setData({
      scale: 0.25,
      originX: 4412,
      originY: 6505,
      translateX: -4200,
      translateY: -6000
    })
  } else {
    mapperRef.value?.setData({
      scale: 0.5,
      originX: 4725,
      originY: 6388,
      translateX: -3770,
      translateY: -5717
    })
  }

  // if (!mapperContainerRef.value) return

  // interact(mapperContainerRef.value).draggable({
  //   inertia: true,
  //   autoScroll: true,
  //   listeners: {
  //     move(event) {
  //       const xRaw = mapperContainerPosition.value.x + event.dx
  //       const yRaw = mapperContainerPosition.value.y + event.dy
  //       const x = xRaw > -20000 ? xRaw : -20000
  //       const y = yRaw > -20000 ? yRaw : -20000
  //       mapperContainerPosition.value.x = x
  //       mapperContainerPosition.value.y = y
  //     }
  //   }
  // })
})

useHead({
  title: 'Jan Mikšík',
  meta: [
    {
      content: 'Drawings, paintings, digital pieces and others'
    }
  ]
})

// const mapperContainerStyle = computed(() => {
//   return {
//     left: `${mapperContainerPosition.value.x}px`,
//     top: `${mapperContainerPosition.value.y}px`
//   }
// })

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
.index__pinch-scroll-zoom-container
  position fixed
  top 0
  left 0
  background #dbdae1
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center

.pinch-scroll-zoom
  position absolute
  cursor move
</style>

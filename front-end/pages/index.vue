<template>
  <div>
    <ODarkModeSwitcher />
    <OArchiveToggler />
    <!-- <div class="homepage__open-topic-icons"> -->
    <!-- <SelectTopicIcon :icon="sansTopicIcon" label="Free Topic" :topic="Topics.FREE_TOPIC" class="homepage__sans-topic-link" />

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
      class="pinch-scroll-zoom"
      :min-scale="0.01"
      :max-scale="1000"
      @scaling="(e: PinchScrollZoomEmitData) => onMapperEvent('scaling', e)"
      @startDrag="(e: PinchScrollZoomEmitData) => onMapperEvent('startDrag', e)"
      @stopDrag="(e: PinchScrollZoomEmitData) => onMapperEvent('stopDrag', e)"
      @dragging="(e: PinchScrollZoomEmitData) => onMapperEvent('dragging', e)"
      :wheelVelocity="0.001"
      :throttleDelay="20"
      :content-width="edgePositions.x"
      :content-height="edgePositions.y"
      :draggable="!isOverPieceOrSetup"
    >
      <Pieces />
    </PinchScrollZoom>
  </div>
</template>

<script setup lang="ts">
import '@coddicat/vue-pinch-scroll-zoom/style.css'
import PinchScrollZoom, {
  type PinchScrollZoomEmitData
} from '@coddicat/vue-pinch-scroll-zoom'
import usePieces from '~/J/usePieces'
import useMapper from '~/J/useMapper'
import useAdminPage from '~/J/useAdminPage'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const { edgePositions } = usePieces()
const { onMapperEvent } = useMapper()

const { isOverPieceOrSetupInPublicPage, isOverPieceOrSetup } = useMouseActionDetector()
const isMapperSet = ref(false)
const mapperRef = ref()

const windowObject = computed(() => window)

const { isSetupForMobile } = useAdminPage()

watch(mapperRef, (newVal) => {
  if (!newVal || isMapperSet.value) return
  isMapperSet.value = true
  if (isSetupForMobile.value) {
    mapperRef.value?.setData({
      scale: 0.25,
      originX: 3000,
      originY: 6000,
      translateX: -100 - LEFT_OFFSET,
      translateY: -1700 - TOP_OFFSET
    })
  } else {
    mapperRef.value?.setData({
      scale: 0.7,
      originX: 3000,
      originY: 6000,
      translateX: -3900 - LEFT_OFFSET,
      translateY: -3800 - TOP_OFFSET
    })
  }
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

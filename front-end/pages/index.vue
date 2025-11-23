<template>
  <div>
    <BaseDarkModeSwitcher />
    <BaseArchiveToggler />
    <BaseBeSupporter />
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
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'

const { edgePositions } = usePieces()
const { onMapperEvent } = useMapper()

const { isOverPieceOrSetup } = useMouseActionDetector()
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
      scale: 0.37,
      originX: 3000,
      originY: 6000,
      translateX: -850 - LEFT_OFFSET,
      translateY: -1900 - TOP_OFFSET
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

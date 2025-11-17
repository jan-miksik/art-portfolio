<template>
  <div
    class="collection-container"
    :style="IntoPiecesCollectionStyle"
    ref="IntoPiecesCollectionRef"
    >
      <IntoPiecesCollection />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useAdminPage from '~/J/useAdminPage'
import useMapper from '~/J/useMapper'
import usePieces from '~/J/usePieces'
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'


const IntoPiecesCollectionRef = ref<HTMLCanvasElement>()
const IntoPiecesCollectionPosition = ref({
  x: 10000,
  y: 6500
})

const IntoPiecesCollectionStyle = computed(() => {
  return {
    left: `${IntoPiecesCollectionPosition.value.x + LEFT_OFFSET}px`,
    top: `${IntoPiecesCollectionPosition.value.y + TOP_OFFSET}px`,
  }
})

onMounted(() => {
  const { isOnAdminPage } = useAdminPage()
  const { mapperEventData } = useMapper()
  const { edgePositions } = usePieces()

  if (!IntoPiecesCollectionRef.value) return
  interact(IntoPiecesCollectionRef.value).draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        if (!isOnAdminPage.value) return
        const scale = mapperEventData.value.scale

        const xRaw = IntoPiecesCollectionPosition.value.x + event.dx / scale
        const yRaw = IntoPiecesCollectionPosition.value.y + event.dy / scale
        const x = xRaw > -2000 ? xRaw : -2000
        const y = yRaw > -2000 ? yRaw : -2000
        IntoPiecesCollectionPosition.value.x = x
        IntoPiecesCollectionPosition.value.y = y
        edgePositions.value.x = Math.max(edgePositions.value.x, x + 2300)
        edgePositions.value.y = Math.max(edgePositions.value.y, y + 2000)
        // }
      }
    }
  })
})
</script>

<style lang="stylus" scoped>
.collection-container
  position absolute
</style>

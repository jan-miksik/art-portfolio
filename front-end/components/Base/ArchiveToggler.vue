<template>
	<div
		class="container"
		ref="archiveTogglerRef"
    :style="dragAndDropStyle"
		@mousedown="mouseDownHandler"
		@mousemove="mouseMoveHandler"
		@mouseup="mouseUpHandler"
		@click="toggleArchiveHandler"
		>
    <div
      class="archive-toggler-text"
      role="button"
      :aria-label="isArchiveVisible ? 'Hide archived pieces' : 'Show archived pieces'"
      :aria-pressed="isArchiveVisible"
      tabindex="0"
      @keydown.enter="toggleArchiveHandler"
      @keydown.space.prevent="toggleArchiveHandler"
    >archive 
      
    <img v-if="isArchiveVisible" src="/eye-open.svg" class="archive-toggler-text__eye"/>
    <img v-else src="/eye-closed.svg" class="archive-toggler-text__eye"/>
    
    </div>
	</div>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import useArchive from '~/J/useArchive'

const { toggleArchive, isArchiveVisible } = useArchive()

const archiveTogglerRef = ref<HTMLElement>()
const styleRef = ref({left: -12, bottom: 100, top: undefined})
const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()

onMounted(() => {
	if (!archiveTogglerRef.value) return
	interact(archiveTogglerRef.value).draggable({
		inertia: true,
		autoScroll: true,
		listeners: {
			move(event) {
        if (styleRef.value.top === undefined) {
          styleRef.value.top = event.pageY
        }
				styleRef.value.top += event.dy
				styleRef.value.left += event.dx
			}
		}
	})
})

const dragAndDropStyle = computed(() => {
  const style = {
    left: `${styleRef.value.left}px`,
    cursor: 'pointer',
  }

  if (styleRef.value.top === undefined) {
    return {
      ...style,
      bottom: `${styleRef.value.bottom}px`,
    }
  }

	return {
    ...style,
		top: `${styleRef.value.top}px`,
	}
})

const toggleArchiveHandler = () => {
	if (isDragging.value) return
	toggleArchive()
}
</script>

<style scoped lang="stylus">
.container
  position absolute
  width 76px
  cursor pointer
  z-index 1000

.archive-toggler-text
  position absolute
  rotate 90deg
  font-size 15px
  transition color 0.3s ease
  cursor pointer
  outline: none

  &:hover
    color #5f5f5f

  .archive-toggler-text__eye
    width 15px
    height 15px
    margin-bottom -2px
    filter none
</style>

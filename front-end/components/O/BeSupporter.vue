<template>
	<div
		class="container"
		ref="archiveTogglerRefRef"
    :style="dragAndDropStyle"
		@mousedown="mouseDownHandler"
		@mousemove="mouseMoveHandler"
		@mouseup="mouseUpHandler"
		@click="handleOpenModal"
		>
    <div class="archive-toggler-text">be supporter 
          
    </div>
	</div>

  <Teleport to="body">
  <div v-if="isModalOpen" class="about__modal-backdrop" @click="handleCloseModal" />
    <div v-if="isModalOpen" class="about__modal">
      <img
        src="/close.svg"
        width="30"
        height="30"
        @click="handleCloseModal"
        class="about__close-modal"
      />

      <h1>Be supporter</h1>

      <p>If you'd like to support me, feel free to send a donation to my wallet (on Ethereum, Base, Polygon, Optimism, Arbitrum) Also happy to chat with you.<br> <br>
      <b>0x762191Fc2fD46A51C39969EC90Af355241B476E8</b></p>

    </div>

</Teleport>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'
// import useArchive from '~/J/useArchive'

// const { toggleArchive, isArchiveVisible } = useArchive()

const archiveTogglerRefRef = ref<HTMLElement>()
const styleRef = ref({right: -65, bottom: 120, top: undefined})
const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()

onMounted(() => {
	if (!archiveTogglerRefRef.value) return
	interact(archiveTogglerRefRef.value).draggable({
		inertia: true,
		autoScroll: true,
		listeners: {
			move(event) {
        if (styleRef.value.top === undefined) {
          styleRef.value.top = event.pageY
        }
				styleRef.value.top += event.dy
				styleRef.value.right -= event.dx
			}
		}
	})
})

const dragAndDropStyle = computed(() => {
  const style = {
    right: `${styleRef.value.right}px`,
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

const isModalOpen = ref(false)

const handleOpenModal = () => {
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}


</script>

<style scoped lang="stylus">
.container
  position absolute
  width 126px
  cursor pointer
  z-index 1000

.archive-toggler-text
  position absolute
  rotate -90deg
  font-size 15px
  transition color 0.3s ease
  cursor pointer

  &:hover
    color #5f5f5f

.about__modal
  position fixed
  z-index 100000
  top 50%
  left 50%
  transform translate(-50%, -50%)
  background-color: white
  padding 2rem 2rem 5rem 2rem
  text-align left
  overflow: auto;
  max-width 800px;
  width 90%
  max-height 80vh
  user-select: text;

  @media (max-width: 768px)
    padding 1rem 1rem 5rem 1rem
    width 95%


h1
  margin-top 0

h3
  font-size: 1.5rem;
  margin: 2rem 0 0 0;

p
  margin-top 0.5rem
  word-wrap break-word

.about__modal-backdrop
  position absolute
  z-index 1000
  top 0
  right 0
  left 0
  bottom 0
  background-color: rgba(0, 0, 0, 0.5)
  cursor url("/close.svg"), auto
  backdrop-filter blur(2px)

.about__close-modal
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  cursor url("/close.svg"), auto

.dark-mode .about__close-modal
  cursor url("/close-white.svg"), auto

.dark-mode .about__modal-backdrop
  cursor url("/close-white.svg"), auto

.dark-mode .about__close-modal
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)

</style>

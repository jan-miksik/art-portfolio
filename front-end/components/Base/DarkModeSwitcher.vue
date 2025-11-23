<template>
  <div
    id="dark-mode-switcher"
    class="container"
    ref="darkModeSwitcherRef"
    :style="dragAndDropStyle"
    @mousedown="mouseDownHandler"
    @mousemove="mouseMoveHandler"
    @mouseup="mouseUpHandler"
    >
    <div ref="modeRef" class="mode" @click="switchMode" />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'

const isDarkMode = ref(false)
const amountOfSwitching = ref(0)
const modeRef = ref<HTMLElement>()

const darkModeSwitcherRef = ref<HTMLElement>()
const styleRef = ref({left: 5, top: 7})
const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()

onMounted(() => {
  const modeInStorage = localStorage.getItem('darkMode')
  if (!darkModeSwitcherRef.value) return
  interact(darkModeSwitcherRef.value).draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          styleRef.value.top += event.dy
          styleRef.value.left += event.dx
        }
      }
    })

  const modeInBrowser =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  if (modeInStorage === 'false') return
  if (modeInStorage === 'true') {
    switchMode()
  } else if (modeInBrowser) {
    switchMode()
  }
})

const dragAndDropStyle = computed(() => {
  return {
    top: `${styleRef.value.top}px`,
    left: `${styleRef.value.left}px`,
  }
})

const switchMode = () => {
  if (isDragging.value) return
  isDarkMode.value = !isDarkMode.value
  document.documentElement.classList.toggle('dark-mode')
  amountOfSwitching.value++

  if (amountOfSwitching.value % 3 === 0) {
    document.documentElement.style.setProperty('--image-filter-invert', '0')
  } else {
    document.documentElement.style.setProperty('--image-filter-invert', '1')
  }

  if (amountOfSwitching.value % 5 === 0) {
    document.body.classList.toggle('rotate-all')
    setTimeout(() => {
      document.body.classList.toggle('rotate-all')
    }, 3000)
  }

  localStorage.setItem('darkMode', `${isDarkMode.value ? 'true' : 'false'}`)

}
</script>

<style scoped lang="stylus">
.hide
  display none

.mode
  position absolute
  width 30px
  height 30px
  border-radius: 50%;
  background-size contain
  background-image url("/moon.png")
  cursor cell
  z-index 10
  opacity: 0.8
  transition opacity 0.2s ease-out

  &:hover
    opacity 1

#dark-mode-switcher
  position absolute
  width 76px
  left calc(100vw - 76px)
  top 2.5rem

  @media (min-width 600px)
    top 90vh


.dark-mode .mode
  filter invert(1)

</style>

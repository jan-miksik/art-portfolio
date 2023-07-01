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
// import useDraggable from '~/J/useDraggable'

const isDarkMode = ref(false)
const amountOfSwitching = ref(0)
const modeRef = ref<HTMLElement>()


const darkModeSwitcherRef = ref<HTMLElement>()
const styleRef = ref({left: 0, top: 0})
const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()
// const { dragAndDropStyle} = useDraggable(darkModeSwitcherRef, styleRef)
// useDraggable(darkModeSwitcherRef, styleRef)

onMounted(() => {
  const modeInStorage = localStorage.getItem('darkMode')
  // addDragAndDrop(darkModeSwitcherRef, styleRef)
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
  modeRef.value?.classList.toggle('scaling')
  amountOfSwitching.value++

  if (amountOfSwitching.value % 3 === 0 || amountOfSwitching.value % 4 === 0) {
    // alert('Seems, that you like switching')
    document.documentElement.style.setProperty('--image-filter-invert', '0')
  }

  if (amountOfSwitching.value % 5 === 0) {
    document.body.classList.toggle('rotate-all')
    setTimeout(() => {
      document.body.classList.toggle('rotate-all')
    }, 3000)
  }

  if (amountOfSwitching.value % 5 === 0) {
    document.documentElement.style.setProperty('--image-filter-invert', '1')
    // alert('Back to normal')
    // amountOfSwitching.value = 0
  }

  if (amountOfSwitching.value === 20) {
    // alert('Seems, you like switching')
  }

  // if (amountOfSwitching.value === 32) {
  //   alert('I would like to know if you have switched it more times than is your age in years')
  // }

  // if (amountOfSwitching.value === 78) {
  //   alert('78 switches')
  // }

  localStorage.setItem('darkMode', `${isDarkMode.value ? 'true' : 'false'}`)

  setTimeout(function () {
    modeRef.value?.classList.toggle('scaling')
  }, 520)
}
</script>

<style scoped lang="stylus">
.hide
  display none

.mode
  position absolute
  width 36px
  height 36px
  border-radius 50%
  background rgb(0 0 0 / 0%)
  cursor cell
  text-align center
  display flex
  align-items center
  justify-content center
  z-index 10
  opacity 0.7
  transition opacity 0.2s ease-out

  &:hover
    opacity 0.9

  &::before
    content ""
    position absolute
    width 24px
    height 24px
    border-radius 50%
    background-image linear-gradient(to right, white 50%, black 50.01%)
    border 2px solid rgb(0 0 0)
    transition transform 0.5s ease-out

  &::after
    content ""
    position absolute
    top 12px
    left 12px
    width 12px
    height 12px
    border-radius 50%
    background white
    mix-blend-mode difference

#dark-mode-switcher
  position absolute
  width 76px
  left calc(100vw - 76px)
  top 2.5rem
  font-size 14px
  font-weight 500
  color white
  line-height 18px

  @media (min-width 600px)
    top 90vh


.dark-mode .mode
  // background rgb(255 255 255 / 0%)


.dark-mode .mode::before
  border 2px solid black
  transform rotate(180deg)


@keyframes scale-inner
  50%
    transform scale(1.8)


.scaling::after
  animation scale-inner 0.5s ease forwards
</style>

<!-- This component is based on codepen by Andreas Storm

Copyright (c) 2022 by Andreas Storm (https://codepen.io/avstorm/pen/XWrNNOE)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. -->

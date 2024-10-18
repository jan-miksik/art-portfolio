<template>
  <div
    ref="contactRef"
    :style="handleStyle"
    class="homepage__contact"
    draggable="true"
    @mousedown="mouseDownHandler"
    @mousemove="mouseMoveHandler"
    @mouseup="mouseUpHandler"
  >
    <a class="homepage__soc-link homepage__soc-link-img" :href="isDragging ? undefined : 'mailto: to@janmiksik.ooo'">
      <OImage
        :image-file="emailIcon"
        class="homepage__contact-img"
        width="27"
        alt="email contact"
      />
    </a>
  </div>

  <div
    ref="contactIgRef"
    :style="handleIgStyle"
    class="homepage__contact"
    draggable="true"
    @mousedown="mouseDownHandler"
    @mousemove="mouseMoveHandler"
    @mouseup="mouseUpHandler"
  >
    <a
      class="homepage__soc-link homepage__soc-link-img"
      :href="isDragging ? undefined : 'https://www.instagram.com/miksik.jan/'"
      target="_blank"
      >
      <OImage
        :image-file="instagramIcon"
        class="homepage__contact-img"
        width="27"
        alt="instagram"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import ImageFile from '~/models/ImageFile'
const { mouseDownHandler, mouseMoveHandler, mouseUpHandler, isDragging } = useMouseActionDetector()

const styleEmail = ref({left: window.innerWidth - 140, top: 5})
const styleIg = ref({left: window.innerWidth - 90, top: 5})
const contactRef = ref<HTMLElement>()
const contactIgRef = ref<HTMLElement>()

onMounted(() => {
  if (!contactRef.value) return

  interact(contactRef.value).draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        styleEmail.value.top += event.dy
        styleEmail.value.left += event.dx
      }
    }
  })

  if (!contactIgRef.value) return

  interact(contactIgRef.value).draggable({
    inertia: true,
    autoScroll: true,
    listeners: {
      move(event) {
        styleIg.value.top += event.dy
        styleIg.value.left += event.dx
      }
    }
  })
})

const linkToEmail = computed(() => {
  if (isDragging.value) return
  return 'mailto: to@janmiksik.ooo'
})

const handleStyle = computed(() => {
  return {
    top: `${styleEmail.value.top}px`,
    left: `${styleEmail.value.left}px`,
  }
})

const handleIgStyle = computed(() => {
  return {
    top: `${styleIg.value.top}px`,
    left: `${styleIg.value.left}px`,
  }
})

const emailIcon = ref(
  new ImageFile({
    url: '/email.svg',
    id: 'email-icon',
    lastUpdated: new Date('1992').getTime()
  })
)

const instagramIcon = ref(
  new ImageFile({
    url: '/instagram.svg',
    id: 'instagram-icon',
    lastUpdated: new Date('1995').getTime()
  })
)

</script>

<style scoped lang="stylus">
.homepage__contact
  position absolute
  padding 0.2rem
  cursor cell
  opacity 0.65
  width 50px
  height 50px
  transition opacity 0.3s
  z-index 10

  &:hover
    opacity 1 !important

.homepage__contact-img
  width 30px
  height 30px
  filter drop-shadow(0 1px 1px white)

.homepage__contact-text
  font-size 0.9rem
  font-weight bold
  color black
  opacity 0
  position absolute
  rotate -90deg
  top 18px
  left -39px

.homepage__contact:hover .homepage__contact-text
  opacity 1

.homepage__contact-modal-backdrop
  position fixed
  inset 0
  height 140vh
  z-index 1
  background-color rgb(0 0 0 / 50%)
  background-color #000000e3
  backdrop-filter blur(1px) grayscale(1)
  transition all 0.5s

.dark-mode .homepage__contact-modal-backdrop
  background-color #ebebebe3

.homepage__soc-link
  cursor: pointer;

  &:hover
    transition all 0.3s !important

.homepage__soc-link-img
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)

.dark-mode .homepage__soc-link-img
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)

.homepage__soc-link-img:hover
  z-index 100

</style>

<template>
  <div
    ref="contactRef"
    class="homepage__contact"
    draggable="true"
    @click="showContactModal"
  >
    <span ref="contactText" class="homepage__contact-text">CONTACT</span>
  </div>
  <Transition name="fade">
    <div
      v-if="isContactModalVisible"
      class="homepage__contact-modal-backdrop"
      @click="isContactModalVisible = false"
    />
  </Transition>

  <Transition name="fade">
    <div v-if="isContactModalVisible" class="homepage__contact-modal">
      <div class="homepage__contact-modal-content">
        <!-- <h1>Jan Mikšík</h1> -->
        <!-- <p>
           ... email is the most certain  ..
        </p> -->
        <div class="homepage__soc-links">
          <a class="homepage__soc-link" href="mailto: jan.miksik.g@gmail.com">
            <img
              loading="lazy"
              class="homepage__soc-link-img"
              src="/email.svg"
              width="35"
              alt="email"
              :style="randomizePosition()"
          /></a>
          <a
            class="homepage__soc-link"
            href="https://www.instagram.com/miksik.jan/"
            target="_blank"
            ><img
              loading="lazy"
              class="homepage__soc-link-img"
              src="/instagram.svg"
              width="27"
              alt="instagram"
              :style="randomizePosition()"
          /></a>

          <a
            class="homepage__soc-link"
            href="https://www.facebook.com/jan.miksik.1/"
            target="_blank"
            ><img
              loading="lazy"
              class="homepage__soc-link-img"
              src="/fb.svg"
              width="26"
              alt="facebook"
              :style="randomizePosition()"
          /></a>
          <a
            class="homepage__soc-link"
            href="https://twitter.com/MiksikJan"
            target="_blank"
            ><img
              loading="lazy"
              class="homepage__soc-link-img"
              src="/twitter.svg"
              width="30"
              alt="twitter"
              :style="randomizePosition()"
          /></a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import useDragAndDrop from '~/J/useDragAndDrop'
const contactRef = ref<HTMLElement>()
const { dragAndDrop, isDragging } = useDragAndDrop()
onMounted(() => {
  if (contactRef.value) {
    dragAndDrop(contactRef.value)
  }
})

const isContactModalVisible = ref(false)
const contactText = ref()

const showContactModal = () => {
  if (isDragging.value) return
  isContactModalVisible.value = true
}

const generateRandomNumberPlusMinus = (max: number) => {
  return Math.floor((Math.random() * max + 1) * (Math.random() - 0.5) * 2)
}

const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const randomizePosition = () => {
  return {
    transform: `scale(${
      randomRange(9, 12) / 10
    }) translateY(${generateRandomNumberPlusMinus(
      20
    )}px) translateX(${generateRandomNumberPlusMinus(30)}px)`
  }
}
</script>

<style scoped lang="stylus">
@keyframes animation-rotate-contact
  from
    transform rotate(-5deg)

  to
    transform rotate(355deg)

.homepage__contact
  position absolute
  box-shadow inset 1px 0 4px -2px #000
  bottom 2rem
  left 1rem
  padding 0.3rem
  color rgb(0 183 255)
  color #2395ff
  cursor cell
  // transform rotate(-5deg)
  border-radius 103px
  width 50px
  height 50px
  display flex
  align-items center
  justify-content center
  border dotted 5px

.homepage__contact-text
  animation animation-rotate-contact 10s linear infinite
  animation-play-state paused
  font-size 0.7rem
  background transparent
  // transform rotate(-5deg)

.homepage__contact:hover .homepage__contact-text
  animation-play-state running

.homepage__contact:hover
  // box-shadow inset 1px 0 4px 30px #000
  // transition all 0.3s

.homepage__contact-modal-backdrop
  position fixed
  left 0
  top 0
  bottom 0
  right 0
  height 140vh
  z-index 1
  background-color rgb(0 0 0 / 50%)
  background-color #000000e3
  backdrop-filter blur(1px) grayscale(1)
  transition all 0.5s


.dark-mode .homepage__contact-modal-backdrop
  // background-color rgb(255 255 255 / 50%)
  background-color #ebebebe3


.homepage__contact-modal
  transition all 0.2s
  background-color #eee
  padding 1rem
  text-align left
  color #515151
  border-radius 350px
  z-index 10
  position fixed
  width 350px
  height 350px
  top 50%
  left 50%
  transform translate(-50%, -50%)

.dark-mode .homepage__contact-modal
  background-color #272727


@keyframes animation-rotate
  from
    transform rotate(0deg)

  to
    transform rotate(-360deg)


.homepage__contact-modal-content
  text-align center


.homepage__soc-link
  margin 2rem
  cursor crosshair

  &:hover
    transition all 0.3s !important
    box-shadow inset 0 -20px 0 0 rgb(41 187 97 / 41%)

.homepage__soc-link-img
  padding 0.5rem
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)
  border 1px solid transparent
  border-radius 2px

.dark-mode .homepage__soc-link-img
  filter brightness(0) saturate(100%) invert(1) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)

.homepage__soc-link-img:hover
  // box-shadow inset 0 0 2px 1px rgb(0 0 0 / 31%)
  // transform scale(1.05) !important
  // transition all 0.2s !important
  // filter drop-shadow(-200px -500px 1px black)
  z-index 100


.homepage__soc-links
  margin-top 3.5rem
  display flex
  justify-content space-around
  align-items center
  flex-flow row wrap

// / Animation /
.fade-enter-active
.fade-leave-active
  transition all 0.5s


.fade-enter-from
  opacity 0


.fade-leave-to
  opacity 0
</style>

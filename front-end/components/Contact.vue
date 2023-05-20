<template>
  <div
  ref="contactRef"
  class="homepage__contact"
  draggable="true"
  >
    <a class="homepage__soc-link" href="mailto: to@janmiksik.ooo">
  <!-- @click="showContactModal" -->
    <Image
      :image-file="emailIcon"
      class="homepage__contact-img" 
      width="27"
      alt="contact"
    />
    <!-- <span class="homepage__contact-text">CONTACT</span> -->
  </a>
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
          <a class="homepage__soc-link" href="mailto: to@janmiksik.ooo">
            <Image
              :image-file="emailIcon"
              class="homepage__soc-link-img" 
              width="35"
              alt="email"
              :style="randomizePosition()"
            />
          </a>
          <!-- <a
            class="homepage__soc-link"
            href="https://www.instagram.com/miksik.jan/"
            target="_blank"
            >
            <Image
              :image-file="instagramIcon"
              class="homepage__soc-link-img" 
              width="27"
              alt="instagram"
              :style="randomizePosition()"
            />
          </a> -->

          <!-- <a
            class="homepage__soc-link"
            href="https://www.facebook.com/jan.miksik.1/"
            target="_blank"
            >
            <Image
              :image-file="facebookIcon"
              class="homepage__soc-link-img" 
              width="26"
              alt="facebook"
              :style="randomizePosition()"
            />
           </a> -->
          <!-- <a
            class="homepage__soc-link"
            href="https://twitter.com/MiksikJan"
            target="_blank"
            >
            <Image
              :image-file="twitterIcon"
              class="homepage__soc-link-img" 
              width="30"
              alt="twitter"
              :style="randomizePosition()"
            />
            </a> -->
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import useDragAndDrop from '~/J/useDragAndDrop'
import ImageFile from '~/models/ImageFile'

const contactRef = ref<HTMLElement>()
const { dragAndDrop, isDragging } = useDragAndDrop()
onMounted(() => {
  if (contactRef.value) {
    dragAndDrop(contactRef.value)
  }
})

const emailIcon = ref(
  new ImageFile({
    url: '/email.svg',
    id: 'email-icon',
    lastUpdated: new Date('1991').getTime()
  })
)

const instagramIcon = ref(
  new ImageFile({
    url: '/instagram.svg',
    id: 'instagram-icon',
    lastUpdated: new Date('1995').getTime()
  })
)

const facebookIcon = ref(
  new ImageFile({
    url: '/fb.svg',
    id: 'facebook-icon',
    lastUpdated: new Date('1993').getTime()
  })
)

const twitterIcon = ref(
  new ImageFile({
    url: '/twitter.svg',
    id: 'twitter-icon',
    lastUpdated: new Date('1992').getTime()
  })
)

const contactIcon = ref(
  new ImageFile({
    url: '/contact.svg',
    id: 'contact-icon',
    lastUpdated: new Date('1992').getTime()
  })
)

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
  bottom 2rem
  left 1rem
  padding 0.2rem
  cursor cell
  opacity 0.75
  width 50px
  height 50px
  transition opacity 0.3s
  // display flex
  // flex-direction column
  // align-items center
  // gap 0.3rem

  &:hover
    opacity 1 !important

.homepage__contact-img
  width 37px
  height 37px
  filter drop-shadow(0 2px 2px white)

.homepage__contact-text
  font-size 0.9rem
  // position absolute
  font-weight bold
  color black
  opacity 0
  // font-family BungeeHairline, Helvetica, Arial, sans-serif
  position absolute
  rotate -90deg
  top 18px
  left -39px
  // transition all 0.3s
  // font-size 1rem

.homepage__contact:hover .homepage__contact-text
  opacity 1

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
  background-color #ebebebe3


.homepage__contact-modal
  transition opacity 0.2s
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
.fade-leave-to
  opacity 0
</style>

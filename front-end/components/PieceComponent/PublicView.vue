<template>
  <Teleport to="body">
    <Transition name="images">
      <div
        v-if="selectedPiece"
        :class="[
          {
            'piece-component-public-view__selected-piece-backdrop':
              selectedPiece
          }
        ]"
        @click="emit('close-modal')"
        @touchstart="emit('close-modal')"
      >
        <component
          v-if="swiperLoaded && Swiper"
          :is="Swiper"
          class="swiper"
          ref="swiperMainRef"
          direction='vertical'
          :spaceBetween="50"
          :initialSlide="activeIndexMain"
          :pagination="{
            clickable: true,
          }"
          :modules="[Navigation, Keyboard, Mousewheel]"
          @slideChange="handleOnSlideChangeMain"
          @swiper="handleSwiperInit"

        >
         <component
           v-if="swiperLoaded && SwiperSlide"
           :is="SwiperSlide"
         >
           <SwiperBase
            v-if="freeTopicPieces"
           :pieces="freeTopicPieces"
           :initial-piece="selectedPiece"
           :activeIndexMain="activeIndexMain"
           @close-modal="handleClosePieceDetail"
            @move-main-carousel="handleSlideChangeByStep"
           />
         </component>

          <component
           v-if="swiperLoaded && SwiperSlide"
           :is="SwiperSlide"
          >
            <SwiperBase
            v-if="puzzlePieces"
           :pieces="puzzlePieces"
           :initial-piece="selectedPiece"
            :activeIndexMain="activeIndexMain"
            @close-modal="handleClosePieceDetail"
            @move-main-carousel="handleSlideChangeByStep"
           />
          </component>

          <component
           v-if="swiperLoaded && SwiperSlide"
           :is="SwiperSlide"
          >
            <SwiperBase
            v-if="geometryPieces"
           :pieces="geometryPieces"
           :initial-piece="selectedPiece"
            :activeIndexMain="activeIndexMain"
            @close-modal="handleClosePieceDetail"
            @move-main-carousel="handleSlideChangeByStep"
           /></component>

          <component
           v-if="swiperLoaded && SwiperSlide"
           :is="SwiperSlide"
          >
            <SwiperBase
              v-if="nodeAvatarPieces"
              :pieces="nodeAvatarPieces"
              :activeIndexMain="activeIndexMain"
              :initial-piece="selectedPiece"
              @close-modal="handleClosePieceDetail"
              @move-main-carousel="handleSlideChangeByStep"
            />
          </component>

          <component
           v-if="swiperLoaded && SwiperSlide"
           :is="SwiperSlide"
          >
            <SwiperBase
              v-if="digitalPieces"
              :pieces="digitalPieces"
              :activeIndexMain="activeIndexMain"
              :initial-piece="selectedPiece"
              @close-modal="handleClosePieceDetail"
              @move-main-carousel="handleSlideChangeByStep"
            />
          </component>

            <div @click.stop @touchstart.stop class="piece-component-public-view__categories">
              <span @click.stop="handleChangeSlideMain(0)" :class="['piece-component-public-view__category', {'piece-component-public-view__category--active': activeIndexMain === 0}]">Free topic</span>
              <span @click.stop="handleChangeSlideMain(1)" :class="['piece-component-public-view__category piece-component-public-view__category--puzzle', {'piece-component-public-view__category--active': activeIndexMain === 1}]">Puzzle</span>
              <span @click.stop="handleChangeSlideMain(2)" :class="['piece-component-public-view__category', {'piece-component-public-view__category--active': activeIndexMain === 2}]">Geometry</span>
              <span @click.stop="handleChangeSlideMain(3)" :class="['piece-component-public-view__category piece-component-public-view__category--node-avatars', {'piece-component-public-view__category--active': activeIndexMain === 3}]">Node Avatars</span>
              <span @click.stop="handleChangeSlideMain(4)" :class="['piece-component-public-view__category piece-component-public-view__category--digital', {'piece-component-public-view__category--active': activeIndexMain === 4}]">digital</span>
            </div>
        </component>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import Piece from '~/models/Piece'
import usePieces from '~/J/usePieces'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// Import types statically (types don't add to bundle size)
import type { Swiper as SwiperClass } from 'swiper'
import type { SwiperModule } from 'swiper/types'
import {Topics} from "~/components/piecesData";
import useArchive from '~/J/useArchive'

const { isArchiveVisible } = useArchive()
const { pieces } = usePieces()

const props = defineProps<{
  initialPiece: Piece
}>()
const { initialPiece } = toRefs(props)

// Dynamically import Swiper components (only load when modal is shown)
// Types are imported statically above, but components are loaded dynamically
const Swiper = shallowRef<Component | null>(null)
const SwiperSlide = shallowRef<Component | null>(null)
const Navigation = shallowRef<SwiperModule | null>(null)
const Keyboard = shallowRef<SwiperModule | null>(null)
const Mousewheel = shallowRef<SwiperModule | null>(null)

const swiperMainRef = ref<{ $swiper: SwiperClass } | null>(null)
const mainSwiperInstance = ref<SwiperClass | null>(null)
const activeIndexMain = ref(0)
const selectedPiece = ref<Piece | undefined>(initialPiece.value)
const swiperLoaded = ref(false)

// Load Swiper when component is mounted (modal is shown)
onMounted(async () => {
  if (!swiperLoaded.value) {
    const swiperModule = await import('swiper/vue')
    const swiperModules = await import('swiper/modules')
    
    Swiper.value = swiperModule.Swiper as Component
    SwiperSlide.value = swiperModule.SwiperSlide as Component
    Navigation.value = swiperModules.Navigation as SwiperModule
    Keyboard.value = swiperModules.Keyboard as SwiperModule
    Mousewheel.value = swiperModules.Mousewheel as SwiperModule
    swiperLoaded.value = true
  }
})

const piecesFilered = computed(() => {
  if (isArchiveVisible.value) {
    return pieces.value
  }
  return pieces.value?.filter(p => !p.isArchived)
})

const freeTopicPieces = computed(() => (piecesFilered.value || []).filter(p => p.topic === Topics.FREE_TOPIC || p.topic === Topics.SANS_TOPIC))
const puzzlePieces = computed(() => (piecesFilered.value || []).filter(p => p.topic === Topics.PUZZLE))
const geometryPieces = computed(() => (piecesFilered.value || []).filter(p => p.topic === Topics.GEOMETRY))
const nodeAvatarPieces = computed(() => (piecesFilered.value || []).filter(p => p.topic === Topics.NODE_AVATARS))
const digitalPieces = computed(() => (piecesFilered.value || []).filter(p => p.topic === Topics.DIGITAL))


const emit = defineEmits<{
  (e: 'close-modal'): void
}>()

const handleClosePieceDetail = () => {
  emit('close-modal')
}

watch(initialPiece, () => {
  if (initialPiece.value?.topic === Topics.FREE_TOPIC || initialPiece.value?.topic === Topics.SANS_TOPIC) {
    activeIndexMain.value = 0
  }
  if (initialPiece.value?.topic === Topics.PUZZLE) {
    activeIndexMain.value = 1
  }
  if (initialPiece.value?.topic === Topics.GEOMETRY) {
    activeIndexMain.value = 2
  }
  if (initialPiece.value?.topic === Topics.NODE_AVATARS) {
    activeIndexMain.value = 3
  }
  if (initialPiece.value?.topic === Topics.DIGITAL) {
    activeIndexMain.value = 4
  }
  selectedPiece.value = initialPiece.value
},{ immediate: true })


const handleSwiperInit = (swiper: SwiperClass) => {
  mainSwiperInstance.value = swiper
}

const handleOnSlideChangeMain = (swiper: SwiperClass) => {
  activeIndexMain.value = swiper.activeIndex
}

const handleChangeSlideMain = (slideIndex: number) => {
  activeIndexMain.value = slideIndex
  if (mainSwiperInstance.value) {
    mainSwiperInstance.value.slideTo(slideIndex)
  }
}

const handleSlideChangeByStep = (moveDirection: number) => {
  if (mainSwiperInstance.value) {
    mainSwiperInstance.value.slideTo(activeIndexMain.value + moveDirection)
  }
}

</script>

<style lang="stylus" scoped>

.piece-component-public-view__selected-piece-backdrop
  position fixed
  display flex
  align-items center
  justify-content flex-start
  flex-direction column
  gap 1rem
  inset 0
  height 100vh
  z-index 1000
  background-color #d2d3e0f2
  backdrop-filter blur(2px)
  cursor url("/close.svg"), auto

.dark-mode .piece-component-public-view__selected-piece-backdrop
  background-color #efebebfc
  cursor url("/close-white.svg"), auto

.swiper
  justify-content center
  align-items center
  height 95dvh
  width 100vw
  font-family Roboto, sans-serif

  @media (min-width 700px)
    height 100vh


.swiper-wrapper
  width 100vw

.slide
  background transparent
  height 100%
  display flex
  align-items center
  justify-content space-between
  flex-direction column

.piece-component-public-view__categories
  position absolute
  top 3rem
  left 0
  z-index 10000
  font-size 0.7rem
  display: flex;
  gap: 1rem;
  flex-direction column
  width 1.5rem
  cursor default

$translate-category-x = -47px

.piece-component-public-view__category
  rotate 90deg
  height: 4rem;
  width: 5rem;
  white-space: nowrap
  translate: $translate-category-x
  opacity 0.3
  cursor: pointer
  padding-top: 1rem;

.piece-component-public-view__category--active
  opacity 1

.piece-component-public-view__category--puzzle
  translate $translate-category-x 2px

.piece-component-public-view__category--node-avatars
  translate $translate-category-x 15px

.piece-component-public-view__category--digital
  translate $translate-category-x 25px

.dark-mode .piece-component-public-view__pagination-info
  color #d2d3e0f2

// // / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0
</style>

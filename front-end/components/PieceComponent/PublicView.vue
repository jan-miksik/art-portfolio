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
        @click="handleOnBackdropClick"
        @touchstart="handleOnBackdropClick"
      >
        <swiper
          class="swiper"
          ref="swiperRef"
          :modules="[Navigation, Keyboard, Mousewheel]"
          :keyboard="{ enabled: true }"
          @slideChange="handleOnSlideChange"
          :initialSlide="initialSlide"
        >
          <img
            src="/close.svg"
            width="30"
            height="30"
            class="piece-component-public-view__selected-piece-back"
          />
          <swiper-slide class="slide" v-for="(piece, index) in pieces">
            <div
              class="piece-component-public-view__selected-piece-image-wrapper"
              @click.stop
              @touchstart.stop
            >
              <div
                class="piece-component-public-view__selected-piece-image-close-zone"
                @click="handleOnBackdropClick"
                @touchstart="handleOnBackdropClick"
              />
              <div
                class="piece-component-public-view__selected-piece-image-inner-wrapper"
                @click.stop
                @touchstart.stop
              >
                <!-- <PinchScrollZoom
                  v-if="windowObject?.innerWidth"
                  :height="windowObject.innerHeight * 0.7"
                  :width="windowObject?.innerWidth"
                  within
                  class="piece-component-public-view__pinch-scroll-zoom"
                  :min-scale="0.01"
                  :max-scale="100"
                > -->
                <OImage
                  :image-file="piece.image"
                  :is-full-size="true"
                  :piece="piece"
                  externalCssClass="piece-component-public-view__selected-piece-image"
                  :class="[
                    'piece-component-public-view__selected-piece-image',
                    {
                      'piece-component-public-view__selected-piece-image--node-avatar':
                        piece.topic === Topics.NODE_AVATARS
                    }
                  ]"
                  @click.stop
                  @touchstart.stop
                />
                <!-- </PinchScrollZoom> -->
              </div>
            </div>
            <div
              class="piece-component-public-view__selected-piece-image-info-spacer"
              @click.stop
              @touchstart.stop
            />
          </swiper-slide>
          <div class="piece-component-public-view__selected-piece-info-wrapper">
            <div
              class="piece-component-public-view__selected-piece-info"
              @click.stop
              @touchstart.stop
            >
              <strong
                @blur="(e) => handleOnBlurEditPieceInfo(e, 'name')"
                @click.stop
                @touchstart.stop
              >
                {{ selectedPiece.name }}
              </strong>
              <br />
              <span>
                {{ selectedPiece.created.getFullYear() }} </span
              >,

              <span>
                {{
                  selectedPiece.techniqueDescription === 'unspecified'
                    ? ''
                    : selectedPiece.techniqueDescription
                }} </span
              >,

              <span v-if="isSizeInCm">
                <span @click.stop @touchstart.stop>
                  {{ selectedPiece.sizeInCm.x }} </span
                >cm x
                <span @click.stop @touchstart.stop>
                  {{ selectedPiece.sizeInCm.y }} </span
                >cm
              </span>

              <span v-if="isSizeInPx">
                <span @click.stop @touchstart.stop>
                  {{ selectedPiece.sizeInPx.x }} </span
                >px x
                <span @click.stop @touchstart.stop>
                  {{ selectedPiece.sizeInPx.y }} </span
                >px
              </span>
            </div>
          </div>
        </swiper>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import usePieces from '~/J/usePieces'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper as SwiperTypes, Keyboard, Mousewheel } from 'swiper'
import { Topics } from '~/components/piecesData'

const { pieces } = usePieces()

const props = defineProps<{
  initialPiece: Piece
  initialSlide: number
}>()
const { initialPiece } = toRefs(props)

const activeIndex = ref(0)
const swiperRef = ref<SwiperTypes | null>(null)
const selectedPiece = ref<Piece | undefined>(initialPiece.value)

watch(initialPiece, () => {
  selectedPiece.value = initialPiece.value
})

const isSizeInCm = computed(
  () => selectedPiece.value?.sizeInCm.x && selectedPiece.value?.sizeInCm.y
)
const isSizeInPx = computed(
  () => selectedPiece.value?.sizeInPx.x && selectedPiece.value?.sizeInPx.y
)

const handleOnSlideChange = (swiper: SwiperTypes) => {
  if (!pieces.value) return
  activeIndex.value = swiper.activeIndex
  selectedPiece.value = pieces.value[swiper.activeIndex]
}

const handleOnBackdropClick = () => {
  selectedPiece.value = undefined
}
</script>

<style lang="stylus" scoped>
.piece-component-public-view__selected-piece-image
  cursor default
  z-index 10000
  object-fit contain
  max-width 90%

  &--node-avatar
    max-height 300px

.piece-component-public-view__selected-piece-image-wrapper
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  width 100%
  cursor default


.piece-component-public-view__selected-piece-image-inner-wrapper
  width 100%
  display flex
  justify-content center
  max-height 75%
  cursor default
  z-index 10000

.piece-component-public-view__selected-piece-image-info-spacer
  height 4.75rem
  width 100%
  cursor default

.piece-component-public-view__selected-piece-info-wrapper
  display flex
  justify-content center
  position absolute
  width 100%
  bottom 0
  cursor default


.piece-component-public-view__selected-piece-info
  max-width 90%
  width max-content
  text-align center
  font-size 1rem
  align-self center
  cursor auto
  user-select text
  font-family GowunDodum, Helvetica, Arial, sans-serif
  font-weight normal
  z-index 10001
  text-shadow 0 0 1px #d2d3e0f2, 0 0 2px #d2d3e0f2

  @media (min-width 600px)
    align-self flex-end
    bottom 0.3rem


// .dark-mode .piece-component-public-view__selected-piece-info
// background-color rgb(17 17 17)


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

// // / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0

.swiper
  justify-content center
  align-items center
  height calc(100vh - 70px)
  width 100vw
  font-weight bold
  font-family Roboto, sans-serif


.swiper-wrapper
  width 100vw

.slide
  background transparent
  height 100%
  display flex
  align-items center
  justify-content space-between
  flex-direction column

.piece-component-public-view__selected-piece-image-close-zone
  position absolute
  top 0
  right 0
  width 100vw
  height 50vh
  z-index 10000
  cursor url("/close.svg"), auto

.dark-mode .piece-component-public-view__selected-piece-image-close-zone
  cursor url("/close-white.svg"), auto

.piece-component-public-view__selected-piece-back
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  opacity 0.2

.dark-mode .piece-component-public-view__selected-piece-back
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)
</style>

<style lang="stylus">
.piece-component-public-view__selected-piece-image
  border 1px solid transparent
  position relative
  object-fit contain
  max-width 100%
  max-height 100%
</style>

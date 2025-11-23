<template>
  <swiper
    class="swiper"
    ref="swiperRef"
    :modules="[Navigation, Keyboard, Mousewheel]"
    :keyboard="{ enabled: true }"
    @slideChange="handleOnSlideChange"
    :initialSlide="initialSlide"
    @swiper="(swiper) => swiperInstance = swiper"
  >

    <swiper-slide class="slide" v-for="(piece) in pieces" :key="piece.id">
      <div
        class="swiper-base__selected-piece-image-wrapper"
        @click.stop
        @touchstart.stop
      >
        <div
          class="swiper-base__selected-piece-image-inner-wrapper"
          @click.stop
          @touchstart.stop
        >
          <BaseImage
            :image-file="piece.image"
            :is-full-size="true"
            :piece="piece"
            externalCssClass="swiper-base__selected-piece-image"
            :class="[
              'swiper-base__selected-piece-image',
              {
                'swiper-base__selected-piece-image--node-avatar':
                  piece.topic === Topics.NODE_AVATARS
              }
            ]"
            @click.stop
            @touchstart.stop
          />
        </div>
      </div>
      <div
        class="swiper-base__selected-piece-image-info-spacer"
        @click.stop
        @touchstart.stop
      />
    </swiper-slide>
    <div class="swiper-base__selected-piece-info-wrapper">
      <div
        class="swiper-base__selected-piece-info"
        @click.stop
        @touchstart.stop
        v-if="selectedPiece"
      >
        <strong
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
          }} 
        </span>
        <span v-if="isSizeInCm">, </span>

        <span v-if="isSizeInCm">
          <span @click.stop @touchstart.stop>
            {{ selectedPiece.sizeInCm.x }} </span
          >cm x
          <span @click.stop @touchstart.stop>
            {{ selectedPiece.sizeInCm.y }} </span
          >cm
        </span>
      </div>
    </div>
    <div class="swiper-base__pagination-info">
      {{ swiperPagination }}
    </div>
    <div v-if="!hideArrowLeft" class="swiper-base__arrow-left" @click.stop="handleSlideChange(-1)" @touchstart.stop="handleSlideChange(-1)">
      <img src="/arrow-left.svg" alt="arrow-left" :class="['swiper-base__arrow-left-image', {'swiper-base__arrow-left--rotate-up':isLeftArrowPointingUp}]"/>
    </div>
    <div v-if="!hideArrowRight" class="swiper-base__arrow-right" @click.stop="handleSlideChange(+1)" @touchstart.stop="handleSlideChange(+1)">
      <img src="/arrow-right.svg" alt="arrow-right" :class="['swiper-base__arrow-right-image', {'swiper-base__arrow-right--rotate-down':isRightArrowPointingDown}]"/>
    </div>
    <div
      class="swiper-base__selected-piece-image-close-zone"
      @click="emit('close-modal')"
      @touchstart="emit('close-modal')"
    >
      <img
        src="/close.svg"
        width="30"
        height="30"
        alt="close"
        class="swiper-base__selected-piece-back"
      />
    </div>
  </swiper>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper as SwiperTypes } from 'swiper'
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules';
import { Topics } from '~/components/piecesData'

const props = defineProps<{
  initialPiece: Piece
  pieces: Piece[]
  activeIndexMain: number
}>()
const { initialPiece, pieces } = toRefs(props)

const activeIndex = ref(0)
const swiperInstance = ref()
const swiperRef = ref<SwiperTypes | null>(null)
const selectedPiece = ref<Piece | undefined>(initialPiece.value)

const emit = defineEmits<{
  (e: 'close-modal'): void;
  (e: 'move-main-carousel', moveDirection: number): void;
}>()

watch(initialPiece, () => {
  selectedPiece.value = initialPiece.value
})

const initialSlide = computed(() => {
  return pieces.value?.findIndex((p) => p?.id === initialPiece.value?.id) || 0
})

const isLastSlide = computed(() => activeIndex.value === (pieces.value?.length -1))
const isFirstSlide = computed(() => activeIndex.value === 0)

const isRightArrowPointingDown = computed(() => {
  if (props.activeIndexMain === 4) return false
  return isLastSlide.value
});

const isLeftArrowPointingUp = computed(() => {
  if (props.activeIndexMain === 0) return false
  return isFirstSlide.value
})

const hideArrowRight = computed(() => {
  return props.activeIndexMain === 4 && isLastSlide.value
})

const hideArrowLeft = computed(() => {
  return (props.activeIndexMain === 0) && isFirstSlide.value
})

const isSizeInCm = computed(
  () => selectedPiece.value?.sizeInCm.x && selectedPiece.value?.sizeInCm.y
)
const isSizeInPx = computed(
  () => selectedPiece.value?.sizeInPx.x && selectedPiece.value?.sizeInPx.y
)

const swiperPagination = computed(() => `${activeIndex.value + 1} / ${pieces.value?.length}`)

const handleSlideChange = (moveDirection: number) => {
  if (isLastSlide.value && moveDirection === +1) {
    emit('move-main-carousel', moveDirection)
  }

  if (isFirstSlide.value && moveDirection === -1) {
    emit('move-main-carousel', moveDirection)
  }

  if(swiperInstance.value) {
    swiperInstance.value.slideTo(activeIndex.value + moveDirection)
  }
}

const handleOnSlideChange = (swiper: SwiperTypes) => {
  if (!pieces.value) return
  activeIndex.value = swiper.activeIndex
  selectedPiece.value = pieces.value[swiper.activeIndex]
}

</script>

<style lang="stylus" scoped>
.swiper-base__selected-piece-image
  cursor default
  z-index 10000
  object-fit contain
  max-width 90%

  &--node-avatar
    max-height 300px

.swiper-base__selected-piece-image-wrapper
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  width 100%
  cursor default

.swiper-base__selected-piece-image-inner-wrapper
  width 100%
  display flex
  justify-content center
  max-height 75%
  cursor default
  z-index 10000

.swiper-base__selected-piece-image-info-spacer
  height 4.75rem
  width 100%
  cursor default

.swiper-base__selected-piece-info-wrapper
  display flex
  justify-content center
  position absolute
  width 100%
  bottom 0
  cursor default
  padding-bottom 2.5rem

.swiper-base__selected-piece-info
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

.swiper-base__selected-piece-backdrop
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

.dark-mode .swiper-base__selected-piece-backdrop
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

.swiper-base__selected-piece-image-close-zone
  position absolute
  top 0
  right 0
  width 30vw
  height 20vh
  z-index 10000
  cursor url("/close.svg"), auto

  &:hover
    .swiper-base__selected-piece-back
      opacity 1

.dark-mode .swiper-base__selected-piece-image-close-zone
  cursor url("/close-white.svg"), auto

.swiper-base__selected-piece-back
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  opacity 0.2

  &:hover
    opacity 1

.dark-mode .swiper-base__selected-piece-back
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)

.swiper-base__pagination-info
  position absolute
  top 1rem
  left 1rem
  z-index 10000
  font-size 0.7rem
  color #808085f2
  font-weight normal

.dark-mode .swiper-base__pagination-info
  color #d2d3e0f2

.swiper-base__arrow-right
.swiper-base__arrow-left
  display none
  position: absolute;
  top: 0;
  opacity: 0.5;
  z-index 10000
  cursor pointer
  transition all 0.3s

  &:hover
    opacity 1

  @media (min-width: 600px)
    display flex

.swiper-base__arrow-left
  padding: 50vh 5rem 50vh 1rem;
  left: 3rem;

.swiper-base__arrow-right
  padding: 50vh 1rem 50vh 5rem;
  right: 3rem;

.swiper-base__arrow-right-image
.swiper-base__arrow-left-image
  width 20px
  transition all 0.3s

.dark-mode .swiper-base__arrow-left img
.dark-mode .swiper-base__arrow-right img
  filter unset

.swiper-base__arrow-right--rotate-down
  rotate 90deg
  transition all 0.3s

.swiper-base__arrow-left--rotate-up
  rotate 90deg
  transition all 0.3s

</style>

<style lang="stylus">
.swiper-base__selected-piece-image
  border 1px solid transparent
  position relative
  object-fit contain
  max-width 100%
  max-height 100%
</style>

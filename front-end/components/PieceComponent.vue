<template>
  <!-- TODO resolve style typings -->
  <div
    class="piece"
    ref="pieceRef"
    :style="(handlePieceStyle(piece) as StyleValue)"
    @mousedown="handleOnMouseDown"
    @mousemove="mouseMoveHandler"
    @mouseleave="mouseLeaveHandler"
    @mouseup="mouseUpHandler"
    @touchmove="touchmoveHandler"
    @touchend="touchendHandler"
  >
    <OImage
      v-if="piece"
      :id="piece.id"
      :image-file="piece.image"
      :class="[
        'piece__image',
        {
          'piece__image--not-published': !piece.isPublished && isOnAdminPage
        }
      ]"
      :width="piece.sizeOnWeb.width"
      @click="selectImage(piece)"
    />
    <!-- x:{{ piece?.position.x }} y: {{ piece?.position.y }} -->
  </div>
  <Teleport to="body">
    <Transition name="images">
      <div
        v-if="selectedPiece"
        :class="[{ 'piece__selected-piece-backdrop': selectedPiece }]"
        @click="handleOnBackdropClick"
        @touchstart="handleOnBackdropClick"
      >
        <swiper
          class="swiper"
          ref="swiperRef"
          :modules="[Navigation, Keyboard, Mousewheel]"
          :keyboard="{ enabled: !isOnAdminPage }"
          @slideChange="onSlideChange"
          :initialSlide="initialSlide"
        >
          <!-- :mousewheel="true" -->
          <img
            src="/close.svg"
            width="30"
            height="30"
            class="piece__selected-piece-back"
          />
          <swiper-slide class="slide" v-for="(piece, index) in pieces">
            <!-- :width="windowObject.innerWidth" -->

            <!-- <div class="piece__selected-piece-image-wrapper" /> -->

            <div
              class="piece__selected-piece-image-wrapper"
              @click.stop
              @touchstart.stop
            >
              <div
                class="piece__selected-piece-image-close-zone"
                @click="handleOnBackdropClick"
                @touchstart="handleOnBackdropClick"
              />
              <div
                class="piece__selected-piece-image-inner-wrapper"
                @click.stop
                @touchstart.stop
              >
                <!-- <PinchScrollZoom
                  v-if="windowObject?.innerWidth"
                  :height="windowObject.innerHeight * 0.7"
                  :width="windowObject?.innerWidth"
                  within
                  class="piece__pinch-scroll-zoom"
                  :min-scale="0.01"
                  :max-scale="100"
                > -->
                <OImage
                  :image-file="piece.image"
                  :class="[
                    'piece__selected-piece-image',
                    {
                      'piece__selected-piece-image--node-avatar':
                        piece.topic === Topics.NODE_AVATARS
                    }
                  ]"
                  @click.stop
                  @touchstart.stop
                />
                <!-- </PinchScrollZoom> -->
              </div>

              <!-- <div
                  class="piece__selected-piece-image-prevent-close"
                  @click.stop
                  @touchstart.stop
                /> -->
            </div>
            <div
              class="piece__selected-piece-image-info-spacer"
              @click.stop
              @touchstart.stop
            />
          </swiper-slide>
          <div class="piece__selected-piece-info-wrapper">
            <div
              class="piece__selected-piece-info"
              @click.stop
              @touchstart.stop
            >
              <strong
                :contenteditable="isOnAdminPage"
                @blur="(e) => handleOnBlurEditPieceInfo(e, 'name')"
                @click.stop
                @touchstart.stop
              >
                {{ selectedPiece.name }}
              </strong>
              <br />
              <span v-if="!isOnAdminPage">
                {{ selectedPiece.created.getFullYear() }}
              </span>

              <VueDatePicker
                v-if="isOnAdminPage"
                v-model="selectedPiece.created"
                autoApply
                @update:modelValue="handleOnSelectDate"
              />,

              <select
                v-if="isOnAdminPage"
                v-model="selectedPiece.topic"
                @change="handleUpdatePieceTopic"
              >
                <option disabled value="">select...</option>
                <option v-for="topic in Topics">{{ topic }}</option>
              </select>

              <select
                v-if="isOnAdminPage"
                v-model="selectedPiece.techniqueDescription"
                @change="handleUpdatePieceTechniqueDescription"
              >
                <option disabled value="">select...</option>
                <option v-for="topic in TechniqueDescription">{{ topic }}</option>
              </select>

              <span
                v-if="!isOnAdminPage"
                :contenteditable="isOnAdminPage"
                @blur="
                  (e) => handleOnBlurEditPieceInfo(e, 'techniqueDescription')
                "
                @click.stop
                @touchstart.stop
              >
                {{
                  selectedPiece.techniqueDescription === 'unspecified'
                    ? ''
                    : selectedPiece.techniqueDescription
                }} </span
              >,
              <span
                :contenteditable="isOnAdminPage"
                @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInCm', 'x')"
                @click.stop
                @touchstart.stop
              >
                {{ selectedPiece.sizeInCm.x }} </span
              >cm x
              <span
                :contenteditable="isOnAdminPage"
                @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInCm', 'y')"
                @click.stop
                @touchstart.stop
              >
                {{ selectedPiece.sizeInCm.y }} </span
              >cm
            </div>
          </div>
        </swiper>

        <button
          v-if="isOnAdminPage"
          class="piece__remove-button"
          @click="handlePublishChanges"
          @click.stop="handleRemovePiece"
          @touchstart.stop="handleRemovePiece"
        >
          Smazat
        </button>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import interact from 'interactjs'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import usePieces from '~/J/usePieces'
import useAdminPage from '~/J/useAdminPage'
import useContentfulPiece from '~/J/useContentfulPiece'
import { Navigation } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper as SwiperTypes, Keyboard, Mousewheel } from 'swiper'
import { Topics, TechniqueDescription } from '~/components/piecesData'
import useMapper from '~/J/useMapper'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { StyleValue } from 'nuxt/dist/app/compat/capi'

const {
  mouseDownHandler,
  mouseMoveHandler,
  mouseUpHandler,
  mouseLeaveHandler,
  isDragging,
  touchmoveHandler,
  touchendHandler
} = useMouseActionDetector()
const { zIndexOfLastSelectedPiece, pieces, edgePositions } = usePieces()
const { isOnAdminPage, isSetupForMobile } = useAdminPage()
const { mapperEventData } = useMapper()

const swiperRef = ref<SwiperTypes | null>(null)
const localZIndex = ref(1)
const pieceRef = ref()
const selectedPiece = ref<Piece>()
const initialSlide = ref(0)
const activeIndex = ref(0)
// const selectedTopic = ref<Topics | null>(selectedPiece.value?.topic || null)
// const selectedTechnique = ref<Techniques | null>(
//   selectedPiece.value?.technique || null
// )

const windowObject = computed(() => window)

const props = defineProps<{
  piece: Piece
}>()

// const dateSelected = (payload : Date) => {
//   console.log(payload);
// }

const handleUpdatePieceTopic = () => {
  if (!selectedPiece.value || !pieces.value) return
  console.log('selectedTopic.value: ', selectedPiece.value.topic)
  console.log('sss')
  // selectedPiece.value.topic = selectedTopic.value
  pieces.value[activeIndex.value].topic = selectedPiece.value.topic
  pieces.value[activeIndex.value].isPublished = false
}

const handleUpdatePieceTechniqueDescription = () => {
  if (!selectedPiece.value || !pieces.value) return
  console.log('handleUpdatePieceTechniqueDescription: ', selectedPiece.value.techniqueDescription)
  pieces.value[activeIndex.value].techniqueDescription = selectedPiece.value.techniqueDescription
  pieces.value[activeIndex.value].isPublished = false
}

const handleOnBlurEditPieceInfo = (
  event: Event,
  primaryField: 'name' | 'techniqueDescription' | 'sizeInCm',
  secondField?: 'x' | 'y'
) => {
  if (!selectedPiece.value || !pieces.value) return
  const target = event.target as HTMLDivElement
  pieces.value[activeIndex.value].isPublished = false

  if (primaryField === 'name' || primaryField === 'techniqueDescription') {
    pieces.value[activeIndex.value][primaryField] = target.innerText
    selectedPiece.value[primaryField] = target.innerText
    return
  }

  if (secondField === 'x' || secondField === 'y') {
    pieces.value[activeIndex.value][primaryField][secondField] = Number(
      target.innerText
    )
    selectedPiece.value[primaryField][secondField] = Number(target.innerText)
  }
}

const { piece } = toRefs(props)

const onSlideChange = (swiper: SwiperTypes) => {
  if (!pieces.value) return
  activeIndex.value = swiper.activeIndex
  selectedPiece.value = pieces.value[swiper.activeIndex]
}

const handleOnSelectDate = (date: Date) => {
  if (!pieces.value) return
  pieces.value[activeIndex.value].isPublished = false
  pieces.value[activeIndex.value].created = date
}

onMounted(() => {
  interact(pieceRef.value)
    .draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          if (!isOnAdminPage.value) return
          const scale = mapperEventData.value.scale
          piece.value.isPublished = false
          const xRaw = piece.value.position.x + event.dx / scale
          const yRaw = piece.value.position.y + event.dy / scale
          const x = xRaw > -2000 ? xRaw : -2000
          const y = yRaw > -2000 ? yRaw : -2000
          piece.value.position.x = x
          piece.value.position.y = y
          edgePositions.value.x = Math.max(
            edgePositions.value.x,
            x + (piece.value?.sizeOnWeb?.width || 0) + 2000
          )
          edgePositions.value.y = Math.max(edgePositions.value.y, y + 2000)
          // }
        }
      }
    })
    .resizable({
      // resize from edges and corners
      edges: { left: false, right: true, bottom: false, top: false },

      listeners: {
        move(event) {
          // should use proportional size from cm of piece
          return
          const scale = mapperEventData.value.scale
          const target = event.target
          let x = parseFloat(target.getAttribute('data-x')) || 0
          let y = parseFloat(target.getAttribute('data-y')) || 0

          // update the element's style
          if (piece.value.sizeOnWeb.width === event.rect.width) return

          // if (isSetupForMobile.value) {
          //   piece.value.sizeOnWeb.widthMob = (event.rect.width / scale)
          // } else {
          piece.value.sizeOnWeb.width = event.rect.width / scale
          // }

          piece.value.isPublished = false
        }
      },
      modifiers: [
        // keep the edges inside the parent
        // interact.modifiers.restrictEdges({
        //   outer: 'parent'
        // }),

        // minimum size
        interact.modifiers.restrictSize({
          min: { width: 10, height: 10 }
        })
      ],
      inertia: true
    })
})

// const getRandomNumberInRange = (min: number, max: number) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// const defaultRandomization = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 300)
//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//   }
//   if (!piece.sizeOnWeb?.height) {
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//   }
//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 1920)
//   }
//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2200)
//   }
// }

// const randomizationPuzzle = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 200 : 350)
//     piece.sizeOnWeb.width = getRandomNumberInRange(150, maxRandomImageWidth)
//     piece.sizeOnWeb.height = getRandomNumberInRange(150, maxRandomImageWidth + 100)
//     piece.position.x = getRandomNumberInRange(0, window.innerWidth + 200)
//     piece.position.y = getRandomNumberInRange(100, 1200)
// }

// const randomizationNodeAvatars = (piece: Piece) => {
//   const maxRandomImageWidth = (window.innerWidth < 800 ? 70 : 100)

//   if (!piece.sizeOnWeb?.width) {
//     piece.sizeOnWeb.width = getRandomNumberInRange(35, maxRandomImageWidth)
//   }

//   if (!piece.position?.x) {
//     piece.position.x = getRandomNumberInRange(0, 2000)
//   }

//   if (!piece.position?.y) {
//     piece.position.y = getRandomNumberInRange(100, 2700)
//   }
// }

const handleOnMouseDown = () => {
  mouseDownHandler()
  localZIndex.value = zIndexOfLastSelectedPiece.value
  zIndexOfLastSelectedPiece.value++
}

const handleRemovePiece = async () => {
  if (confirm('Smazat?')) {
    await useContentfulPiece().removePiece(piece.value)
    pieces.value = pieces.value?.filter((p) => p.id !== piece.value.id)
    alert('Smazáno')
  }
}

const handlePieceStyle = (piece: Piece) => {
  if (!piece) return { width: '50px' }

  // TODO nice to have: add randomization during move for selected piece

  return {
    width: `${piece.sizeInCm?.x * 5}px`,
    maxHeight: piece.sizeInCm?.y ? `${piece.sizeInCm?.y * 5}px` : 'unset',
    left: `${piece.position?.x}px`,
    top: `${piece.position?.y}px`,
    deg: `${piece.position?.deg}deg`,
    zIndex: `${localZIndex.value}`
  }
}

const handleOnBackdropClick = () => {
  selectedPiece.value = undefined
}

const selectImage = (piece: Piece) => {
  if (!isDragging.value) {
    selectedPiece.value = piece
    const pieceIndex = pieces.value?.findIndex((p) => p.id === piece.id)
    initialSlide.value = pieceIndex || 0
  }
}
</script>

<style lang="stylus" scoped>

.piece
  // transition all 0.25s
  position absolute
  touch-action none
  user-select none

.piece__image
  position relative
  width 100%
  // max-height 85vh
  max-width 100%
  object-fit contain
  min-width 50px
  min-height 50px

  &--not-published
    // border 1px #12b5225e solid

.piece__image:hover
  cursor cell
  z-index 10
  // filter drop-shadow(0 0 1px black)

.dark-mode .piece__image:hover
  // filter drop-shadow(0 0 1px black) invert(1)

.piece__selected-piece-image
  cursor default
  z-index 10000
  object-fit contain
  // max-height 80%
  max-width 90%

  &--node-avatar
    max-height 300px

.piece__selected-piece-image-wrapper
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  width 100%
  cursor default


.piece__selected-piece-image-inner-wrapper
  width 100%
  display flex
  justify-content center
  max-height 75%
  cursor default
  z-index 10000

.piece__selected-piece-image-info-spacer
  height 4.75rem
  width 100%
  cursor default

.piece__selected-piece-info-wrapper
  display flex
  justify-content center
  position absolute
  width 100%
  // z-index: 100000;
  bottom 0
  cursor default


.piece__selected-piece-info
  // background-color #eee
  // color #919191
  // border-radius 15px 15px 20px 20px
  max-width 90%
  width max-content
  // padding 0.7rem 1rem
  // box-shadow 0 0 5px 0 #0000002e
  text-align center
  font-size 1rem
  align-self center
  // position absolute
  // bottom 5rem
  cursor auto
  user-select text
  font-family GowunDodum, Helvetica, Arial, sans-serif
  font-weight normal
  // padding 0 0.5rem
  z-index 10001
  text-shadow 0 0 1px #d2d3e0f2, 0 0 2px #d2d3e0f2

  @media (min-width 600px)
    align-self flex-end
    bottom 0.3rem


.dark-mode .piece__selected-piece-info
  // background-color rgb(17 17 17)


.piece__selected-piece-backdrop
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

.dark-mode .piece__selected-piece-backdrop
  // background-color unset
  background-color #efebebfc

.piece__publish-button
  position absolute
  bottom 0%
  left 50%
  transform translate(-50%, -50%)
  background #f1f9ffd6
  padding 0.5rem
  border-radius 5px
  z-index 10
  cursor pointer
  border 1px solid black
  visibility hidden

.piece__remove-button
  position absolute
  top 0
  right 0
  z-index 1000
  margin 0.3rem
  padding 0.3rem
  cursor pointer
  transition all 0.2s
  background white
  border 1px solid crimson
  color crimson
  border-radius 5px


// / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0

.swiper
  // cursor default
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

.piece__pinch-scroll-zoom
  z-index 10000
  // display flex
  // justify-content center
  // align-items center

.piece__selected-piece-image-prevent-close
  // position absolute
  bottom 0
  left 0
  width 100vw
  height 5vh
  z-index 10000
  cursor default

.piece__selected-piece-image-close-zone
  position absolute
  top 0
  right 0
  width 100vw
  height 50vh
  z-index 10000
  cursor url("/close.svg"), auto

.piece__selected-piece-back
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  opacity 0.2
</style>

<style lang="stylus">
.piece__pinch-scroll-zoom .pinch-scroll-zoom__content
  display flex
  justify-content center
  align-items center
  flex-direction column
</style>

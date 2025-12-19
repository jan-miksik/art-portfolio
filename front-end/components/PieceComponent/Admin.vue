<template>
  <Teleport to="body">
    <Transition name="images">
      <div
        v-if="selectedPiece"
        :class="[
          { 'piece-component-admin__selected-piece-backdrop': selectedPiece }
        ]"
        @click="emit('close-modal')"
        @touchstart="emit('close-modal')"
      >
        <swiper
          class="swiper"
          ref="swiperRef"
          :modules="[Navigation, Keyboard, Mousewheel]"
          :keyboard="{ enabled: false }"
          @slideChange="onSlideChange"
          :initialSlide="initialSlide"
        >
          <img
            src="/close.svg"
            width="30"
            height="30"
            class="piece-component-admin__selected-piece-back"
          />
          <swiper-slide class="slide" v-for="(piece, index) in pieces">
            <div
              class="piece-component-admin__selected-piece-image-wrapper"
              @click.stop
              @touchstart.stop
            >
              <div
                class="piece-component-admin__selected-piece-image-close-zone"
                @click.stop="emit('close-modal')"
                @touchstart.stop="emit('close-modal')"
                @touchend.stop.prevent
              />
              <div
                class="piece-component-admin__selected-piece-image-inner-wrapper"
                @click.stop
                @touchstart.stop
              >
                <BaseImage
                  :image-file="piece.image"
                  :is-full-size="true"
                  :piece="piece"
                  externalCssClass="piece-component-admin__selected-piece-image"
                  :class="[
                    'piece-component-admin__selected-piece-image',
                    {
                      'piece-component-admin__selected-piece-image--node-avatar':
                        piece.topic === Topics.NODE_AVATARS
                    }
                  ]"
                  @click.stop
                  @touchstart.stop
                />
              </div>
            </div>
            <div
              class="piece-component-admin__selected-piece-image-info-spacer"
              @click.stop
              @touchstart.stop
            />
          </swiper-slide>
          <div class="piece-component-admin__selected-piece-info-wrapper">
            <div
              class="piece-component-admin__selected-piece-info"
              @click.stop
              @touchstart.stop
            >
              <strong
                contenteditable
                @blur="(e) => handleOnBlurEditPieceInfo(e, 'name')"
                @click.stop
                @touchstart.stop
              >
                {{ selectedPiece.name }}
              </strong>
              <br />

              <VueDatePicker
                v-model="selectedPiece.created"
                autoApply
                @update:modelValue="handleOnSelectDate"
              />,

              <select
                v-model="selectedPiece.topic"
                @change="handleUpdatePieceTopic"
              >
                <option disabled value="">select...</option>
                <option v-for="topic in Topics">{{ topic }}</option>
              </select>

              <select
                v-model="selectedPiece.techniqueDescription"
                @change="handleUpdatePieceTechniqueDescription"
              >
                <option disabled value="">select...</option>
                <option v-for="topic in TechniqueDescription">
                  {{ topic }}
                </option></select
              >,
              <select v-model="sizeType">
                <option v-for="sizeType in SizeType">{{ sizeType }}</option>
              </select>

              <span v-if="isSizeInCm">
                <span
                  contenteditable
                  @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInCm', 'x')"
                  @click.stop
                  @touchstart.stop
                >
                  {{ selectedPiece.sizeInCm.x }} </span
                >cm x
                <span
                  contenteditable
                  @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInCm', 'y')"
                  @click.stop
                  @touchstart.stop
                >
                  {{ selectedPiece.sizeInCm.y }} </span
                >cm
              </span>

              <span v-if="isSizeInPx">
                <span
                  contenteditable
                  @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInPx', 'x')"
                  @click.stop
                  @touchstart.stop
                >
                  {{ selectedPiece.sizeInPx.x }} </span
                >px x
                <span
                  contenteditable
                  @blur="(e) => handleOnBlurEditPieceInfo(e, 'sizeInPx', 'y')"
                  @click.stop
                  @touchstart.stop
                >
                  {{ selectedPiece.sizeInPx.y }} </span
                >px
              </span>

              <label>
                <input
                  type="checkbox"
                  v-model="selectedPiece.isMoveableInPublic"
                  @change="handleIsMoveableInPublic(($event.target as HTMLInputElement)?.checked ?? false)"
                />
                Moveable in Public
              </label>

              <label>
                <input
                  type="checkbox"
                  v-model="selectedPiece.isArchived"
                  @change="handleIsArchived(($event.target as HTMLInputElement)?.checked ?? false)"
                />
                Archived
              </label>

            </div>
          </div>
        </swiper>

        <button
          class="piece-component-admin__remove-button"
          @click.stop="handleRemovePiece"
          @touchstart.stop="handleRemovePiece"
        >
          Smazat
        </button>
      </div>
      <div v-else/>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Piece from '~/models/Piece'
import usePieces from '~/J/usePieces'
import useContentfulPiece from '~/J/useContentfulPiece'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Swiper as SwiperTypes } from 'swiper'
import { Topics, TechniqueDescription } from '~/components/piecesData'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { SizeType } from './usePieceComponent'
import { Navigation, Keyboard, Mousewheel } from 'swiper/modules'

const { pieces } = usePieces()

const props = defineProps<{
  initialPiece: Piece
}>()
const { initialPiece } = toRefs(props)

const initialSlide = computed(() => {
  return pieces.value?.findIndex((p) => p?.id === initialPiece.value?.id) || 0
})

const activeIndex = ref(0)
const sizeType = ref<SizeType>()
const swiperRef = ref<SwiperTypes | null>(null)
const selectedPiece = ref<Piece | undefined>(initialPiece.value)

const emit = defineEmits<{
  (e: 'close-modal'): void
}>()

watch(initialPiece, () => {
  selectedPiece.value = initialPiece.value
  sizeType.value = selectedPiece.value?.sizeInCm.x ? SizeType.CM : SizeType.PX
})

const isSizeInCm = computed(() => (selectedPiece.value?.sizeInCm.x && selectedPiece.value?.sizeInCm.y) || sizeType.value === SizeType.CM)
const isSizeInPx = computed(() => (selectedPiece.value?.sizeInPx.x && selectedPiece.value?.sizeInPx.y) || sizeType.value === SizeType.PX)

const onSlideChange = (swiper: SwiperTypes) => {
  if (!pieces.value) return
  activeIndex.value = swiper.activeIndex
  selectedPiece.value = pieces.value[swiper.activeIndex]
  sizeType.value = selectedPiece.value?.sizeInCm.x ? SizeType.CM : SizeType.PX
}

const handleOnBlurEditPieceInfo = (
  event: Event,
  primaryField: 'name' | 'techniqueDescription' | 'sizeInCm' | 'sizeInPx',
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

const handleOnSelectDate = (date: Date) => {
  if (!pieces.value) return
  pieces.value[activeIndex.value].isPublished = false
  pieces.value[activeIndex.value].created = date
}

const handleUpdatePieceTopic = () => {
  if (!selectedPiece.value || !pieces.value) return

  pieces.value[activeIndex.value].topic = selectedPiece.value.topic
  pieces.value[activeIndex.value].isPublished = false
}

const handleUpdatePieceTechniqueDescription = () => {
  if (!selectedPiece.value || !pieces.value) return
  pieces.value[activeIndex.value].techniqueDescription =
    selectedPiece.value.techniqueDescription
  pieces.value[activeIndex.value].isPublished = false
}

const handleRemovePiece = async () => {
  if (!selectedPiece.value) return
  if (confirm('Smazat?')) {
    try {
      await useContentfulPiece().removePiece(selectedPiece.value)
      pieces.value = pieces.value?.filter((p) => p.id !== selectedPiece.value?.id)
      alert('Smazáno')
    } catch (error) {
      alert(`Chyba při mazání: ${error instanceof Error ? error.message : 'Neznámá chyba'}`)
    }
  }
}

const handleIsMoveableInPublic = (val: boolean) => {
  if (!selectedPiece.value || !pieces.value) return
  pieces.value[activeIndex.value].isPublished = false
  pieces.value[activeIndex.value].isMoveableInPublic = val
}

const handleIsArchived = (val: boolean) => {
  if (!selectedPiece.value || !pieces.value) return
  pieces.value[activeIndex.value].isPublished = false
  pieces.value[activeIndex.value].isArchived = val
}
</script>

<style lang="stylus" scoped>

.piece-component-admin__selected-piece-image
  cursor default
  z-index 10000
  object-fit contain
  max-width 90%

  &--node-avatar
    max-height 300px

.piece-component-admin__selected-piece-image-wrapper
  display flex
  flex-direction column
  justify-content center
  align-items center
  height 100%
  width 100%
  cursor default


.piece-component-admin__selected-piece-image-inner-wrapper
  width 100%
  display flex
  justify-content center
  max-height 75%
  cursor default
  z-index 10000

.piece-component-admin__selected-piece-image-info-spacer
  height 4.75rem
  width 100%
  cursor default

.piece-component-admin__selected-piece-info-wrapper
  display flex
  justify-content center
  position absolute
  width 100%
  bottom 0
  cursor default


.piece-component-admin__selected-piece-info
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


.piece-component-admin__selected-piece-backdrop
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

.dark-mode .piece-component-admin__selected-piece-backdrop
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

.piece-component-admin__selected-piece-image-close-zone
  position absolute
  top 0
  right 0
  width 100vw
  height 50vh
  z-index 10000
  cursor url("/close.svg"), auto
  pointer-events: auto
  touch-action: manipulation

.dark-mode .piece-component-admin__selected-piece-image-close-zone
  cursor url("/close-white.svg"), auto

.piece-component-admin__selected-piece-back
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  opacity 0.2

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

.dark-mode .piece-component-admin__selected-piece-back
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)
</style>

<style lang="stylus">
.piece-component-admin__selected-piece-image
  border 1px solid transparent
  position relative
  object-fit contain
  max-width 100%
  max-height 100%
</style>

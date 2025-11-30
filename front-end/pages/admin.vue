<template>
  <div>
  <!-- admin page is secured by Cloudflare Access -->
  <div class="admin__upload-data">
    <button
      data-testid="publish-button"
      :disabled="!isSomethingToPublish || publishingInProgress"
      @click="handlePublishChanges"
    >
      {{ publishButtonText }}
    </button>
    default topic for dropped piece
    <select
      data-testid="topic-selector"
      v-model="defaultTopic"
    >
      <option disabled value="">select...</option>
      <option v-for="topic in Topics">{{ topic }}</option>
    </select>
  </div>

  <div
    class="admin__dropzone"
    ref="dropzoneRef"
    @drop.prevent="drop"
    @dragover.prevent
    @dragleave.prevent
  >
    <PinchScrollZoom
      v-if="windowObject?.innerWidth && edgePositions.x"
      ref="mapperRef"
      :width="windowObject.innerWidth"
      :height="windowObject.innerHeight"
      class="pinch-scroll-zoom"
      :min-scale="0.01"
      :max-scale="100"
      @scaling="(e: PinchScrollZoomEmitData) => onMapperEvent('scaling', e)"
      @startDrag="(e: PinchScrollZoomEmitData) => onMapperEvent('startDrag', e)"
      @stopDrag="(e: PinchScrollZoomEmitData) => onMapperEvent('stopDrag', e)"
      @dragging="(e: PinchScrollZoomEmitData) => onMapperEvent('dragging', e)"
      :wheelVelocity="0.001"
      :throttleDelay="20"
      :content-width="edgePositions.x"
      :content-height="edgePositions.y"
      :draggable="!isOverPieceOrSetup"
    >
      <Pieces />
    </PinchScrollZoom>
  </div>
</div>
</template>

<script setup lang="ts">
import usePieces from '~/J/usePieces'
import useAdminPage from '~/J/useAdminPage'
import useContentfulPiece from '~/J/useContentfulPiece'
import PinchScrollZoom, {
  type PinchScrollZoomEmitData
} from '@coddicat/vue-pinch-scroll-zoom'
import useMapper from '~/J/useMapper'
import '@coddicat/vue-pinch-scroll-zoom/style.css'
import useMouseActionDetector from '~/J/useMouseActionDetector'
import Piece from '~/models/Piece'
import { v4 as uuidv4 } from 'uuid'
import { Topics } from '~/components/piecesData'
import { Techniques, TechniqueDescription } from '../components/piecesData'
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'
import { NEW_PIECE_X_OFFSET, NEW_PIECE_Y_OFFSET, DEFAULT_WEB_WIDTH, DEFAULT_WEB_WIDTH_MOBILE } from '~/constants/layout'
import { PUBLISH_DELAY_MS } from '~/constants/timing'
import { logger } from '~/utils/logger'
import { ErrorCode, createAppError } from '~/utils/errorHandler'
import useErrorNotification from '~/J/useErrorNotification'
import { parseFileName } from '~/utils/parseFileName'
import { useThrottleFn } from '@vueuse/core'

const { pieces } = usePieces()
const { edgePositions } = usePieces()
const { onMapperEvent, mapperEventData } = useMapper()
const { isOverPieceOrSetup } = useMouseActionDetector()
const { isOnAdminPage, isSetupForMobile } = useAdminPage()

const dropzoneRef = ref<HTMLElement | null>(null)
const cursorPosition = ref({ x: 0, y: 0, scale: 1 })
const errorMessage = ref('')
const publishingInProgress = ref(false)
const isMapperSet = ref(false)
const mapperRef = ref()
const defaultTopic = ref(Topics.DIGITAL)
const { showErrorNotification } = useErrorNotification()

const windowObject = computed(() => window)

onMounted(async () => {
  isOnAdminPage.value = true
})

watch(mapperRef, (newVal) => {
  if (!newVal || isMapperSet.value) return
  isMapperSet.value = true
  if (isSetupForMobile.value) {
    mapperRef.value?.setData({
      scale: 0.25,
      originX: 4412,
      originY: 6505,
      translateX: -2000 - LEFT_OFFSET,
      translateY: -6000 - TOP_OFFSET
    })
  } else {
    mapperRef.value?.setData({
      scale: 0.3,
      originX: 4725,
      originY: 6388,
      translateX: -5500,
      translateY: -7000
    })
  }
})

const isSomethingToPublish = computed(
  () => usePieces().pieces.value?.some((piece) => piece.isPublished === false)
)

const publishButtonText = computed(() =>
  publishingInProgress.value ? 'Nahrávání...' : 'Publikovat'
)

onMounted(() => {
  window.addEventListener('mousemove', updateCursorPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursorPosition)
})

const updateCursorPosition = useThrottleFn((event: MouseEvent) => {
  if (!dropzoneRef.value) return

  const scale = mapperEventData.value?.scale || 1
  const x = mapperEventData.value?.x || 0
  const y = mapperEventData.value?.y || 0

  cursorPosition.value = {
    x: event.clientX - x,
    y: event.clientY - y,
    scale,
  }
}, 16) // ~60fps

const drop = (event: DragEvent) => {
  if (!useAdminPage().isOnAdminPage.value) return

  const files = event?.dataTransfer?.files

  if (!files) return
  const imageFile = Array.from(files)[0]
  if (files.length !== 1 || !imageFile) {
    showErrorNotification(
      createAppError(
        new Error('Please drop exactly one file'),
        'drop',
        ErrorCode.INVALID_INPUT
      ),
      'drop',
      ErrorCode.INVALID_INPUT
    )
    return
  }

  const parsedData = parseFileName(imageFile.name)
  const { name, created, size } = parsedData

  const isSizeInCm = size.unit === 'cm'
  const isSizeInPx = size.unit === 'px'

  const id = uuidv4()
  const newPiece = reactive(
    new Piece({
      id,
      name,
      topic: defaultTopic.value,
      image: {
        id,
        url: URL.createObjectURL(imageFile as File),
        lastUpdated: new Date().getTime()
      },
      technique: Techniques.MIXED_MEDIA,
      techniqueDescription: TechniqueDescription.DIGITAL_BITMAP,
      created,
      sizeInCm: {
        x: isSizeInCm ? size.x : 0,
        y: isSizeInCm ? size.y : 0
      },
      sizeInPx: {
        x: isSizeInPx ? size.x : 0,
        y: isSizeInPx ? size.y : 0
      },
      imageRaw: imageFile,
      sizeOnWeb: {
        width: DEFAULT_WEB_WIDTH,
        widthMob: DEFAULT_WEB_WIDTH_MOBILE
      },
      position: {
        x: Math.floor(cursorPosition.value.x - NEW_PIECE_X_OFFSET),
        y: Math.floor(cursorPosition.value.y - NEW_PIECE_Y_OFFSET),
        deg: 0,
        yMob: Math.floor(cursorPosition.value.y - TOP_OFFSET),
        xMob: Math.floor(cursorPosition.value.x - LEFT_OFFSET),
        degMob: 0
      },
      isUpdated: false,
      isPublished: false,
      isUploadedToCf: false,
      isMoveableInPublic: true,
    })
  )

  // Add piece to array first (for UI feedback)
  pieces.value?.push(newPiece)
  
  // Upload to Contentful in background
  // If upload fails, remove the piece from the UI
  useContentfulPiece().uploadPiece(newPiece).catch((error) => {
    const errorMsg = showErrorNotification(error, 'uploadPiece', ErrorCode.CONTENTFUL_UPLOAD_FAILED)
    errorMessage.value = errorMsg
    
    // Remove piece from UI if upload fails
    const pieceIndex = pieces.value?.findIndex(p => p.id === newPiece.id)
    if (pieceIndex !== -1 && pieces.value && pieceIndex !== undefined) {
      pieces.value.splice(pieceIndex, 1)
    }
    
    // Clean up object URL
    if (newPiece.image?.url && newPiece.image.url.startsWith('blob:')) {
      URL.revokeObjectURL(newPiece.image.url)
    }
    
    // Log for debugging
    logger.error('Failed to upload piece:', {
      pieceId: newPiece.id,
      pieceName: newPiece.name,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  })
}

const handlePublishChanges = async () => {
  publishingInProgress.value = true
  const piecesToPublish = pieces.value?.filter(
    (piece) => piece.isPublished === false
  )

  if (!piecesToPublish) {
    publishingInProgress.value = false
    return
  }
  for (const piece of piecesToPublish) {
    try {
      await new Promise((resolve) => setTimeout(resolve, PUBLISH_DELAY_MS))
      await useContentfulPiece().updateAndPublishPiece(piece)
      logger.log(`Successfully published piece: ${piece.name}`)
    } catch (error) {
      const errorMsg = showErrorNotification(
        error,
        `publishPiece:${piece.name}`,
        ErrorCode.CONTENTFUL_PUBLISH_FAILED
      )
      errorMessage.value = `Failed to publish "${piece.name}": ${errorMsg}`
      
      // Log for debugging
      logger.error('Failed to publish piece:', {
        pieceId: piece.id,
        pieceName: piece.name,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
      
      // Continue with next piece instead of stopping
      continue
    }
  }
  publishingInProgress.value = false
}

</script>

<style lang="stylus">

h3
  margin 0

.admin__not-authenticated
  inset 0
  position fixed
  z-index 100000
  background #000000eb

.admin__auth-form
  position fixed
  z-index 100000
  top 50%
  left 50%
  transform translate(-50%, -50%)
  display flex
  flex-direction column
  gap 1rem
  justify-content center

.admin__upload-data
  position fixed
  top 0.2rem
  left 3px
  z-index 1000

.admin__settings
  position fixed
  top 0.2rem
  left 90px
  z-index 1000

.admin__upload-image-preview
  position fixed
  top 0
  right 0

.admin__settings-modal-backdrop
  position fixed
  display flex
  align-items center
  justify-content center
  flex-direction column
  gap 1rem
  inset 0
  height 100vh
  z-index 1000
  background-color #fffffff7
  backdrop-filter sepia(1) blur(2px)
  cursor url("/close.svg"), auto

.admin__settings-modal-content
  width 300px
  background-color white
  display flex
  flex-direction column
  padding 1rem
  border-radius 5px
  cursor default
  align-items baseline
  gap 0.3rem

.admin__color-picker
  position fixed
  bottom 0
  left 0

button
  cursor pointer

.admin__error-message
  color white

.admin__settings-mobile-btn
  position fixed
  left 210px
  z-index 1000

.admin__settings-desktop-btn
  position fixed
  left 270px
  z-index 1000

.admin__settings-mobile-btn
.admin__settings-desktop-btn
  top 0
  z-index 1000
  margin 0.2rem
  padding 0.2rem 0.5rem
  cursor pointer
  transition all 0.2s
  border-radius 3px
  background #3cd054
  border none
  color #fff

  &--disabled
    opacity 0.3

.pinch-scroll-zoom
  cursor move
</style>

<template>
  <div>
  <div v-if="!isAuthenticated" class="admin__not-authenticated" />
  <form
    v-if="!isAuthenticated"
    class="admin__auth-form"
    @submit.prevent="submitPassword"
  >
    <input type="password" v-model="password" @input="handleOnPasswordInput" />
    <button type="submit">Přihlásit</button>
    <p class="admin__error-message">
      {{ errorMessage }}
    </p>
  </form>

  <!-- x: {{ Math.floor(cursorPosition.x) }} y: {{ Math.floor(cursorPosition.y) }} scale {{ cursorPosition.scale }} -->
  <!-- <br/> -->
  <!-- mapper x: {{ Math.floor(mapperEventData.x
) }} y: {{ Math.floor(mapperEventData.y) }} scale {{ mapperEventData.scale }} -->


  <div class="admin__upload-data">
    <button
      :disabled="!isSomethingToPublish || publishingInProgress"
      @click="handlePublishChanges"
    >
      {{ publishButtonText }}
    </button>
    default topic for dropped piece
    <select
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
import { Techniques } from '../components/piecesData'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const { pieces } = usePieces()
const { edgePositions } = usePieces()
const { onMapperEvent, isMapperDraggable, mapperEventData } = useMapper()
const { isOverPieceOrSetup } = useMouseActionDetector()
const { isOnAdminPage, isSetupForMobile } = useAdminPage()

const isAuthenticated = ref(
  import.meta.env.VITE_IS_ADMIN_AUTHENTICATION !== 'true'
)
const dropzoneRef = ref<HTMLElement | null>(null)
const cursorPosition = ref({ x: 0, y: 0, scale: 1 })
const password = ref('')
const errorMessage = ref('')
const isSettingsOpen = ref(false)
const publishingInProgress = ref(false)
const isMapperSet = ref(false)
const mapperRef = ref()
const defaultTopic = ref(Topics.FREE_TOPIC)

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

const submitPassword = () => {
  errorMessage.value = ''
  if (password.value === import.meta.env.VITE_ADMIN_PASSWORD) {
    isAuthenticated.value = true
  } else {
    errorMessage.value = 'špatné heslo'
  }
}

onMounted(() => {
  window.addEventListener('mousemove', updateCursorPosition)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateCursorPosition)
})

// admin
const updateCursorPosition = (event: MouseEvent) => {
  if (!dropzoneRef.value) return

  const scale = mapperEventData.value?.scale || 1

  cursorPosition.value = {
    x: (event.clientX) + -mapperEventData.value?.x,
    y: (event.clientY) + -mapperEventData.value?.y,
    scale,
  }
  // console.log('cursorPosition.value: ', cursorPosition.value);
}

const drop = (event: DragEvent) => {
  if (!useAdminPage().isOnAdminPage.value) return

  const files = event?.dataTransfer?.files

  if (!files) return
  const imageFile = Array.from(files)[0]
  if (files.length !== 1 && !imageFile) return

  // Remove the file extension
  const description = imageFile.name.replace(/\.[^/.]+$/, '');
  const parts = description.split(',').map(part => part.trim());
  console.log('parts: ', parts);

  const name = parts[0];
  const created = new Date(Number(parts[1]), 6) || new Date();
  const techniqueDescription = parts[2] || '';
  const sizeStr = parts[3] || '0x0';
  console.log('sizeStr: ', sizeStr);

  const index = sizeStr.indexOf('x');
  const size: string[] = [];

  if (index !== -1) {
    const part1 = sizeStr.substring(0, index);
    const part2 = sizeStr.substring(index + 1);
    size.push(part1, part2)
  } else {
    console.error("'x' not found in string");
  }

  const isSizeInCm = size[1].includes('cm');
  const isSizeInPx = size[1].includes('px');

  const sizeX = parseInt(size[0]);
  const sizeY = () => {
    if (isSizeInCm) {
      return parseInt(size[1].replace('cm', ''))
    }
    if (isSizeInPx) {
      return parseInt(size[1].replace('px', ''))
    }
    return 0
  }


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
      techniqueDescription,
      created,
      sizeInCm: {
        x: isSizeInCm ? +sizeX : 0,
        y: isSizeInCm ? +sizeY() : 0
      },
      sizeInPx: {
        x: isSizeInPx ? +sizeX : 0,
        y: isSizeInPx ? +sizeY() : 0
      },
      imageRaw: imageFile,
      sizeOnWeb: {
        width: 350,
        widthMob: 250
        // height?: number
      },
      position: {
        x: Math.floor(cursorPosition.value.x - 6000),
        y: Math.floor(cursorPosition.value.y - 4000),
        deg: 0,
        yMob: Math.floor(cursorPosition.value.y - TOP_OFFSET),
        xMob: Math.floor(cursorPosition.value.x - LEFT_OFFSET),
        degMob: 0
      },
      isUpdated: false,
      isPublished: false,
      isUploadedToCf: false
    })
  )


  pieces.value?.push(newPiece)
  useContentfulPiece().uploadPiece(newPiece)
}

const handlePublishChanges = async () => {
  publishingInProgress.value = true
  const DELAY = 200
  const piecesToPublish = pieces.value?.filter(
    (piece) => piece.isPublished === false
  )

  if (!piecesToPublish) {
    publishingInProgress.value = false
    return
  }
  for (const piece of piecesToPublish) {
    await new Promise((resolve) => setTimeout(resolve, DELAY))
    await useContentfulPiece().updateAndPublishPiece(piece)
  }
  publishingInProgress.value = false
}

const handleOpenSettings = () => {
  isSettingsOpen.value = true
}

const handleOnPasswordInput = () => {
  errorMessage.value = ''
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

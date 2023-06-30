<template>
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
  <div class="admin__upload-data">
    <button
      :disabled="!isSomethingToPublish || publishingInProgress"
      @click="handlePublishChanges"
    >
      {{ publishButtonText }}
    </button>
  </div>

  <!-- <div class="admin__settings">
    <button @click="handleOpenSettings">Nastavení</button>
  </div> -->

  <!-- <button
    class="admin__settings-mobile-btn"
    :class="[
      'admin__settings-mobile-btn',
      { 'admin__settings-mobile-btn--disabled': !isSetupForMobile }
    ]"
    @click="handleChangeDeviceTypeSetup('mobile')"
  >
    Mobil
  </button>

  <button
    :class="[
      'admin__settings-desktop-btn',
      { 'admin__settings-desktop-btn--disabled': isSetupForMobile }
    ]"
    @click="handleChangeDeviceTypeSetup('desktop')"
  >
    Desktop
  </button> -->

  <!-- <OColorPicker
    v-if="isSettingColors"
    :selectedColor="appSettings?.backgroundColor"
    @colorChange="handleOnBgColorChange"
    class="admin__color-picker"
  /> -->

  <!-- <div
    v-if="isSettingsOpen"
    class="admin__settings-modal-backdrop"
    @click="handleOnBackdropClick"
    @touchstart="handleOnBackdropClick"
  >
    <div
      class="admin__settings-modal-content"
      @click.stop
      @touchstart.stop
      v-if="appSettings"
    >
      <h3>přesouvaní děl</h3>
      <label>
        mobil
        <input type="checkbox" v-model="appSettings.editableOnMobil" />
      </label>
      <label>
        desktop
        <input type="checkbox" v-model="appSettings.editableOnDesktop" />
      </label>
      <br />

      <h3>ostatní</h3>
      <label>
        úprava barev
        <input type="checkbox" v-model="isSettingColors" />
      </label>

      <h3>detail díla</h3>
      <label>
        barva pozadí
        <input type="color" v-model="appSettings.backgroundColorPieceDetail" />
      </label>
      <label>
        barva textu
        <input type="color" v-model="appSettings.pieceDetailTextColor" />
      </label>
    </div>
  </div> -->

  <PinchScrollZoom
    v-if="windowObject?.innerWidth && edgePositions.x"
    ref="mapperRef"
    :width="windowObject.innerWidth"
    :height="windowObject.innerHeight"
    within
    class="pinch-scroll-zoom"
    :min-scale="0.01"
    :max-scale="100"
    @scaling="e => onMapperEvent('scaling', e)"
    @startDrag="e => onMapperEvent('startDrag', e)"
    @stopDrag="e => onMapperEvent('stopDrag', e)"
    @dragging="e => onMapperEvent('dragging', e)"
    :draggable="isMapperDraggable"
    :wheelVelocity="0.001"
    :throttleDelay="20"
    :content-width="edgePositions.x"
    :content-height="edgePositions.y">
      <Pieces />
    </PinchScrollZoom>
</template>

<script setup lang="ts">
import usePieces from '~/J/usePieces'
import useAdminPage from '~/J/useAdminPage'
import useContentfulPiece from '~/J/useContentfulPiece'
import PinchScrollZoom, { PinchScrollZoomExposed } from '@coddicat/vue-pinch-scroll-zoom';
import useMapper from '~/J/useMapper';
import isMobile from '~/J/isMobile';

const isProbablyMobile = isMobile()
// import useContentful from '~/api/useContentful'
const { pieces } = usePieces()
const { edgePositions } = usePieces()

const { onMapperEvent, isMapperDraggable } = useMapper()
const windowObject = computed(() => window)

const isAuthenticated = ref(
  import.meta.env.VITE_IS_ADMIN_AUTHENTICATION !== 'true'
)
const password = ref('')
const errorMessage = ref('')
const isSettingsOpen = ref(false)
const publishingInProgress = ref(false)
const mapperRef = ref<PinchScrollZoomExposed>();
const isMapperSet = ref(false)


// const { selectedTopic } = useSelectedTopic()
// const { appSettings, appSettingsOriginString } = useContentful()
const {
  isOnAdminPage,
  // isSettingColors,
  // isSettingChanged,
  // updateSettings,
  isSetupForMobile
} = useAdminPage()
onMounted(async () => {
  isOnAdminPage.value = true
})

watch(mapperRef, (newVal) => {
  console.log('newVal: ', newVal);
  if (!newVal || isMapperSet.value) return
  isMapperSet.value = true
  if (isSetupForMobile.value) {
    mapperRef.value?.setData({
      scale: 0.25,
      originX: 4412,
      originY: 6505,
      translateX: -4200,
      translateY: -6000,
    });
  } else {
    mapperRef.value?.setData({
      scale: 0.7,
      originX: 4725,
      originY: 6388,
      translateX: -3970,
      translateY: -6017,
    });
  }
})

// const handleOnBgColorChange = (color: string) => {
//   // isSettingChanged.value = true
//   appSettings.value.backgroundColor = color
// }

const isSomethingToPublish = computed(
  () =>
    usePieces().pieces.value?.some((piece) => piece.isPublished === false) 
    // || isSettingChanged.value
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

const handleChangeDeviceTypeSetup = (deviceType: 'mobile' | 'desktop') => {
  if (deviceType === 'mobile') {
    isSetupForMobile.value = true
  } else {
    isSetupForMobile.value = false
  }
}

// const handleOnBackdropClick = () => {
//   isSettingsOpen.value = false
// }

const handlePublishChanges = async () => {
  publishingInProgress.value = true
  const DELAY = 200
  const piecesToPublish = pieces.value?.filter(
    (piece) => piece.isPublished === false
  )

  // if (isSettingChanged.value) {
  //   await updateSettings()
  //   appSettingsOriginString.value = JSON.stringify(appSettings.value)
  // }

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

// useHead({
//   title: 'Daniela de Luna',
//   meta: [
//     {
//       content: 'admin page'
//     }
//   ]
// })
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
  // right: 0;
  top 0
  z-index 1000
  margin 0.2rem
  padding 0.2rem 0.5rem
  cursor pointer
  transition all 0.2s
  // background #fff
  // border 1px solid #000
  // color #000
  border-radius 3px
  background #3cd054
  border none
  color #fff

  &--disabled
    opacity 0.3
</style>

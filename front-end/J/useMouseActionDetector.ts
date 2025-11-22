import { ref } from 'vue'
import useAdminPage from './useAdminPage'
import type Piece from "~/models/Piece";
import { DRAG_RESET_DELAY_MS } from '~/constants/timing'

const isDragging = ref(false)
const isOverPieceOrSetup = ref(false)
const isOverPieceOrSetupInPublicPage = ref(false)

export default function useMouseActionDetector() {
  const { isOnAdminPage, isSetupForMobile } = useAdminPage()

  const mouseDownHandler = () => {
    isDragging.value = false
  }

  const mouseMoveHandler = (event: MouseEvent, piece?: Piece) => {
    isDragging.value = true
    if (!isOnAdminPage.value && !piece?.isMoveableInPublic) return
    isOverPieceOrSetup.value = true
  }

  const mouseUpHandler = () => {

    isDragging.value ? 'drag' : 'click'
    setTimeout(() => {
        isDragging.value = false
    }, DRAG_RESET_DELAY_MS)
  }

  const mouseLeaveHandler = () => {
    isOverPieceOrSetup.value = false
  }

  const touchmoveHandler = (event: TouchEvent, piece?: Piece) => {
    if (!isOnAdminPage.value && !piece?.isMoveableInPublic) return
    isOverPieceOrSetup.value = true
  }

  const touchendHandler = () => {
    isOverPieceOrSetup.value = false
  }

  // Public page
  const mouseMoveHandlerPublicPage = () => {
    isDragging.value = true
    isOverPieceOrSetupInPublicPage.value = true
  }
  const mouseLeaveHandlerPublicPage = () => {
    isOverPieceOrSetupInPublicPage.value = false
  }

  const touchmoveHandlerPublicPage = () => {
    isOverPieceOrSetupInPublicPage.value = true
  }

  const touchendHandlerPublicPage = () => {
    isOverPieceOrSetupInPublicPage.value = false
  }


  return {
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
    mouseLeaveHandler,
    touchmoveHandler,
    touchendHandler,
    mouseMoveHandlerPublicPage,
    mouseLeaveHandlerPublicPage,
    touchmoveHandlerPublicPage,
    touchendHandlerPublicPage,
    isOverPieceOrSetupInPublicPage,
    isDragging,
    isOverPieceOrSetup,
  }
}

import { ref } from 'vue'
import useAdminPage from './useAdminPage'

const isDragging = ref(false)
const isOverPieceOrSetup = ref(false)
export default function useMouseActionDetector() {
  const { isOnAdminPage, isSetupForMobile } = useAdminPage()

  const mouseDownHandler = () => {
    isDragging.value = false
  }

  const mouseMoveHandler = () => {
    isDragging.value = true
    isOverPieceOrSetup.value = true
    
  }

  const mouseUpHandler = () => {
    
    isDragging.value ? 'drag' : 'click'
    setTimeout(() => {
        isDragging.value = false
    }, 500)
  }

  const mouseLeaveHandler = () => {
    isOverPieceOrSetup.value = false
  }

  const touchmoveHandler = () => {
    if (!isOnAdminPage.value) return
    isOverPieceOrSetup.value = true
  }

  const touchendHandler = () => {
    isOverPieceOrSetup.value = false
  }

  return {
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
    mouseLeaveHandler,
    touchmoveHandler,
    touchendHandler,
    isDragging,
    isOverPieceOrSetup,
  }
}
import { ref } from 'vue'

export default function useMouseActionDetector() {
  const isDragging = ref(false)
  
  const mouseDownHandler = () => {
    isDragging.value = false
  }

  const mouseMoveHandler = () => {
    isDragging.value = true
  }

  const mouseUpHandler = () => {
    
    isDragging.value ? 'drag' : 'click'
    setTimeout(() => {
        isDragging.value = false
    }, 500)
  }

  return {
    mouseDownHandler,
    mouseMoveHandler,
    mouseUpHandler,
    isDragging,
  }
}
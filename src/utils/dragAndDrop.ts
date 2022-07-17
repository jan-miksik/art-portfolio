import { ref } from 'vue'
const isDown = ref(false)
const isDragging = ref(false)

export const dragAndDrop = (el: HTMLElement, isMouseMove: boolean) => {
  if (!el) return
  el.addEventListener('mousedown', function(e) {
    e.preventDefault()
    isDown.value = true
  }, true)

  document.addEventListener('mouseup', function() {
    isDown.value = false
  }, true)

  el.addEventListener('mousemove', function(event) {
    event.preventDefault()
    if (isDown.value) {
      // isMouseMove.value = true
      const deltaX = event.movementX
      const deltaY = event.movementY
      const rect: any = el?.getBoundingClientRect()
      if (!rect) return
      el.style.left = rect.x + deltaX + 'px'
      el.style.top = rect.y + deltaY + 'px'
    }
  }, true)
}


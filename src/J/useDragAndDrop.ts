import { ref } from 'vue'
const isDragging = ref(false)
const initialPosition = ref({ x: 0, y: 0 })

export default function useDragAndDrop() {
  const dragAndDrop = (el: HTMLElement) => {
    let isDown = false
    if (!el) return
    el.addEventListener('mousedown', function(e) {
      e.preventDefault()
      isDown = true
      const rect: any = el?.getBoundingClientRect()
      initialPosition.value = { x: rect.x, y: rect.y }
    }, true)

    document.addEventListener('mouseup', function() {
      isDown = false
      setTimeout(() => {
        isDragging.value = false
      }, 100)
    }, true)

    document.addEventListener('mousemove', function(event) {
      event.preventDefault()
      if (isDown) {
        const rect: any = el?.getBoundingClientRect()
        const ix = initialPosition.value.x
        const iy = initialPosition.value.y
        const diff = 30
        const isDragX = ((ix + diff) < rect.x) || ((ix - diff) > rect.x)
        const isDragY = ((iy + diff) < rect.y) || ((iy - diff) > rect.y)

        if (isDragX || isDragY) {
          isDragging.value = true
        }
        const deltaX = event.movementX
        const deltaY = event.movementY


        if (!rect) return
        el.style.left = rect.x + deltaX + 'px'
        el.style.top = rect.y + deltaY + 'px'
      }
    }, true)
  }
  return {
    dragAndDrop,
    isDragging
  }
}

/// ///////////////////////////
// Alternative unused version of dragAndDrop:
/// ///////////////////////////

// <!-- @dragstart="dragStart"
// draggable="true"
// @dragend="drop" -->

// const dragStart = (event: DragEvent | any) => {
//   if (!event?.dataTransfer || !event.target) return
//   console.log('event', event)
//   // event.dataTransfer.dropEffect = 'move'
//   // event.dataTransfer.effectAllowed = 'move'
//   setTimeout(() => {
//     event.target.classList.add('hide')
//   }, 0)
//   event.dataTransfer.setData('text/plain', event.target.id)
//   // event.dataTransfer.setData('itemID', '1')
// }

// const drop = (event: DragEvent | any) => {
//   if (!event?.dataTransfer || !event.target) return
//   console.log('event 000000', event)

//   event.target.classList.remove('hide')
//   event.target.style.left = `${event.clientX}px`
//   event.target.style.top = `${event.clientY}px`
//   const data = event.dataTransfer.getData('text/plain')
//   const element = document.getElementById(data)
//   if (element) {
//     element.classList.remove('hide')
//   }
// }

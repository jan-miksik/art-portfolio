import interact from "interactjs";
import useMouseActionDetector from "~/J/useMouseActionDetector";

export default function useDraggable(elementRef: Ref, styleRef: Ref) {
  const { mouseDownHandler, mouseMoveHandler, mouseUpHandler } = useMouseActionDetector()

  const addDragAndDrop = (elementRef: Ref<HTMLElement | undefined>, styleRef: Ref) => {

    if (!elementRef.value) return

    interact(elementRef.value).draggable({
      inertia: true,
      autoScroll: true,
      listeners: {
        move(event) {
          styleRef.value.top += event.dy
          styleRef.value.left += event.dx
        }
      }
    })

    elementRef.value.addEventListener('mousedown', mouseDownHandler)
    elementRef.value.addEventListener('mousemove', mouseMoveHandler)
    elementRef.value.addEventListener('mouseup', mouseUpHandler)
  }

  onMounted(() => addDragAndDrop(elementRef, styleRef))

  const dragAndDropStyle = (styleRef: Ref) => {
    return {
      top: `${styleRef.value.top}px`,
      left: `${styleRef.value.left}px`,
    }
  }

  return {
    dragAndDropStyle
  }
}

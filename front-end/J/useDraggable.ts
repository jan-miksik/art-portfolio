import interact from 'interactjs'

function dragMoveListener(event: Interact.InteractEvent) {
  var target = event.target as HTMLElement,
    x = (parseFloat(target.getAttribute('data-x')!) || 0) + event.dx,
    y = (parseFloat(target.getAttribute('data-y')!) || 0) + event.dy

  target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

  target.setAttribute('data-x', x.toString())
  target.setAttribute('data-y', y.toString())
}

export default function useDraggable(elements: HTMLElement[]) {
  elements.forEach((el) => {
    interact(el).draggable({
      inertia: true,
      modifiers: [
        interact.modifiers.restrictRect({
          restriction: 'parent',
          endOnly: true
        })
      ],
      autoScroll: true,
      onmove: dragMoveListener,
      onend: (event) => {
        var target = event.target as HTMLElement,
          x = parseFloat(target.getAttribute('data-x')!) || 0,
          y = parseFloat(target.getAttribute('data-y')!) || 0

        target.style.top = y + 'px'
        target.style.left = x + 'px'
        target.style.transform = ''
      }
    })
  })
}



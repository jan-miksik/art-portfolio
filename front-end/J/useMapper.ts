import { PinchScrollZoomEmitData } from "@coddicat/vue-pinch-scroll-zoom";
import useMouseActionDetector from "./useMouseActionDetector";

const mapperEventData = ref()
const isMapperDraggable = ref(true);

export default function useMapper() {
  const { isOverPieceOrSetup } = useMouseActionDetector()

  function onMapperEvent(name: string, event: PinchScrollZoomEmitData): void {
    if (name === 'dragging' && isOverPieceOrSetup.value) {
      isMapperDraggable.value = false;
    } else {
      isMapperDraggable.value = true;
    }
    mapperEventData.value = event
  }
  return {
    onMapperEvent,
    isMapperDraggable,
    mapperEventData
  }
}
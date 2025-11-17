import Piece from '~/models/Piece'
import useContentful from '~/api/useContentful'
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'
import { DESKTOP_EDGE_PADDING, MOBILE_EDGE_PADDING } from '~/constants/layout'
import type { ContentfulPieceItem } from '~/types/contentful'
import { Topics, Techniques } from '~/components/piecesData'


const pieces = ref<Piece[] | undefined>([])
const zIndexOfLastSelectedPiece = ref(10)
const edgePositions = ref({
  x: 0,
  y: 0,
  xMob: 0,
  yMob: 0
})

export default function usePieces() {

  const mergeContentfulDataWithLocalData = async () => {
    const { contentfulData } = useContentful()
    contentfulData.value.forEach((pieceData: ContentfulPieceItem) => {
      const {
        sys,
        name,
        topic,
        technique,
        techniqueDescription,
        created,
        sizeInCmXHorizontal,
        sizeInCmYVertical,
        sizeInPxX,
        sizeInPxY,
        widthOnWeb,
        widthOnWebMob,
        image,
        positionX,
        positionY,
        positionDeg,
        positionXMob,
        positionYMob,
        positionDegMob,
        isMoveableInPublic,
        isArchived,
      } = pieceData

      edgePositions.value.x = Math.max(
        edgePositions.value.x, 
        (positionX || 0) + (widthOnWeb || 0) + DESKTOP_EDGE_PADDING + LEFT_OFFSET
      );
      edgePositions.value.y = Math.max(
        edgePositions.value.y, 
        (positionY || 0) + DESKTOP_EDGE_PADDING + TOP_OFFSET
      );
      edgePositions.value.xMob = Math.max(
        edgePositions.value.xMob, 
        (positionXMob || 0) + (widthOnWebMob || 0) + MOBILE_EDGE_PADDING + LEFT_OFFSET
      );
      edgePositions.value.yMob = Math.max(
        edgePositions.value.yMob, 
        (positionYMob || 0) + MOBILE_EDGE_PADDING + TOP_OFFSET
      );

      const newPiece = new Piece({
        id: sys.id,
        sys: {
          id: pieceData.sys.id,
          version: pieceData.sys.version
        },
        name,
        topic: topic as Topics,
        technique: technique as Techniques,
        techniqueDescription,
        created: new Date(created),
        image: {
          id: image?.sys?.id || '',
          url: image?.url || '',
          lastUpdated: image?.sys?.publishedAt 
            ? new Date(image.sys.publishedAt).getTime() 
            : new Date('1990').getTime()
        },
        sizeInCm: {
          x: sizeInCmXHorizontal || 0,
          y: sizeInCmYVertical || 0
        },
        sizeInPx: {
          x: sizeInPxX || 0,
          y: sizeInPxY || 0
        },
        sizeOnWeb: {
          width: widthOnWeb || 0,
          widthMob: widthOnWebMob || 0
        },
        position: {
          x: positionX || 0,
          y: positionY || 0,
          deg: positionDeg || 0,
          xMob: positionXMob || 0,
          yMob: positionYMob || 0,
          degMob: positionDegMob || 0
        },
        isUpdated: true,
        isPublished: true,
        isUploadedToCf: true,
        isMoveableInPublic: isMoveableInPublic,
        isArchived: isArchived,
      })
      pieces.value?.push(newPiece)
    })
  }

  return {
    mergeContentfulDataWithLocalData,
    pieces,
    edgePositions,
    zIndexOfLastSelectedPiece
  }
}

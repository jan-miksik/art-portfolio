import Piece from '~/models/Piece'
import useContentful from '~/api/useContentful'
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'


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
    contentfulData.value.forEach((pieceData: any) => {
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

      edgePositions.value.x = Math.max(edgePositions.value.x, positionX + widthOnWeb + 9000 + LEFT_OFFSET);
      edgePositions.value.y = Math.max(edgePositions.value.y, positionY + 9000 + TOP_OFFSET);
      edgePositions.value.xMob = Math.max(edgePositions.value.xMob, positionXMob + widthOnWebMob + 500 + LEFT_OFFSET);
      edgePositions.value.yMob = Math.max(edgePositions.value.yMob, positionYMob + 500 + TOP_OFFSET);

      const newPiece = new Piece({
        id: sys.id,
        sys: {
          id: pieceData.sys.id,
          version: pieceData.sys.version
        },
        name,
        topic,
        technique,
        techniqueDescription,
        created: new Date(created),
        image: {
          id: image.sys.id,
          url: image.url,
          lastUpdated: new Date(image.sys.publishedAt).getTime()
        },
        sizeInCm: {
          x: sizeInCmXHorizontal,
          y: sizeInCmYVertical
        },
        sizeInPx: {
          x: sizeInPxX,
          y: sizeInPxY
        },
        sizeOnWeb: {
          width: widthOnWeb,
          widthMob: widthOnWebMob
        },
        position: {
          x: positionX,
          y: positionY,
          deg: positionDeg,
          xMob: positionXMob,
          yMob: positionYMob,
          degMob: positionDegMob
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

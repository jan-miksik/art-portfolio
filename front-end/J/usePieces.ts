import Piece from '~/models/Piece'
import useContentful from '~/api/useContentful'


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
      } = pieceData

      edgePositions.value.x = Math.max(edgePositions.value.x, positionX + widthOnWeb + 3000);
      edgePositions.value.y = Math.max(edgePositions.value.y, positionY + 2000);
      edgePositions.value.xMob = Math.max(edgePositions.value.xMob, positionXMob + widthOnWebMob + 500);
      edgePositions.value.yMob = Math.max(edgePositions.value.yMob, positionYMob + 500);

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
        isUploadedToCf: true
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

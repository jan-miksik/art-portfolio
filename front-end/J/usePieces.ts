import piecesData, { Topics } from '~/components/piecesData'
import Piece from '~/models/Piece'
import useContentful from '~/api/useContentful'

// const piecesNodeAvatars = ref<Piece[] | undefined>()
// const piecesSansTopic = ref<Piece[] | undefined>()
// const piecesGeometry = ref<Piece[] | undefined>()
// const piecesPuzzle = ref<Piece[] | undefined>()

const pieces = ref<Piece[] | undefined>([])
// const mapOfImagesInSelectedTopic = ref()
const zIndexOfLastSelectedPiece = ref(10)
const edgePositions = ref({
  x: 0,
  y: 0,
  xMob: 0,
  yMob: 0
})

// piecesNodeAvatars.value = piecesData.NODE_AVATARS.map(
//   (pieceData: any) => new Piece(pieceData)
// )
// piecesSansTopic.value = piecesData.SANS_TOPIC.map(
//   (pieceData: any) => new Piece(pieceData)
// )
// piecesGeometry.value = piecesData.GEOMETRY.map(
//   (pieceData: any) => new Piece(pieceData)
// )
// piecesPuzzle.value = piecesData.PUZZLE.map(
//   (pieceData: any) => new Piece(pieceData)
// )

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

      edgePositions.value.x = Math.max(edgePositions.value.x, positionX + widthOnWeb + 1000);
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
      // switch (newPiece.topic) {
      //   case Topics.NODE_AVATARS:
      //     piecesNodeAvatars.value?.push(newPiece)
      //     break
      //   case Topics.SANS_TOPIC:
      //     piecesSansTopic.value?.push(newPiece)
      //     break
      //   case Topics.GEOMETRY:
      //     piecesGeometry.value?.push(newPiece)
      //     break
      // }
    })
  }

  return {
    // piecesNodeAvatars,
    // piecesSansTopic,
    // piecesPuzzle,
    mergeContentfulDataWithLocalData,
    pieces,
    edgePositions,
    // piecesGeometry,
    // mapOfImagesInSelectedTopic,
    zIndexOfLastSelectedPiece
  }
}

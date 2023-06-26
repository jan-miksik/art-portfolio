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
    console.log('contentfulData: ', contentfulData);
    contentfulData.value.forEach((pieceData: any) => {
      const {
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

      const newPiece = new Piece({
        id: pieceData.sys.id,
        name,
        topic,
        technique,
        techniqueDescription,
        created: new Date(created),
        image: {
          id: pieceData.sys.id,
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
    // piecesGeometry,
    // mapOfImagesInSelectedTopic,
    zIndexOfLastSelectedPiece
  }
}

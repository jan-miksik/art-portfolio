import { piecesData, Topics } from '@/components/piecesData'
import Piece from '@/models/Piece'
import { ref } from 'vue'
import useContentful from '@/api/useContentful'

const piecesNodeAvatars = ref<Piece[] | undefined>()
const piecesSansTopic = ref<Piece[] | undefined>()
const piecesGeometry = ref<Piece[] | undefined>()

const addRandomlyEmptySpacesIntoArray = (array: Piece[]) => {
  array.forEach((piece, index) => {
    const isAddEmptySpace = Math.floor(Math.random() * 10) >= 3
    const randomIndex = Math.floor(Math.random() * array.length)
    if (isAddEmptySpace) {
      array.splice(randomIndex, 0, '' as any)
    }
  })

  return array
}

export default function usePieces() {
  const nodeAvatars = piecesData.NODE_AVATARS.map(
    (pieceData: any) => new Piece(pieceData)
  )

  piecesNodeAvatars.value = addRandomlyEmptySpacesIntoArray(nodeAvatars)

  const sansTopic = piecesData.SANS_TOPIC.map(
    (pieceData: any) => new Piece(pieceData)
  )
  piecesSansTopic.value = addRandomlyEmptySpacesIntoArray(sansTopic)

  const geometry = piecesData.GEOMETRY.map(
    (pieceData: any) => new Piece(pieceData)
  )
  piecesGeometry.value = addRandomlyEmptySpacesIntoArray(geometry)

  const mergeContentfulDataWithLocalData = async () => {
    const { contentfulData } = useContentful()
    console.log('contentfulData: ', contentfulData)
    contentfulData.value.forEach((pieceData: any) => {
      const {
        name,
        topic,
        technique,
        techniqueDescription,
        created,
        sizeInCmXHorizontal,
        sizeInCmYVertical,
        image
      } = pieceData

      const newPiece = new Piece({
        id: pieceData.sys.id,
        name,
        topic,
        technique,
        techniqueDescription,
        created: new Date(created),
        image: {
          url: image.url,
          lastUpdated: new Date(image.sys.publishedAt).getTime()
        },
        sizeInCm: {
          x: sizeInCmXHorizontal,
          y: sizeInCmYVertical
        }
      })
      switch (newPiece.topic) {
        case Topics.NODE_AVATARS:
          piecesNodeAvatars.value?.push(newPiece)
          break
        case Topics.SANS_TOPIC:
          piecesSansTopic.value?.push(newPiece)
          break
        case Topics.GEOMETRY:
          piecesGeometry.value?.push(newPiece)
          break
      }
    })
  }

  return {
    piecesNodeAvatars,
    piecesSansTopic,
    mergeContentfulDataWithLocalData,
    piecesGeometry
  }
}

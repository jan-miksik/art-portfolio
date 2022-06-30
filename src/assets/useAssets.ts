import { piecesData, Topics } from '@/components/piecesData'
import Piece from '@/models/Piece'
import { ref } from 'vue'
import useContentful from '@/api/useContentful'

const piecesNodeAvatars = ref<Piece[] | undefined>()
const piecesSansTopic = ref<Piece[] | undefined>()
const piecesGeometry = ref<Piece[] | undefined>()

export default function useAssets() {
  piecesNodeAvatars.value = piecesData.NODE_AVATARS.map(
    (pieceData: any) => new Piece(pieceData)
  )

  piecesSansTopic.value = piecesData.SANS_TOPIC.map(
    (pieceData: any) => new Piece(pieceData)
  )

  piecesGeometry.value = piecesData.GEOMETRY.map(
    (pieceData: any) => new Piece(pieceData)
  )

  const mergeContentfulDataWithLocalData = async () => {
    const { contentfulData } = useContentful()
    contentfulData.value.forEach((pieceData: any) => {
      const {
        name,
        topic,
        technique,
        techniqueDescription,
        created,
        sizeInCmXHorizontal,
        sizeInCmYVertical
      } = pieceData

      const newPiece = new Piece({
        id: pieceData.sys.id,
        name,
        topic,
        technique,
        techniqueDescription,
        created: new Date(created),
        image: pieceData.image.url,
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

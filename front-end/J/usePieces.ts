import piecesData, { Topics } from '~/components/piecesData'
import Piece from '~/models/Piece'
import useContentful from '~/api/useContentful'

const piecesNodeAvatars = ref<Piece[] | undefined>()
const piecesSansTopic = ref<Piece[] | undefined>()
const piecesGeometry = ref<Piece[] | undefined>()
const piecesPuzzle = ref<Piece[] | undefined>()

const addRandomlyEmptySpacesIntoArray = (array: Piece[]) => {
  array.forEach((piece, index) => {
    const isAddEmptySpace = Math.floor(Math.random() * 10) >= 2
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

  const puzzle = piecesData.PUZZLE.map(
    (pieceData: any) => new Piece(pieceData)
  )
  piecesPuzzle.value = addRandomlyEmptySpacesIntoArray(puzzle)

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
          id: pieceData.sys.id,
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
          const isAddEmptySpace = Math.floor(Math.random() * 10) >= 3
          if(isAddEmptySpace) piecesNodeAvatars.value?.push('' as any)
          const isMultipleSpace = Math.floor(Math.random() * 10) >= 2
          if(isMultipleSpace) break
          const isAddEmptySpace2 = Math.floor(Math.random() * 10) >= 5
          if(isAddEmptySpace2) piecesNodeAvatars.value?.push('' as any)
          const isAddEmptySpace3 = Math.floor(Math.random() * 10) >= 3
          if(isAddEmptySpace3) piecesNodeAvatars.value?.push('' as any)
          break
        case Topics.SANS_TOPIC:
          piecesSansTopic.value?.push(newPiece)
          const isAddEmptySpaceA = Math.floor(Math.random() * 10) >= 3
          if(isAddEmptySpaceA) piecesSansTopic.value?.push('' as any)
          const isMultipleSpaceA = Math.floor(Math.random() * 10) >= 3
          if(isMultipleSpaceA) break
          const isAddEmptySpace2A = Math.floor(Math.random() * 10) >= 4
          if(isAddEmptySpace2A) piecesSansTopic.value?.push('' as any)
          const isAddEmptySpace3A = Math.floor(Math.random() * 10) >= 5
          if(isAddEmptySpace3A) piecesSansTopic.value?.push('' as any)
          break
        case Topics.GEOMETRY:
          piecesGeometry.value?.push(newPiece)
          const isAddEmptySpaceB = Math.floor(Math.random() * 10) >= 3
          if(isAddEmptySpaceB) piecesGeometry.value?.push('' as any)
          const isMultipleSpaceB = Math.floor(Math.random() * 10) >= 3
          if(isMultipleSpaceB) break
          const isAddEmptySpace2B = Math.floor(Math.random() * 10) >= 4
          if(isAddEmptySpace2B) piecesGeometry.value?.push('' as any)
          const isAddEmptySpace3B = Math.floor(Math.random() * 10) >= 5
          if(isAddEmptySpace3B) piecesGeometry.value?.push('' as any)
          break
      }
    })
  }

  return {
    piecesNodeAvatars,
    piecesSansTopic,
    piecesPuzzle,
    mergeContentfulDataWithLocalData,
    piecesGeometry
  }
}

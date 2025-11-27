/**
 * Shared utility for building Contentful piece fields
 * Used by both upload and update endpoints to avoid code duplication
 */
import type { ContentfulPieceFields } from '~/types/contentful-api'

interface PieceData {
  name?: string
  topic?: string
  technique?: string
  techniqueDescription?: string
  created?: string
  sizeInCm?: {
    x?: number
    y?: number
  }
  sizeInPx?: {
    x?: number
    y?: number
  }
  sizeOnWeb?: {
    width?: number
    widthMob?: number
  }
  position?: {
    x?: number
    y?: number
    deg?: number
    xMob?: number
    yMob?: number
    degMob?: number
  }
  isMoveableInPublic?: boolean
  isArchived?: boolean
}

/**
 * Builds Contentful piece fields from piece data
 * @param piece - The piece data to convert
 * @param imageAssetId - Optional image asset ID to link
 * @returns Contentful piece fields object
 */
export const buildPieceFields = (
  piece: PieceData,
  imageAssetId?: string
): ContentfulPieceFields => {
  const fields: ContentfulPieceFields = {
    name: {
      'en-US': piece.name || 'untitled'
    },
    topic: {
      'en-US': piece.topic || 'anything'
    },
    technique: {
      'en-US': piece.technique || ''
    },
    techniqueDescription: {
      'en-US': piece.techniqueDescription || 'unspecified'
    },
    created: {
      'en-US': piece.created || new Date(100, 0).toISOString()
    },
    sizeInCmXHorizontal: {
      'en-US': Math.floor(piece.sizeInCm?.x || 0)
    },
    sizeInCmYVertical: {
      'en-US': Math.floor(piece.sizeInCm?.y || 0)
    },
    sizeInPxX: {
      'en-US': Math.floor(piece.sizeInPx?.x || 0)
    },
    sizeInPxY: {
      'en-US': Math.floor(piece.sizeInPx?.y || 0)
    },
    widthOnWeb: {
      'en-US': Math.floor(piece.sizeOnWeb?.width || 0)
    },
    positionX: {
      'en-US': Math.floor(piece.position?.x || 0)
    },
    positionY: {
      'en-US': Math.floor(piece.position?.y || 0)
    },
    positionDeg: {
      'en-US': Math.floor(piece.position?.deg || 0)
    },
    widthOnWebMob: {
      'en-US': Math.floor(piece.sizeOnWeb?.widthMob || 0)
    },
    positionXMob: {
      'en-US': Math.floor(piece.position?.xMob || 0)
    },
    positionYMob: {
      'en-US': Math.floor(piece.position?.yMob || 0)
    },
    positionDegMob: {
      'en-US': Math.floor(piece.position?.degMob || 0)
    },
    isMoveableInPublic: {
      'en-US': piece.isMoveableInPublic || false
    },
    isArchived: {
      'en-US': piece.isArchived || false
    }
  }

  // Include image field if imageAssetId is provided preserves the image link
  if (imageAssetId) {
    fields.image = {
      'en-US': {
        sys: {
          type: 'Link',
          linkType: 'Asset',
          id: imageAssetId
        }
      }
    }
  }

  return fields
}


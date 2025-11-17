/**
 * Type definitions for Contentful GraphQL API responses
 */

export interface ContentfulSys {
  id: string
  version?: number
  publishedAt?: string
}

export interface ContentfulImage {
  sys: {
    id: string
    publishedAt?: string
  }
  fileName?: string
  url: string
}

export interface ContentfulPieceItem {
  sys: {
    id: string
    version?: number
  }
  name: string
  image: ContentfulImage | null
  topic: string
  technique: string
  techniqueDescription: string
  created: string
  sizeInCmXHorizontal?: number
  sizeInCmYVertical?: number
  sizeInPxX?: number
  sizeInPxY?: number
  widthOnWeb?: number
  widthOnWebMob?: number
  positionX?: number
  positionY?: number
  positionDeg?: number
  positionXMob?: number
  positionYMob?: number
  positionDegMob?: number
  isMoveableInPublic?: boolean
  isArchived?: boolean
}

export interface ContentfulPieceCollection {
  items: ContentfulPieceItem[]
}

export interface ContentfulGraphQLResponse {
  data: {
    pieceCollection: ContentfulPieceCollection
  }
}


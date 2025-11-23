/**
 * TypeScript interfaces for Contentful Management API responses
 * These types ensure type safety when interacting with Contentful's API
 */

/**
 * Base system properties that appear in all Contentful resources
 */
export interface ContentfulSys {
  id: string
  type: string
  version?: number
  createdAt?: string
  updatedAt?: string
  publishedVersion?: number
  publishedAt?: string
}

/**
 * Contentful Link type for referencing other resources
 */
export interface ContentfulLink {
  sys: {
    type: 'Link'
    linkType: 'Asset' | 'Entry' | 'Upload' | 'Environment'
    id: string
  }
}

/**
 * Contentful Upload response
 */
export interface ContentfulUploadResponse {
  sys: ContentfulSys & {
    type: 'Upload'
  }
}

/**
 * Contentful Asset file information
 */
export interface ContentfulAssetFile {
  contentType: string
  fileName: string
  url?: string
  uploadFrom?: ContentfulLink
  details?: {
    size: number
    image?: {
      width: number
      height: number
    }
  }
}

/**
 * Contentful Asset fields
 */
export interface ContentfulAssetFields {
  title: {
    'en-US': string
  }
  file: {
    'en-US': ContentfulAssetFile
  }
}

/**
 * Contentful Asset response
 */
export interface ContentfulAssetResponse {
  sys: ContentfulSys & {
    type: 'Asset'
  }
  fields: ContentfulAssetFields
}

/**
 * Contentful Entry fields (for Piece content type)
 */
export interface ContentfulPieceFields {
  name: {
    'en-US': string
  }
  image?: {
    'en-US': ContentfulLink
  }
  topic: {
    'en-US': string
  }
  technique: {
    'en-US': string
  }
  techniqueDescription: {
    'en-US': string
  }
  created: {
    'en-US': string
  }
  sizeInCmXHorizontal: {
    'en-US': number
  }
  sizeInCmYVertical: {
    'en-US': number
  }
  sizeInPxX: {
    'en-US': number
  }
  sizeInPxY: {
    'en-US': number
  }
  widthOnWeb: {
    'en-US': number
  }
  positionX: {
    'en-US': number
  }
  positionY: {
    'en-US': number
  }
  positionDeg: {
    'en-US': number
  }
  widthOnWebMob: {
    'en-US': number
  }
  positionXMob: {
    'en-US': number
  }
  positionYMob: {
    'en-US': number
  }
  positionDegMob: {
    'en-US': number
  }
  isMoveableInPublic: {
    'en-US': boolean
  }
  isArchived: {
    'en-US': boolean
  }
}

/**
 * Contentful Entry response
 */
export interface ContentfulEntryResponse {
  sys: ContentfulSys & {
    type: 'Entry'
    contentType?: {
      sys: ContentfulLink
    }
  }
  fields: ContentfulPieceFields
}

/**
 * Contentful error response structure
 */
export interface ContentfulErrorResponse {
  sys?: {
    id: string
    type: string
  }
  message?: string
  details?: {
    errors?: Array<{
      name: string
      path: string[]
      details: string
      value?: unknown
    }>
  }
}

/**
 * HTTP error with Contentful-specific structure
 */
export interface ContentfulHttpError {
  response?: {
    status: number
    statusText?: string
    data?: ContentfulErrorResponse
  }
  statusCode?: number
  statusMessage?: string
  data?: ContentfulErrorResponse
  message?: string
}

/**
 * Response from get-entry endpoint
 */
export interface GetEntryResponse {
  id: string
  version?: number
  publishedVersion?: number
  entry: ContentfulEntryResponse
}

/**
 * Response from delete-entry endpoint
 */
export interface DeleteEntryResponse {
  success: boolean
  data: ContentfulEntryResponse | null
}


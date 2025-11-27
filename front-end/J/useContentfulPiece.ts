import Piece from '~/models/Piece'
import { logger } from '~/utils/logger'
import useContentfulEntry from '~/J/useContentfulEntry'
import { createAppError, ErrorCode } from '~/utils/errorHandler'
import type {
  ContentfulAssetResponse,
  ContentfulEntryResponse
} from '~/types/contentful-api'

/**
 * 
 * All write operations use server-side API routes to keep the Management API token secure.
 * The Management API token is secured using Nuxt's runtimeConfig (server-only) and
 * is never exposed to the client.
 * 
 * Server routes:
 * - /server/api/contentful/upload-and-process-image.post.ts
 * - /server/api/contentful/upload-piece.post.ts
 * - /server/api/contentful/update-piece.put.ts
 * - /server/api/contentful/publish-entry.post.ts
 * - /server/api/contentful/delete-entry.delete.ts
 * - /server/api/contentful/get-entry.get.ts
 */

export default function useContentfulPiece() {
  const { ensureVersion } = useContentfulEntry()
  const uploadAndPublishImage = async (imageRaw: File): Promise<ContentfulAssetResponse> => {
    try {
      const formData = new FormData()
      formData.append('image', imageRaw)
      
      const response = await $fetch<ContentfulAssetResponse>('/api/contentful/upload-and-process-image', {
        method: 'POST',
        body: formData
      })
      
      logger.log('Image uploaded and processed via server route')
      return response
    } catch (error) {
      logger.log('Error uploading image: ', error)
      throw createAppError(
        error,
        'uploadAndPublishImage',
        ErrorCode.CONTENTFUL_UPLOAD_FAILED,
        { fileName: imageRaw.name }
      )
    }
  }

  const uploadPiece = async (piece: Piece): Promise<ContentfulEntryResponse | void> => {
    if (!piece.imageRaw) return
    logger.log(':::uploading started... ')
    const imageResponse = await uploadAndPublishImage(piece.imageRaw)
    logger.log('-- asset Response --: ', imageResponse, imageResponse?.sys.id);
    const imageName = piece.imageRaw.name.substring(0, piece.imageRaw.name.lastIndexOf('.'))
    
    try {
      const response = await $fetch<ContentfulEntryResponse>('/api/contentful/upload-piece', {
        method: 'POST',
        body: {
          piece: {
            name: imageName,
            topic: piece.topic,
            technique: piece.technique,
            techniqueDescription: piece.techniqueDescription,
            created: piece.created,
            sizeInCm: piece.sizeInCm,
            sizeInPx: piece.sizeInPx,
            sizeOnWeb: piece.sizeOnWeb,
            position: piece.position,
            isMoveableInPublic: piece.isMoveableInPublic,
            isArchived: piece.isArchived
          },
          imageAssetId: imageResponse.sys.id
        }
      })
      logger.log('Piece uploaded via server route as draft')
      
      // Update piece with response data
      piece.sys = {
        id: response.sys.id,
        version: response.sys.version || 0
      }
      piece.isUpdated = true
      piece.isUploadedToCf = true
      piece.image.id = imageResponse.sys.id

      logger.log('Piece successfully uploaded', piece, response)
      return response
    } catch (error) {
      throw createAppError(
        error,
        'uploadPiece',
        ErrorCode.CONTENTFUL_UPLOAD_FAILED,
        { pieceId: piece.id, pieceName: piece.name }
      )
    }
  }

  const updatePiece = async (piece: Piece) => {
    try {
      // Ensure we have a valid version (fetch if missing)
      const version = await ensureVersion(piece)
      if (!version) {
        throw new Error(`Cannot update piece "${piece.name}": Unable to fetch current version from Contentful`)
      }

      const response = await $fetch<ContentfulEntryResponse>('/api/contentful/update-piece', {
        method: 'PUT',
        body: {
          entryId: piece.sys.id,
          version: version,
          piece: {
            name: piece.name,
            topic: piece.topic,
            technique: piece.technique,
            techniqueDescription: piece.techniqueDescription,
            created: piece.created,
            sizeInCm: piece.sizeInCm,
            sizeInPx: piece.sizeInPx,
            sizeOnWeb: piece.sizeOnWeb,
            position: piece.position,
            isMoveableInPublic: piece.isMoveableInPublic,
            isArchived: piece.isArchived
          },
          imageAssetId: piece.image.id // Preserve the image link
        }
      })
      logger.log('Piece updated via server route')
      piece.sys.version = response.sys.version || 0
      piece.isUpdated = true
      return response
    } catch (error) {
      throw createAppError(
        error,
        'updatePiece',
        ErrorCode.CONTENTFUL_UPDATE_FAILED,
        { pieceId: piece.sys.id, pieceName: piece.name }
      )
    }
  }

  const updateAndPublishPiece = async (piece: Piece) => {
    try {
      await updatePiece(piece)
      
      // Ensure version is still valid after update (should be, but double-check)
      const version = await ensureVersion(piece)
      if (!version) {
        throw new Error(`Cannot publish piece "${piece.name}": Unable to fetch current version from Contentful`)
      }

      const response = await $fetch<ContentfulEntryResponse>('/api/contentful/publish-entry', {
        method: 'POST',
        body: {
          entryId: piece.sys.id,
          version: version
        }
      })
      piece.isPublished = true
      piece.sys.version = response.sys.version || 0
      logger.log(`Piece ${piece.name} published via server route!`)
    } catch (error) {
      throw createAppError(
        error,
        'updateAndPublishPiece',
        ErrorCode.CONTENTFUL_PUBLISH_FAILED,
        { pieceId: piece.sys.id, pieceName: piece.name }
      )
    }
  }

  const removePiece = async (piece: Piece) => {
    try {
      // Ensure we have a valid version (fetch if missing)
      const version = await ensureVersion(piece)
      if (!version) {
        throw new Error(`Cannot remove piece "${piece.name}": Unable to fetch current version from Contentful`)
      }

      await $fetch('/api/contentful/delete-entry', {
        method: 'DELETE',
        query: {
          id: piece.sys.id,
          version: version
        }
      })
      logger.log(`Entry ${piece.sys.id}: ${piece.name} deleted via server route.`)
    } catch (error) {
      throw createAppError(
        error,
        'removePiece',
        ErrorCode.CONTENTFUL_DELETE_FAILED,
        { pieceId: piece.sys.id, pieceName: piece.name }
      )
    }
  }


  return {
    uploadPiece,
    removePiece,
    updateAndPublishPiece
  }
}

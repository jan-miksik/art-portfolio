import Piece from '~/models/Piece'
import type { AxiosResponse } from 'axios'
import { logger } from '~/utils/logger'
import useContentfulEntry from '~/J/useContentfulEntry'

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
  const uploadAndPublishImage = async (imageRaw: File) => {
    try {
      const formData = new FormData()
      formData.append('image', imageRaw)
      
      const response = await $fetch('/api/contentful/upload-and-process-image', {
        method: 'POST',
        body: formData
      })
      
      logger.log('Image uploaded and processed via server route')
      return { data: response } as AxiosResponse
    } catch (error) {
      logger.error('Error uploading via server route:', error)
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const uploadPiece = async (piece: Piece) => {
    if (!piece.imageRaw) return
    logger.log(':::uploading started... ')
    const imageResponse = await uploadAndPublishImage(piece.imageRaw)
    logger.log('-- asset Response --: ', imageResponse, imageResponse?.data.sys.id);
    const imageName = piece.imageRaw.name.substring(0, piece.imageRaw.name.lastIndexOf('.'))
    
    try {
      const response = await $fetch('/api/contentful/upload-piece', {
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
          imageAssetId: imageResponse?.data.sys.id
        }
      })
      logger.log('Piece uploaded via server route as draft')
      
      // Update piece with response data
      piece.sys = {
        id: response.sys.id,
        version: response.sys.version
      }
      piece.isUpdated = true
      piece.isUploadedToCf = true
      piece.image.id = imageResponse?.data.sys.id

      logger.log('Piece successfully uploaded', piece, response)
      return response
    } catch (error) {
      logger.error('Error uploading piece via server route:', error)
      throw new Error(`Failed to upload piece: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const updatePiece = async (piece: Piece) => {
    try {
      // Ensure we have a valid version (fetch if missing)
      const version = await ensureVersion(piece)
      if (!version) {
        throw new Error(`Cannot update piece "${piece.name}": Unable to fetch current version from Contentful`)
      }

      const response = await $fetch<{ sys: { version: number } }>('/api/contentful/update-piece', {
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
      piece.sys.version = response.sys.version
      piece.isUpdated = true
      return response
    } catch (error) {
      logger.error('Error updating piece via server route:', error)
      throw new Error(`Failed to update piece: ${error instanceof Error ? error.message : 'Unknown error'}`)
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

      const response = await $fetch<{ sys: { version: number } }>('/api/contentful/publish-entry', {
        method: 'POST',
        body: {
          entryId: piece.sys.id,
          version: version
        }
      })
      piece.isPublished = true
      piece.sys.version = response.sys.version
      logger.log(`Piece ${piece.name} published via server route!`)
    } catch (error) {
      logger.error('error publishPiece', error)
      throw new Error(`Failed to publish piece: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
      logger.error('Error removing piece via server route:', error)
      throw new Error(`Failed to remove piece: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }


  return {
    uploadPiece,
    removePiece,
    updateAndPublishPiece
  }
}

import { logger } from '~/utils/logger'

/**
 * Composable for fetching Contentful entry information via Management API
 * Useful for getting current version when GraphQL API doesn't provide it
 */
export default function useContentfulEntry() {
  /**
   * Fetches the current version of a Contentful entry
   * @param entryId - The Contentful entry ID
   * @returns The current version number, or null if entry not found
   */
  const getEntryVersion = async (entryId: string): Promise<number | null> => {
    if (!entryId) {
      logger.error('getEntryVersion: Missing entry ID')
      return null
    }

    try {
      // Use GET (semantically correct for read-only operation)
      const response = await $fetch<{
        id: string
        version: number
        publishedVersion?: number
      }>('/api/contentful/get-entry', {
        method: 'GET',
        query: {
          id: entryId
        }
      })

      logger.log(`Fetched version ${response.version} for entry ${entryId}`)
      return response.version
    } catch (error) {
      logger.error(`Error fetching entry version for ${entryId}:`, error)
      return null
    }
  }

  /**
   * Fetches the full entry data from Contentful
   * @param entryId - The Contentful entry ID
   * @returns The entry data with sys information, or null if not found
   */
  const getEntry = async (entryId: string) => {
    if (!entryId) {
      logger.error('getEntry: Missing entry ID')
      return null
    }

    try {
      // Use GET (semantically correct for read-only operation)
      const response = await $fetch<{
        id: string
        version: number
        publishedVersion?: number
        entry: any
      }>('/api/contentful/get-entry', {
        method: 'GET',
        query: {
          id: entryId
        }
      })

      return response
    } catch (error) {
      logger.error(`Error fetching entry ${entryId}:`, error)
      return null
    }
  }

  /**
   * Ensures a piece has a valid version, fetching it if necessary
   * @param piece - The piece object (must have sys.id)
   * @returns The version number, or null if unable to fetch
   */
  const ensureVersion = async (piece: { sys?: { id?: string; version?: number } }): Promise<number | null> => {
    if (!piece.sys?.id) {
      logger.error('ensureVersion: Piece missing sys.id')
      return null
    }

    // If version exists and is valid (>= 1), return it
    if (piece.sys.version && piece.sys.version >= 1) {
      return piece.sys.version
    }

    // Otherwise, fetch the current version
    logger.log(`Version missing or invalid for entry ${piece.sys.id}, fetching current version...`)
    const version = await getEntryVersion(piece.sys.id)
    
    if (version !== null && piece.sys) {
      piece.sys.version = version
    }

    return version
  }

  return {
    getEntryVersion,
    getEntry,
    ensureVersion
  }
}


import { ref } from 'vue'
import type { ContentfulPieceItem } from '~/types/contentful'
import { logger } from '~/utils/logger'

const contentfulData = ref<ContentfulPieceItem[]>([])

/**
 * Contentful Content Delivery API (CDA) - Read-only access
 * 
 * SECURITY NOTE: This uses VITE_CONTENTFUL_ACCESS_TOKEN which is a Content Delivery API token.
 * This token is safe to expose in client-side code as it only provides read-only access
 * to published content via the GraphQL API.
 * 
 * ⚠️ IMPORTANT: Ensure this is a Content Delivery API token, NOT a Management API token.
 */
export default function useContentful() {
  const fetchContentfulData = async () => {
    const query = `{
      pieceCollection(limit: 500) {
        items {
          sys {
            id
          }
          name
          image {
            sys {
              publishedAt
              id
            }
            fileName
            url
          }
          topic
          technique
          techniqueDescription
          created
          sizeInCmXHorizontal
          sizeInCmYVertical
          sizeInPxX
          sizeInPxY
          widthOnWeb
          positionX
          positionY
          positionDeg
          widthOnWebMob
          positionXMob
          positionYMob
          positionDegMob
          isMoveableInPublic
          isArchived
        }
      }
    }`

    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${
      import.meta.env.VITE_CONTENTFUL_SPACE_ID
    }`

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }

    try {
      const response = await fetch(fetchUrl, fetchOptions)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const JSONResponse = await response.json()
      
      if (!JSONResponse?.data?.pieceCollection?.items) {
        throw new Error('Invalid response structure from Contentful')
      }
      
      contentfulData.value = JSONResponse.data.pieceCollection.items
    } catch (error) {
      logger.error('error fetchContentfulData', error)
      throw new Error('Could not receive the data from Contentful!')
    }
  }

  return {
    contentfulData,
    fetchContentfulData
  }
}

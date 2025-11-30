/**
 * Server-side API route for deleting entries in Contentful
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 * 
 * SECURITY NOTE: This endpoint is protected by Cloudflare Access in production.
 * In other environments, ensure equivalent authentication is configured before deployment.
 */
import type {
  ContentfulEntryResponse,
  ContentfulHttpError,
  DeleteEntryResponse
} from '~/types/contentful-api'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const contentfulSpaceId = config.contentfulSpaceId
  const contentfulManagementToken = config.contentfulManagementToken

  if (!contentfulSpaceId || !contentfulManagementToken) {
    throw createError({
      statusCode: 500,
      message: 'Contentful configuration missing'
    })
  }

  const query = getQuery(event)
  const entryId = query.id as string

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID'
    })
  }

  try {
    // First unpublish if published
    try {
      const entryResponse = await $fetch<ContentfulEntryResponse>(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${contentfulManagementToken}`
          }
        }
      )

      if (entryResponse.sys.publishedVersion) {
        await $fetch(
          `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${contentfulManagementToken}`,
              'X-Contentful-Version': String(entryResponse.sys.version)
            }
          }
        )
      }
    } catch (error) {
      // Entry might not be published, continue with deletion
    }

    // Delete the entry
    const response = await $fetch<ContentfulEntryResponse | null>(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${contentfulManagementToken}`,
          'X-Contentful-Version': String(query.version ? Number(query.version) : 1)
        }
      }
    )

    return { success: true, data: response } satisfies DeleteEntryResponse
  } catch (error: unknown) {
    const httpError = error as ContentfulHttpError
    const status = httpError.response?.status || httpError.statusCode || 500
    const msg = httpError.data?.message || httpError.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to delete entry: ${msg}`
    })
  }
})


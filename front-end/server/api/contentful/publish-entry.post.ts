/**
 * Server-side API route for publishing entries in Contentful
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 * 
 * SECURITY NOTE: This endpoint is protected by Cloudflare Access in production.
 * In other environments, ensure equivalent authentication is configured before deployment.
 */
import type {
  ContentfulEntryResponse,
  ContentfulHttpError
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

  const body = await readBody(event)
  const { entryId, version } = body

  if (!entryId || !version) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID or version'
    })
  }

  try {
    const response = await $fetch<ContentfulEntryResponse>(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
      {
        method: 'PUT',
        body: {},
        headers: {
          Authorization: `Bearer ${contentfulManagementToken}`,
          'X-Contentful-Version': String(version)
        }
      }
    )

    return response
  } catch (error: unknown) {
    const httpError = error as ContentfulHttpError
    const status = httpError.response?.status || httpError.statusCode || 500
    const msg = httpError.data?.message || httpError.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to publish entry: ${msg}`
    })
  }
})


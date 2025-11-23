/**
 * Server-side API route for fetching a Contentful entry
 * Uses $fetch instead of axios for Cloudflare compatibility
 * Supports both GET (preferred) and POST (fallback for Cloudflare)
 */
import type {
  ContentfulEntryResponse,
  ContentfulHttpError,
  GetEntryResponse
} from '~/types/contentful-api'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET' && event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: `Method ${event.method} not allowed. Use GET or POST.`
    })
  }

  const config = useRuntimeConfig()

  if (!config.contentfulSpaceId || !config.contentfulManagementToken) {
    console.error('Contentful Config Missing on Server')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error'
    })
  }

  // Determine entry ID based on method
  let entryId: string | undefined
  if (event.method === 'POST') {
    const body = await readBody(event).catch(() => ({}))
    const query = getQuery(event)
    entryId = body?.id || (query.id as string | undefined)
  } else {
    const query = getQuery(event)
    entryId = query.id as string | undefined
  }

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID'
    })
  }

  try {
    const response = await $fetch<ContentfulEntryResponse>(
      `https://api.contentful.com/spaces/${config.contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.contentfulManagementToken}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
      }
    )

    // Prevent Cloudflare and browsers from caching this response
    setHeader(event, 'Cache-Control', 'no-store, no-cache, must-revalidate, private')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')

    const result: GetEntryResponse = {
      id: response.sys.id,
      version: response.sys.version ?? 0,
      publishedVersion: response.sys.publishedVersion,
      entry: response
    }
    return result
  } catch (error: unknown) {
    const httpError = error as ContentfulHttpError
    const status = httpError.response?.status || httpError.statusCode || 500
    const msg = httpError.data?.message || httpError.message || 'Unknown error'

    throw createError({
      statusCode: status,
      message: `Failed to fetch entry: ${msg}`
    })
  }
})



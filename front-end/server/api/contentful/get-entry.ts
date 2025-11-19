import axios from 'axios'

/**
 * Server-side API route for fetching a Contentful entry
 * This keeps the Management API token secure on the server
 * Returns the entry with its current version
 * 
 * Supports both GET and POST methods for Cloudflare Pages compatibility
 */
export default defineEventHandler(async (event) => {
  // Support both GET and POST methods (POST for Cloudflare compatibility)
  if (event.method !== 'GET' && event.method !== 'POST') {
    throw createError({
      statusCode: 405,
      message: `Method ${event.method} not allowed. Use GET or POST.`
    })
  }

  const config = useRuntimeConfig()
  const contentfulSpaceId = config.contentfulSpaceId
  const contentfulCmt = config.contentfulManagementToken

  if (!contentfulSpaceId || !contentfulCmt) {
    throw createError({
      statusCode: 500,
      message: 'Contentful configuration missing'
    })
  }

  // For GET, read from query params; for POST, read from body
  let entryId: string | undefined
  
  if (event.method === 'POST') {
    const body = await readBody(event).catch(() => ({}))
    entryId = body.id || (getQuery(event).id as string)
  } else {
    const query = getQuery(event)
    entryId = query.id as string
  }

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID'
    })
  }

  try {
    const response = await axios.get(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`
        }
      }
    )

    return {
      id: response.data.sys.id,
      version: response.data.sys.version,
      publishedVersion: response.data.sys.publishedVersion,
      entry: response.data
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to fetch entry: ${error.message}`
    })
  }
})


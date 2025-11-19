/**
 * Server-side API route for fetching a Contentful entry
 * Uses $fetch instead of axios for Cloudflare compatibility
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Validate Configuration
  if (!config.contentfulSpaceId || !config.contentfulManagementToken) {
    console.error('Contentful Config Missing on Server')
    throw createError({
      statusCode: 500,
      message: 'Server configuration error'
    })
  }

  // Get ID from query (?id=...)
  const query = getQuery(event)
  const entryId = query.id as string

  if (!entryId) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID'
    })
  }

  try {
    // USE $fetch INSTEAD OF AXIOS
    const response: any = await $fetch(
      `https://api.contentful.com/spaces/${config.contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.contentfulManagementToken}`,
          // Optional: Content-Type is usually handled automatically, but good to be explicit
          'Content-Type': 'application/vnd.contentful.management.v1+json'
        }
      }
    )

    return {
      id: response.sys.id,
      version: response.sys.version,
      publishedVersion: response.sys.publishedVersion,
      entry: response
    }
  } catch (error: any) {
    // Check if it's a fetch error
    const status = error.response?.status || error.statusCode || 500
    const msg = error.data?.message || error.message || 'Unknown error'

    throw createError({
      statusCode: status,
      message: `Failed to fetch entry: ${msg}`
    })
  }
})


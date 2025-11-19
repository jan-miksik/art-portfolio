/**
 * Server-side API route for deleting entries in Contentful
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const contentfulSpaceId = config.contentfulSpaceId
  const contentfulCmt = config.contentfulManagementToken

  if (!contentfulSpaceId || !contentfulCmt) {
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
      const entryResponse: any = await $fetch(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${contentfulCmt}`
          }
        }
      )

      if (entryResponse.sys.publishedVersion) {
        await $fetch(
          `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${contentfulCmt}`,
              'X-Contentful-Version': String(entryResponse.sys.version)
            }
          }
        )
      }
    } catch (error) {
      // Entry might not be published, continue with deletion
    }

    // Delete the entry
    const response: any = await $fetch(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': String(query.version ? Number(query.version) : 1)
        }
      }
    )

    return { success: true, data: response }
  } catch (error: any) {
    const status = error.response?.status || error.statusCode || 500
    const msg = error.data?.message || error.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to delete entry: ${msg}`
    })
  }
})


import axios from 'axios'

/**
 * Server-side API route for deleting entries in Contentful
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
      const entryResponse = await axios.get(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`
          }
        }
      )

      if (entryResponse.data.sys.publishedVersion) {
        await axios.delete(
          `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
          {
            headers: {
              Authorization: `Bearer ${contentfulCmt}`,
              'X-Contentful-Version': entryResponse.data.sys.version
            }
          }
        )
      }
    } catch (error) {
      // Entry might not be published, continue with deletion
    }

    // Delete the entry
    const response = await axios.delete(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`,
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': query.version ? Number(query.version) : 1
        }
      }
    )

    return { success: true, data: response.data }
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to delete entry: ${error.message}`
    })
  }
})


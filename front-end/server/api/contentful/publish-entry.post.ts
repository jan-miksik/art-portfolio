import axios from 'axios'

/**
 * Server-side API route for publishing entries in Contentful
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

  const body = await readBody(event)
  const { entryId, version } = body

  if (!entryId || !version) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID or version'
    })
  }

  try {
    const response = await axios.put(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
      {},
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': version
        }
      }
    )

    return response.data
  } catch (error: any) {
    throw createError({
      statusCode: error.response?.status || 500,
      message: `Failed to publish entry: ${error.message}`
    })
  }
})


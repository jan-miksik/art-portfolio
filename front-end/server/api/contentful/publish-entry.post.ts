/**
 * Server-side API route for publishing entries in Contentful
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

  const body = await readBody(event)
  const { entryId, version } = body

  if (!entryId || !version) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID or version'
    })
  }

  try {
    const response: any = await $fetch(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}/published`,
      {
        method: 'PUT',
        body: {},
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': String(version)
        }
      }
    )

    return response
  } catch (error: any) {
    const status = error.response?.status || error.statusCode || 500
    const msg = error.data?.message || error.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to publish entry: ${msg}`
    })
  }
})


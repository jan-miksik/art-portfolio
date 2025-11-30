/**
 * Server-side API route for updating pieces in Contentful
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
import { buildPieceFields } from '~/server/utils/contentfulFields'

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
  const { entryId, version, piece, imageAssetId } = body

  if (!entryId || !version || !piece) {
    throw createError({
      statusCode: 400,
      message: 'Missing entry ID, version, or piece data'
    })
  }

  try {
    const apiUrl = `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${entryId}`

    const headers = {
      Authorization: `Bearer ${contentfulManagementToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Version': String(version)
    }

    const fields = buildPieceFields(piece, imageAssetId)
    const data = { fields }

    const response = await $fetch<ContentfulEntryResponse>(apiUrl, {
      method: 'PUT',
      headers,
      body: data
    })

    return response
  } catch (error: unknown) {
    const httpError = error as ContentfulHttpError
    const status = httpError.response?.status || httpError.statusCode || 500
    const msg = httpError.data?.message || httpError.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to update piece: ${msg}`
    })
  }
})


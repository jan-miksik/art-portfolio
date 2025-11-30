/**
 * Server-side API route for uploading pieces to Contentful
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 * 
 * All Management API operations are proxied through server routes
 * to prevent token exposure in client-side code.
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
  const { piece, imageAssetId } = body

  if (!piece || !imageAssetId) {
    throw createError({
      statusCode: 400,
      message: 'Missing piece data or image asset ID'
    })
  }

  try {
    const apiUrl = `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries`

    const headers = {
      Authorization: `Bearer ${contentfulManagementToken}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': 'piece'
    }

    const data = {
      fields: buildPieceFields(piece, imageAssetId)
    }

    const response = await $fetch<ContentfulEntryResponse>(apiUrl, {
      method: 'POST',
      body: data,
      headers
    })
    return response
  } catch (error: unknown) {
    const httpError = error as ContentfulHttpError
    const status = httpError.response?.status || httpError.statusCode || 500
    const msg = httpError.data?.message || httpError.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to upload piece: ${msg}`
    })
  }
})


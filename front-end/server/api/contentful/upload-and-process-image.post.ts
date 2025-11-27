/**
 * Server-side API route for uploading and processing images in Contentful
 * Handles the full workflow: upload -> link -> process -> publish
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 */
import type {
  ContentfulUploadResponse,
  ContentfulAssetResponse,
  ContentfulHttpError
} from '~/types/contentful-api'
import { logger } from '~/utils/logger'
import { CONTENTFUL_POLLING } from '~/constants/contentful'

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

  const formData = await readFormData(event)
  // Treat the uploaded field as a File (Nitro provides a File-like object here).
  // We avoid `instanceof File` checks because the runtime polyfill may differ,
  // and only rely on a simple presence check.
  const imageFile = formData.get('image') as File | null

  if (!imageFile) {
    throw createError({
      statusCode: 400,
      message: 'Missing image file in multipart form-data under field "image"'
    })
  }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  if (!ALLOWED_TYPES.includes(imageFile.type)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.'
    })
  }

  if (imageFile.size > MAX_FILE_SIZE) {
    throw createError({
      statusCode: 400,
      message: 'File size exceeds maximum allowed size of 10MB'
    })
  }

  try {
    logger.log('[upload-and-process-image] Received file', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size
    })

    // 1. Upload image
    const arrayBuffer = await imageFile.arrayBuffer()
    // Use Uint8Array for Cloudflare Workers compatibility (Buffer is Node.js specific)
    const imageBuffer = new Uint8Array(arrayBuffer)
    const uploadResponse = await $fetch<ContentfulUploadResponse>(
      `https://upload.contentful.com/spaces/${contentfulSpaceId}/uploads`,
      {
        method: 'POST',
        body: imageBuffer,
        headers: {
          // Contentful requires "application/octet-stream" for uploads, not the actual image MIME type
          'Content-Type': 'application/octet-stream',
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': '1'
        }
      }
    )

    logger.log('[upload-and-process-image] 1. Image uploaded', {
      uploadId: uploadResponse?.sys?.id,
      version: uploadResponse?.sys?.version
    })

    // 2. Link uploaded image to asset
    const imageName = imageFile.name.substring(0, imageFile.name.lastIndexOf('.'))
    const assetData = {
      fields: {
        title: {
          'en-US': imageName
        },
        file: {
          'en-US': {
            contentType: imageFile.type,
            fileName: imageFile.name,
            uploadFrom: {
              sys: {
                type: 'Link',
                linkType: 'Upload',
                id: uploadResponse.sys.id
              }
            }
          }
        }
      }
    }

    const assetResponse = await $fetch<ContentfulAssetResponse>(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets`,
      {
        method: 'POST',
        body: assetData,
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': '1'
        }
      }
    )

    logger.log('[upload-and-process-image] 2. Asset created', {
      assetId: assetResponse?.sys?.id,
      version: assetResponse?.sys?.version
    })

    // 3. Process the image
    await $fetch(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.sys.id}/files/en-US/process`,
      {
        method: 'PUT',
        body: {},
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': String(assetResponse.sys.version)
        }
      }
    )

    logger.log('[upload-and-process-image] 3. Processing triggered', {
      assetId: assetResponse?.sys?.id
    })

    // 4. Poll for processing completion
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    const pollAssetStatus = async (): Promise<ContentfulAssetResponse> => {
      let delayMs: number = CONTENTFUL_POLLING.INITIAL_DELAY

      for (let attempt = 0; attempt < CONTENTFUL_POLLING.MAX_ATTEMPTS; attempt++) {
        try {
          const assetStatusRes = await $fetch<ContentfulAssetResponse>(
            `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.sys.id}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${contentfulCmt}`
              }
            }
          )

          const processed = assetStatusRes.fields.file['en-US'].url !== undefined
          if (processed) {
            return assetStatusRes
          }

          logger.log('[upload-and-process-image] 4. Processing in progress', {
            attempt: attempt + 1,
            assetId: assetResponse.sys.id
          })
        } catch (error) {
          logger.warn('[upload-and-process-image] 4. Poll attempt failed', {
            attempt: attempt + 1,
            assetId: assetResponse.sys.id,
            error: error instanceof Error ? error.message : 'Unknown error'
          })
          if (attempt === CONTENTFUL_POLLING.MAX_ATTEMPTS - 1) {
            throw error
          }
        }

        await sleep(delayMs)
        delayMs = Math.min(delayMs * CONTENTFUL_POLLING.BACKOFF_MULTIPLIER, CONTENTFUL_POLLING.MAX_DELAY)
      }

      throw new Error('Image processing timeout')
    }

    const assetStatusRes = await pollAssetStatus()

    logger.log('[upload-and-process-image] 4. Processing completed', {
      assetId: assetStatusRes?.sys?.id,
      version: assetStatusRes?.sys?.version
    })

    // 5. Publish the image
    await $fetch(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.sys.id}/published`,
      {
        method: 'PUT',
        body: {},
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': String(assetStatusRes.sys.version)
        }
      }
    )

    logger.log('[upload-and-process-image] 5. Image published', {
      assetId: assetStatusRes?.sys?.id,
      version: assetStatusRes?.sys?.version
    })

    return assetStatusRes
  } catch (error: unknown) {
    // Surface more detail from Contentful so we can debug 400s more easily
    const httpError = error as ContentfulHttpError
    const statusCode = httpError?.response?.status || httpError?.statusCode || 500
    const cfDetails = httpError?.response?.data || httpError?.data

    logger.error('[upload-and-process-image] Error', {
      statusCode,
      message: httpError?.message,
      contentfulDetails: cfDetails,
      fileName: imageFile?.name
    })

    throw createError({
      statusCode,
      message: `Failed to upload and process image: ${
        httpError?.message || 'Unknown error'
      }${cfDetails ? ` | Contentful response: ${JSON.stringify(cfDetails)}` : ''}`
    })
  }
})


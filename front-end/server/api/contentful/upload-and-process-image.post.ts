import axios from 'axios'

/**
 * Server-side API route for uploading and processing images in Contentful
 * Handles the full workflow: upload -> link -> process -> publish
 * This keeps the Management API token secure on the server
 */
export default defineEventHandler(async (event) => {
  // Use console.log in server routes for visibility (logger uses import.meta.env which may not work in server context)
  console.log('-------------- upload-and-process-image.post.ts started --------------')
  
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

  try {
    console.log(
      '[upload-and-process-image] Received file',
      imageFile.name,
      imageFile.type,
      imageFile.size
    )

    // 1. Upload image
    // Contentful requires "application/octet-stream" for uploads, not the actual image MIME type
    const arrayBuffer = await imageFile.arrayBuffer()
    const imageBuffer = Buffer.from(arrayBuffer)
    const uploadResponse = await axios.post(
      `https://upload.contentful.com/spaces/${contentfulSpaceId}/uploads`,
      imageBuffer,
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': 1
        }
      }
    )

    console.log(
      '[upload-and-process-image] 1. Image uploaded',
      uploadResponse.status,
      uploadResponse.data?.sys
    )

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
                id: uploadResponse.data.sys.id
              }
            }
          }
        }
      }
    }

    const assetResponse = await axios.post(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets`,
      assetData,
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'Content-Type': 'application/vnd.contentful.management.v1+json',
          'X-Contentful-Version': 1
        }
      }
    )

    console.log(
      '[upload-and-process-image] 2. Asset created',
      assetResponse.status,
      assetResponse.data?.sys
    )

    // 3. Process the image
    await axios.put(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.data.sys.id}/files/en-US/process`,
      {},
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': assetResponse.data.sys.version
        }
      }
    )

    console.log(
      '[upload-and-process-image] 3. Processing triggered',
      assetResponse.data?.sys?.id
    )

    // 4. Poll for processing completion
    const MAX_ATTEMPTS = 60
    const INITIAL_DELAY = 100
    const MAX_DELAY = 2000
    const BACKOFF_MULTIPLIER = 1.5

    let assetProcessed = false
    let attempts = 0

    while (!assetProcessed && attempts < MAX_ATTEMPTS) {
      const assetStatusRes = await axios.get(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.data.sys.id}`,
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`
          }
        }
      )

      assetProcessed = assetStatusRes.data.fields.file['en-US'].url !== undefined

      if (!assetProcessed) {
        console.log(
          '[upload-and-process-image] 4. Processing in progress',
          'attempt',
          attempts + 1
        )
        attempts++
        const delay = Math.min(
          INITIAL_DELAY * Math.pow(BACKOFF_MULTIPLIER, attempts - 1),
          MAX_DELAY
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    if (!assetProcessed) {
      throw new Error('Image processing timeout')
    }

    console.log(
      '[upload-and-process-image] 4. Processing completed',
      assetResponse.data?.sys?.id
    )

    // 5. Publish the image
    await axios.put(
      `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.data.sys.id}/published`,
      {},
      {
        headers: {
          Authorization: `Bearer ${contentfulCmt}`,
          'X-Contentful-Version': assetResponse.data.sys.version + 1
        }
      }
    )

    console.log(
      '[upload-and-process-image] 5. Image published',
      assetResponse.data?.sys?.id
    )

    return assetResponse.data
  } catch (error: any) {
    // Surface more detail from Contentful so we can debug 400s more easily
    const statusCode = error?.response?.status || 500
    const cfDetails = error?.response?.data

    console.error(
      '[upload-and-process-image] Error',
      statusCode,
      error?.message,
      cfDetails
    )

    throw createError({
      statusCode,
      message: `Failed to upload and process image: ${
        error?.message || 'Unknown error'
      }${cfDetails ? ` | Contentful response: ${JSON.stringify(cfDetails)}` : ''}`
    })
  }
})


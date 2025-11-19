/**
 * Server-side API route for updating pieces in Contentful
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
      Authorization: `Bearer ${contentfulCmt}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Version': String(version)
    }

    const fields: Record<string, any> = {
      name: {
        'en-US': piece.name || 'untitled'
      },
      topic: {
        'en-US': piece.topic || 'anything'
      },
      technique: {
        'en-US': piece.technique || ''
      },
      techniqueDescription: {
        'en-US': piece.techniqueDescription || 'unspecified'
      },
      created: {
        'en-US': piece.created || new Date(100, 0).toISOString()
      },
      sizeInCmXHorizontal: {
        'en-US': Math.floor(piece.sizeInCm?.x || 0)
      },
      sizeInCmYVertical: {
        'en-US': Math.floor(piece.sizeInCm?.y || 0)
      },
      sizeInPxX: {
        'en-US': Math.floor(piece.sizeInPx?.x || 0)
      },
      sizeInPxY: {
        'en-US': Math.floor(piece.sizeInPx?.y || 0)
      },
      widthOnWeb: {
        'en-US': Math.floor(piece.sizeOnWeb?.width || 0)
      },
      positionX: {
        'en-US': Math.floor(piece.position?.x || 0)
      },
      positionY: {
        'en-US': Math.floor(piece.position?.y || 0)
      },
      positionDeg: {
        'en-US': Math.floor(piece.position?.deg || 0)
      },
      widthOnWebMob: {
        'en-US': Math.floor(piece.sizeOnWeb?.widthMob || 0)
      },
      positionXMob: {
        'en-US': Math.floor(piece.position?.xMob || 0)
      },
      positionYMob: {
        'en-US': Math.floor(piece.position?.yMob || 0)
      },
      positionDegMob: {
        'en-US': Math.floor(piece.position?.degMob || 0)
      },
      isMoveableInPublic: {
        'en-US': piece.isMoveableInPublic || false
      },
      isArchived: {
        'en-US': piece.isArchived || false
      }
    }

    // Include image field if imageAssetId is provided (preserves the image link)
    if (imageAssetId) {
      fields.image = {
        'en-US': {
          sys: {
            type: 'Link',
            linkType: 'Asset',
            id: imageAssetId
          }
        }
      }
    }

    const data = { fields }

    const response: any = await $fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: data
    })

    return response
  } catch (error: any) {
    const status = error.response?.status || error.statusCode || 500
    const msg = error.data?.message || error.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to update piece: ${msg}`
    })
  }
})


/**
 * Server-side API route for uploading pieces to Contentful
 * Uses $fetch instead of axios for Cloudflare compatibility
 * This keeps the Management API token secure on the server
 * 
 * All Management API operations are proxied through server routes
 * to prevent token exposure in client-side code.
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
  const { piece, imageAssetId } = body

  if (!piece || !imageAssetId) {
    throw createError({
      statusCode: 400,
      message: 'Missing piece data or image asset ID'
    })
  }

  try {
    const imageName = piece.name || 'untitled'
    const apiUrl = `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries`

    const headers = {
      Authorization: `Bearer ${contentfulCmt}`,
      'Content-Type': 'application/vnd.contentful.management.v1+json',
      'X-Contentful-Content-Type': 'piece'
    }

    const data = {
      fields: {
        name: {
          'en-US': imageName
        },
        image: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: imageAssetId
            }
          }
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
    }

    const response: any = await $fetch(apiUrl, {
      method: 'POST',
      body: data,
      headers
    })
    return response
  } catch (error: any) {
    const status = error.response?.status || error.statusCode || 500
    const msg = error.data?.message || error.message || 'Unknown error'
    throw createError({
      statusCode: status,
      message: `Failed to upload piece: ${msg}`
    })
  }
})


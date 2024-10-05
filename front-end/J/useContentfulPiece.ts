import Piece from '~/models/Piece'
import axios, { type AxiosResponse } from 'axios'
import { createClient } from 'contentful-management'
import useAdminPage from './useAdminPage'

const contentfulSpaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string
const contentfulCmt = import.meta.env
  .VITE_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN as string || ''

const contentfulClient = createClient({
  accessToken: contentfulCmt
})

export default function useContentfulPiece() {
  const { isSetupForMobile } = useAdminPage()

  // 1.
  const uploadImageToContentful = async (imageRaw: File) => {
    if (!imageRaw) return

    try {
      const uploadResponse = await axios.post(
        `https://upload.contentful.com/spaces/${contentfulSpaceId}/uploads`,
        imageRaw,
        {
          headers: {
            'Content-Type': 'application/octet-stream',
            Authorization: `Bearer ${contentfulCmt}`,
            'X-Contentful-Version': 1
          }
        }
      )
      console.log('1. Image uploaded successfully')
      return uploadResponse
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  // 2.
  const linkUploadedImageToAsset = async (uploadResponse: AxiosResponse, imageRaw: File) => {
    const imageName = imageRaw.name.substring(0, imageRaw.name.lastIndexOf('.'))

    try {
      const assetData = {
        fields: {
          title: {
            'en-US': imageName
          },
          file: {
            'en-US': {
              contentType: imageRaw.type,
              fileName: imageRaw.name,
              uploadFrom: {
                sys: {
                  type: 'Link',
                  linkType: 'Upload',
                  id: uploadResponse?.data.sys.id
                }
              }
            }
          }
        }
      }

      // Link uploaded file to asset
      const assetResponse = await axios.put(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${uploadResponse.data.sys.id}`,
        assetData,
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`,
            'Content-Type': 'application/vnd.contentful.management.v1+json',
            'X-Contentful-Version': 1
          }
        }
      )

      console.log('2. link Uploaded Image To Asset')
      return assetResponse
    } catch (error) {
      console.error('Error linkUploadedImageToAsset', error)
    }
  }

  // 3., 4.
  const processTheImage = async (uploadResponse: AxiosResponse) => {
    try {
      await axios.put(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${uploadResponse.data.sys.id}/files/en-US/process`,
        {},
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`,
            'X-Contentful-Version': uploadResponse.data.sys.version
          }
        }
      )
      console.log('3. Image start processing')
    } catch (error) {
      console.error('Error processing image', error)
    }

    // Poll the asset's processing status until it's ready
    let assetProcessed = false
    while (!assetProcessed) {
      const assetStatusRes = await axios.get(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${uploadResponse.data.sys.id}`,
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`
          }
        }
      )

      assetProcessed =
        assetStatusRes.data.fields.file['en-US'].url !== undefined

      if (!assetProcessed) {
        // Wait for a bit before checking again
        try {
          await new Promise((resolve) => setTimeout(resolve, 200))
          console.log('4. Image processed')
        } catch (error) {
          console.error('Error processTheImage', error)
        }
      }
    }
  }

  // 5.
  const publishTheImage = async (assetResponse: AxiosResponse) => {
    try {
      await axios.put(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/assets/${assetResponse.data.sys.id}/published`,
        {},
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`,
            'X-Contentful-Version': assetResponse?.data.sys.version + 1
          }
        }
      )
      console.log('5. Image published')
    } catch (error) {
      console.error('Error publishTheImage:', error)
    }
  }

  const uploadAndPublishImage = async (imageRaw: File) => {
    const uploadResponse = await uploadImageToContentful(imageRaw)
    if (!uploadResponse) return

    const assetResponse = await linkUploadedImageToAsset(uploadResponse, imageRaw)
    if (!assetResponse) return

    await processTheImage(assetResponse)
    await publishTheImage(assetResponse)

    return assetResponse
  }

  // 6.
  const uploadPiece = async (piece: Piece) => {
    if (!piece.imageRaw) return
    console.log(':::uploading started... ')
    const imageResponse = await uploadAndPublishImage(piece.imageRaw)
    console.log('-- asset Response --: ', imageResponse);
    const imageName = piece.imageRaw.name.substring(0, piece.imageRaw.name.lastIndexOf('.'))
    try {
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
                id: imageResponse?.data.sys.id // ID of an image asset you've previously uploaded to Contentful
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
            'en-US': Math.floor(piece.sizeInCm.x || 0)
          },
          sizeInCmYVertical: {
            'en-US': Math.floor(piece.sizeInCm.y || 0)
          },
          sizeInPxX: {
            'en-US': Math.floor(piece.sizeInPx.x || 0)
          },
          sizeInPxY: {
            'en-US': Math.floor(piece.sizeInPx.y || 0)
          },
          widthOnWeb: {
            'en-US': Math.floor(piece.sizeOnWeb.width || 0)
          },
          positionX: {
            'en-US': Math.floor(piece.position.x || 0)
          },
          positionY: {
            'en-US': Math.floor(piece.position.y || 0)
          },
          positionDeg: {
            'en-US': Math.floor(piece.position.deg || 0)
          },
          widthOnWebMob: {
            'en-US': Math.floor(piece.sizeOnWeb.widthMob || 0)
          },
          positionXMob: {
            'en-US': Math.floor(piece.position.xMob || 0)
          },
          positionYMob: {
            'en-US': Math.floor(piece.position.yMob || 0)
          },
          positionDegMob: {
            'en-US': Math.floor(piece.position.degMob || 0)
          },
          isMoveableInPublic: {
            'en-US': piece.isMoveableInPublic ?? false
          },
        }
      }

      const response = await axios.post(apiUrl, data, { headers })

      piece.sys = {
        id:response.data.sys.id,
        version: response.data.sys.version
      }
      piece.isUpdated = true
      piece.isUploadedToCf = true
      piece.image.id = imageResponse?.data.sys.id

      console.log('6. piece successfully uploaded as draft', piece, response)
    } catch (error) {
      console.error('6. error uploadPiece', error)
    }
  }

  const updatePiece = async (piece: Piece) => {
    try {
      const space = await contentfulClient.getSpace(contentfulSpaceId)
      const environment = await space.getEnvironment('master')
      const entry = await environment.getEntry(piece.sys.id)

      // Update the fields of the entry
      entry.fields = {
        name: {
          'en-US': piece.name
        },
        image: {
          'en-US': {
            sys: {
              type: 'Link',
              linkType: 'Asset',
              id: piece?.image.id
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
          'en-US': piece.techniqueDescription || ''
        },
        created: {
          'en-US': piece.created || new Date(100, 0).toISOString()
        },
        sizeInCmXHorizontal: {
          'en-US': Math.floor(piece.sizeInCm.x || 0)
        },
        sizeInCmYVertical: {
          'en-US': Math.floor(piece.sizeInCm.y || 0)
        },
        sizeInPxX: {
          'en-US': Math.floor(piece.sizeInPx.x || 0)
        },
        sizeInPxY: {
          'en-US': Math.floor(piece.sizeInPx.y || 0)
        },
        widthOnWeb: {
          'en-US': Math.floor(piece.sizeOnWeb.width || 0)
        },
        positionX: {
          'en-US': Math.floor(piece.position.x || 0)
        },
        positionY: {
          'en-US': Math.floor(piece.position.y || 0)
        },
        positionDeg: {
          'en-US': Math.floor(piece.position.deg || 0)
        },
        widthOnWebMob: {
          'en-US': Math.floor(piece.sizeOnWeb.widthMob || 0)
        },
        positionXMob: {
          'en-US': Math.floor(piece.position.xMob || 0)
        },
        positionYMob: {
          'en-US': Math.floor(piece.position.yMob || 0)
        },
        positionDegMob: {
          'en-US': Math.floor(piece.position.degMob || 0)
        },
        isMoveableInPublic: {
          'en-US': piece.isMoveableInPublic ?? false
        },
      }

      // Save the updated entry
      const updatedEntry = await entry.update()
      piece.sys.version = updatedEntry.sys.version
    } catch (error) {
      console.error('Error updatePiece:', error)
    }
    piece.isUpdated = true
  }

  const updateAndPublishPiece = async (piece: Piece) => {

    try {
      await updatePiece(piece)
      await axios.put(
        `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${piece.sys.id}/published`,
        {},
        {
          headers: {
            Authorization: `Bearer ${contentfulCmt}`,
            'X-Contentful-Version': piece.sys.version
          }
        }
      )
      piece.isPublished = true
      piece.sys.version += 1
      console.log(`Piece ${piece.name} published!`)
    } catch (error) {
      console.error('error publishPiece', error)
    }
  }

  // const removePiece = async (piece: Piece) => {

    const removePiece = async (piece: Piece) => {
      try {
        const space = await contentfulClient.getSpace(contentfulSpaceId)
        const environment = await space.getEnvironment('master')
        const entry = await environment.getEntry(piece.sys.id)
        await entry.unpublish() // optional, if the entry is published
        await entry.delete()
        console.log(`Entry ${piece.sys.id}: ${piece.name} deleted.`)
      } catch (error) {
        console.error('Error removePiece:', error)
      }
    }


  return {
    uploadPiece,
    removePiece,
    updateAndPublishPiece
  }
}

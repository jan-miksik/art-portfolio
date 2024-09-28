import { ref } from 'vue'

const contentfulData = ref()

export default function useContentful() {
  const fetchContentfulData = async () => {
    const query = `{
      pieceCollection(limit: 500) {
        items {
          sys {
            id
          }
          name
          image {
            sys {
              publishedAt
              id
            }
            fileName
            url
          }
          topic
          technique
          techniqueDescription
          created
          sizeInCmXHorizontal
          sizeInCmYVertical
          sizeInPxX
          sizeInPxY
          widthOnWeb
          positionX
          positionY
          positionDeg
          widthOnWebMob
          positionXMob
          positionYMob
          positionDegMob
        }
      }
    }`

    const fetchUrl = `https://graphql.contentful.com/content/v1/spaces/${
      import.meta.env.VITE_CONTENTFUL_SPACE_ID
    }`

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    }

    try {
      const response = await fetch(fetchUrl, fetchOptions)
      const JSONResponse = await response.json()
      contentfulData.value = JSONResponse.data.pieceCollection.items
      console.log(' contentfulData.value: ',  contentfulData.value);
    } catch (error) {
      console.log('error ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]', error)
      throw new Error('Could not receive the data from Contentful!')
    }
  }

  return {
    contentfulData,
    fetchContentfulData
  }
}

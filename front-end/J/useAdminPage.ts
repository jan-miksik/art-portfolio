// import axios from 'axios'
// import { createClient } from 'contentful-management'
// import useContentful from '~/api/useContentful'


const isOnAdminPage = ref(false)
// const isSettingColors = ref(false)
const isSetupForMobile = ref(window.innerWidth < 768)

// const contentfulSpaceId = import.meta.env.VITE_CONTENTFUL_SPACE_ID as string
// const contentfulCmt = import.meta.env
//   .VITE_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN as string

// const contentfulClient = createClient({
//   accessToken: contentfulCmt
// })

export default function useAdminPage() {

  // const { appSettings, appSettingsOriginString } = useContentful()
  // const updateSettings = async () => {
  //   try {
  //     const space = await contentfulClient.getSpace(contentfulSpaceId)
  //     const environment = await space.getEnvironment('master')
  //     const entry = await environment.getEntry(appSettings.value.sys.id)
  
  //     // Update the fields of the entry
  //     entry.fields = {
  //       editableOnMobil: {
  //         'en-US': appSettings.value.editableOnMobil
  //       },
  //       editableOnDesktop: {
  //         'en-US': appSettings.value.editableOnDesktop
  //       },
  //       backgroundColor: {
  //         'en-US': appSettings.value.backgroundColor
  //       },
  //       backgroundColorPieceDetail: {
  //         'en-US': appSettings.value.backgroundColorPieceDetail
  //       },
  //       pieceDetailTextColor: {
  //         'en-US': appSettings.value.pieceDetailTextColor
  //       },
  //     }
  
  //     // Save the updated entry
  //     const updatedEntry = await entry.update()
  //     await axios.put(
  //       `https://api.contentful.com/spaces/${contentfulSpaceId}/environments/master/entries/${updatedEntry.sys.id}/published`,
  //       {},
  //       {
  //         headers: {
  //           Authorization: `Bearer ${contentfulCmt}`,
  //           'X-Contentful-Version': updatedEntry.sys.version
  //         }
  //       }
  //     )

  //     console.log(`Settings updated and published`)
  //   } catch (error) {
  //     console.error('Error updateSettings:', error)
  //   }
  // }

  // const isSettingChanged = computed(() => appSettingsOriginString.value !== JSON.stringify(appSettings.value))

  return {
    isOnAdminPage,
    // updateSettings,
    // isSettingColors,
    // isSettingChanged,
    isSetupForMobile
  }
}
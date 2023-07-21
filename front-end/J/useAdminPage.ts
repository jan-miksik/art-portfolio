const isOnAdminPage = ref(false)
const isSetupForMobile = ref(window.innerWidth < 768)


export default function useAdminPage() {

  return {
    isOnAdminPage,
    isSetupForMobile
  }
}
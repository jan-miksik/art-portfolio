const isOnAdminPage = ref(false)
const isSetupForMobile = ref(false)

// Initialize mobile detection safely (client-side only)
if (import.meta.client) {
  isSetupForMobile.value = window.innerWidth < 768
}

export default function useAdminPage() {

  return {
    isOnAdminPage,
    isSetupForMobile
  }
}
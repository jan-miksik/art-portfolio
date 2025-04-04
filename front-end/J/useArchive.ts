import { useStorage } from '@vueuse/core'

const isArchiveVisible = useStorage<boolean>('is-archive-visible', false)

export default function useArchive() {

  const toggleArchive = () => {
    isArchiveVisible.value = !isArchiveVisible.value
  }

  return {
    isArchiveVisible,
    toggleArchive
  }
}

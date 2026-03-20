const isArchiveVisible = ref(true)

export default function useArchive() {

  const toggleArchive = () => {
    isArchiveVisible.value = true
  }

  return {
    isArchiveVisible,
    toggleArchive
  }
}

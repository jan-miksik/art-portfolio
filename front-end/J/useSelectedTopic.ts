import { Topics } from "../components/piecesData"

const selectedTopic = ref<Topics>()
const selectedTopicIcon = ref<Topics>()

export default function useSelectedTopic() {

  const selectTopic = async (topic: Topics) => {
    if (selectedTopic.value === topic) {
      selectedTopicIcon.value = undefined
    } else {
      selectedTopicIcon.value = topic
    }
    
    await new Promise(resolve => setTimeout(resolve, 200))
  
    if (selectedTopic.value === topic) {
      selectedTopic.value = undefined
      return
    }
    selectedTopic.value = topic
  }

  return { 
    selectedTopic,
    selectedTopicIcon,
    selectTopic
  }
}
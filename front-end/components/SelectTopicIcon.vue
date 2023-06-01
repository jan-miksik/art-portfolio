<template>
  <h1
    :class="mainStyleClasses"
    @click="selectTopic(topic)"
  >
    <OImage
      :image-file="icon"
      class="open-topic-icon__topic-thumbnail-img"
      :alt="label"
    />
    <span class="open-topic-icon__topic-label">{{ label }}</span>
  </h1>
</template>

<script setup lang="ts">
import ImageFile from '~/models/ImageFile';
import { Topics } from './piecesData';
import useSelectedTopic from '~/J/useSelectedTopic'

const { selectedTopicIcon, selectTopic } = useSelectedTopic()

const props = defineProps<{
  icon: ImageFile
  topic: Topics
  label: string
}>()

const { topic } = toRefs(props)

const mainStyleClasses = computed(() => [
  'open-topic-icon',

  `${selectedTopicIcon.value === topic.value 
    && 'open-topic-icon__is-selected-topic'}`,

  `${selectedTopicIcon.value !== topic.value 
    && selectedTopicIcon.value 
    && 'open-topic-icon__is-unselected-topic'}`
])

</script>

<style scoped lang="stylus">
.open-topic-icon
  opacity 0.85
  transition all 0.2s
  white-space nowrap
  cursor cell
  margin 0
  position absolute
  display flex
  flex-direction column
  gap 0.25rem
  z-index 100

  // &__topic-thumbnail-img
  //   // filter drop-shadow(0 0 0 gray)

  &__topic-label
    font-size 1rem
    visibility hidden
    // text-transform lowercase
    // font-family bungeehairline, sans-serif

  &__is-unselected-topic
    transform scale(0.8, 0.8)
    opacity 0.75

  &__is-unselected-topic .open-topic-icon__topic-label
    visibility hidden

  &__is-selected-topic .open-topic-icon__topic-label
    visibility visible
    position absolute
    top 1rem
    font-size 2.1rem

    @media (min-width 700px)
      font-size 3rem

  &__is-selected-topic
    top 0
    transform initial
    left calc(50% - 115px)
    // right calc(50%)
    position fixed
    // translate -50%

  &__is-selected-topic .open-topic-icon__topic-thumbnail-img
    opacity 0.1
    translate 50px

.open-topic-icon:hover .open-topic-icon__topic-label
  visibility visible

.dark-mode
  .open-topic-icon
    filter invert(1)

    // stylelint-disable-next-line no-descending-specificity
    &__topic-label
      color white

</style>

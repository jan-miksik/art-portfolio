<template>
    <ODarkModeSwitcher />
    <div class="homepage__open-topic-icons">
      <SelectTopicIcon :icon="sansTopicIcon" label="Free Topic" :topic="Topics.SANS_TOPIC" class="homepage__sans-topic-link" />

      <SelectTopicIcon :icon="geometryIcon" label="Geometry" :topic="Topics.GEOMETRY" class="homepage__geometry-link"/>

      <SelectTopicIcon :icon="nodeAvatarsIcon" label="Node Avatars" :topic="Topics.NODE_AVATARS" class="homepage__node-avatars-link"/>

      <SelectTopicIcon :icon="puzzleIcon" label="Puzzle" :topic="Topics.PUZZLE" class="homepage__puzzle-link"/>

      <SelectTopicIcon :icon="collectIcon" label="Into Pieces" :topic="Topics.NFT_COLLECTION" class="homepage__nft-collection-link"/>
    </div>

    <Contact />

    <Pieces
      :pieces="piecesSansTopic"
      :type="Topics.SANS_TOPIC"
      :selected-topic="selectedTopic"
    />
    <Pieces
      :pieces="piecesGeometry"
      :type="Topics.GEOMETRY"
      :selected-topic="selectedTopic"
    />
    <Pieces
      :pieces="piecesNodeAvatars"
      :type="Topics.NODE_AVATARS"
      :selected-topic="selectedTopic"
    />
    <Pieces
      :pieces="piecesPuzzle"
      :type="Topics.PUZZLE"
      :selected-topic="selectedTopic"
    />
    <IntoPiecesMain
      :type="Topics.NFT_COLLECTION"
      :selected-topic="selectedTopic"
    />
</template>

<script setup lang="ts">
import { Topics } from '~/components/piecesData';
import usePieces from '~/J/usePieces'
import useSelectedTopic from '~/J/useSelectedTopic'
import ImageFile from '~/models/ImageFile'

const { piecesNodeAvatars, piecesSansTopic, piecesGeometry, piecesPuzzle } = usePieces()
const { selectedTopic } = useSelectedTopic()

useHead({
  title: 'Jan Mikšík',
  meta: [{
    content: 'Portfolio of Jan Mikšík. Drawings, paintings and other pieces'
  }]
})



const sansTopicIcon = ref(
  new ImageFile({
    url: 'topics-entry-icons/sans-topic-icon.webp',
    id: 'title-sans-topic-img',
    lastUpdated: new Date('1991').getTime()
  })
)

const geometryIcon = ref(
  new ImageFile({
    url: 'topics-entry-icons/geometry-icon.png',
    id: 'geometry-title-img',
    lastUpdated: new Date('1991').getTime()
  })
)

const nodeAvatarsIcon = ref(
  new ImageFile({
    url: 'topics-entry-icons/node-avatars-icon.webp',
    id: 'node-avatars-title-img',
    lastUpdated: new Date('1997').getTime()
  })
)

const puzzleIcon = ref(
  new ImageFile({
    url: 'topics-entry-icons/puzzle-icon.webp',
    id: 'puzzle-title-img',
    lastUpdated: new Date('1993').getTime()
  })
)

const collectIcon = ref(
  new ImageFile({
    url: 'topics-entry-icons/collect-icon.png',
    id: 'collect',
    lastUpdated: new Date('1993').getTime()
  })
)

</script>

<style lang="stylus">
// /
// Free Topic
// /
.homepage__sans-topic-link
  left 37vw
  top 28vh
  width 140px

  @media (min-width 700px)
    left 45vw
    width 230px

.open-topic-icon:is(.homepage__sans-topic-link):is(.open-topic-icon__is-unselected-topic)
  left calc(100vw - 140px)

  @media (min-width 700px)
    left calc(100vw - 230px)
  // filter opacity(0.3)

.open-topic-icon:is(.homepage__sans-topic-link):is(.open-topic-icon__is-unselected-topic)
  .open-topic-icon__topic-thumbnail-img
    transform scale(0.65, 0.65)
    translate 25px 25px

.open-topic-icon:is(.homepage__sans-topic-link):is(.open-topic-icon)
  .open-topic-icon__topic-thumbnail-img
    filter drop-shadow(0 0 2px gray)


// /
// Geometry
// /
.homepage__geometry-link
  top 55vh
  left 15vw
  width 45px

  @media (min-width 700px)
    width 50px

.open-topic-icon:is(.homepage__geometry-link):is(.open-topic-icon__is-unselected-topic)
  left -3px
  // filter opacity(0.3)

.open-topic-icon:is(.homepage__geometry-link):is(.open-topic-icon)
  .open-topic-icon__topic-thumbnail-img
    filter drop-shadow(0 0 2px #4488ff9e)

// /
// Node Avatars
// /
.homepage__node-avatars-link
  top 12vh
  left 10vw
  width 80px

  @media (min-width 700px)
    width 135px

.open-topic-icon:is(.homepage__node-avatars-link):is(.open-topic-icon__is-unselected-topic)
  left -8px
  // filter opacity(0.3)

.open-topic-icon:is(.homepage__node-avatars-link):is(.open-topic-icon)
  .open-topic-icon__topic-thumbnail-img
    filter drop-shadow(0 0 1px #b2d5ff)

// /
// Puzzle
// /
.homepage__puzzle-link
  top 77vh
  left 52vw
  width 55px

  @media (min-width 700px)
    width 70px

.open-topic-icon:is(.homepage__puzzle-link):is(.open-topic-icon__is-unselected-topic)
  left calc(100vw - 55px)

  @media (min-width 700px)
    left calc(100vw - 80px)

.open-topic-icon:is(.homepage__puzzle-link):is(.open-topic-icon)
  .open-topic-icon__topic-thumbnail-img
    filter drop-shadow(0 1px 1px gray)

// /
// Into Pieces - NFT Collection Into Pieces
// /
.homepage__nft-collection-link
  left 65vw
  top 52vh
  width 60px

  @media (min-width 700px)
    left 75vw
    width 70px

.open-topic-icon:is(.homepage__nft-collection-link):is(.open-topic-icon__is-unselected-topic)
  left calc(100vw - 60px)

  @media (min-width 700px)
    left calc(100vw - 85px)
  // filter opacity(0.3)

.open-topic-icon:is(.homepage__nft-collection-link):is(.open-topic-icon)
  .open-topic-icon__topic-thumbnail-img
    filter drop-shadow(0 1px 1px gray)

.open-topic-icon__is-unselected-topic
  filter opacity(0.3)

  &:hover
    filter opacity(0.85)

.dark-mode .open-topic-icon__is-unselected-topic
  filter opacity(0.3) invert(1) !important
</style>

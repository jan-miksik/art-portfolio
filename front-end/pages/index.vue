<template>
  <div>
    <DarkModeSwitcher />
    <div class="homepage__open-topic-icons">
      <SelectTopicIcon :icon="sansTopicIcon" label="Sans Topic" :topic="Topics.SANS_TOPIC" class="homepage__sans-topic-link"/>

      <SelectTopicIcon :icon="geometryIcon" label="Geometry" :topic="Topics.GEOMETRY" class="homepage__geometry-link"/>

      <SelectTopicIcon :icon="nodeAvatarsIcon" label="Node Avatars" :topic="Topics.NODE_AVATARS" class="homepage__node-avatars-link"/>

      <SelectTopicIcon :icon="puzzleIcon" label="Puzzle" :topic="Topics.PUZZLE" class="homepage__puzzle-link"/>

      <SelectTopicIcon :icon="collectIcon" label="Collect" :topic="Topics.NFT_COLLECTION" class="homepage__nft-collection-link"/>
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
    <NftCollectionPieces
      :type="Topics.NFT_COLLECTION"
      :selected-topic="selectedTopic"
    />
  </div>
</template>

<script setup lang="ts">
import { Topics } from '~/components/piecesData';
import usePieces from '~/J/usePieces'
import useSelectedTopic from '~/J/useSelectedTopic'
import ImageFile from '~/models/ImageFile'

const { piecesNodeAvatars, piecesSansTopic, piecesGeometry, piecesPuzzle } = usePieces()
const { selectedTopic } = useSelectedTopic()

useHead({
  title: 'Portfolio of Jan Mikšík',
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
    lastUpdated: new Date('1995').getTime()
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
    url: 'topics-entry-icons/collect-icon.webp',
    id: 'collect',
    lastUpdated: new Date('1992').getTime()
  })
)

</script>

<style lang="stylus">
// /
// Sans Topic
// /
.homepage__sans-topic-link
  right calc(50% - 150px)
  top 25vh
  width 110px

  @media (min-width 700px)
    width 135px

.open-topic-icon:is(.homepage__sans-topic-link):is(.open-topic-icon__is-unselected-topic)
  right -8px


// /
// Geometry
// /
.homepage__geometry-link
  top 55vh
  left 15vw
  width 80px

  @media (min-width 700px)
    width 100px

.open-topic-icon:is(.homepage__geometry-link):is(.open-topic-icon__is-unselected-topic)
  left -8px


// /
// Node Avatars
// /
.homepage__node-avatars-link
  top 20vh
  left 10vw
  width 100px

  @media (min-width 700px)
    width 115px

.open-topic-icon:is(.homepage__node-avatars-link):is(.open-topic-icon__is-unselected-topic)
  left -8px

// /
// Puzzle
// /
.homepage__puzzle-link
  top 70vh
  right 20vw
  width 100px

  @media (min-width 700px)
    width 115px

.open-topic-icon:is(.homepage__puzzle-link):is(.open-topic-icon__is-unselected-topic)
  right -8px

// /
// NFT Collection
// /
.homepage__nft-collection-link
  right calc(45% - 75px)
  top 42vh
  width 90px

  @media (min-width 700px)
    right calc(22% - 75px)
    width 100px

.open-topic-icon:is(.homepage__nft-collection-link):is(.open-topic-icon__is-unselected-topic)
  right -8px

</style>

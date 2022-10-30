<template>
  <div>
  <DarkModeSwitcher />
  <div class="homepage__titles">
    <div
      :class="[
        'homepage__title homepage__title-sans-topic',
        {
          'homepage__animate-selected-sans-topic':
            selectedTopicIcon === Topics.SANS_TOPIC
        },
        {
          'animate-unselected-sans-topic':
            selectedTopicIcon && selectedTopicIcon !== Topics.SANS_TOPIC
        }
      ]"
      @click="selectTopic(Topics.SANS_TOPIC)"
    >
      <Image
        :image-file="sansTopicImage"
        class="homepage__title-sans-topic-img"
        alt="sans topic"
      />
    </div>

    <h1
      :class="[
        'homepage__title  homepage__geometry-link',
        {
          'homepage__animate-selected-geometry':
            selectedTopicIcon === Topics.GEOMETRY
        },
        {
          'animate-unselected-geometry':
            selectedTopicIcon && selectedTopicIcon !== Topics.GEOMETRY
        }
      ]"
      @click="selectTopic(Topics.GEOMETRY)"
    >
      <Image
        :image-file="geometryImage"
        class="homepage__geometry-link-img"
        alt="geometry"
      />
      <span class="homepage__geometry-link-label">Geometry</span>
    </h1>

    <h1
      :class="[
        'homepage__title  homepage__node-avatars-link',
        {
          'homepage__animate-selected-node-avatars':
            selectedTopicIcon === Topics.NODE_AVATARS
        },
        {
          'animate-unselected-node-avatars':
            selectedTopicIcon && selectedTopicIcon !== Topics.NODE_AVATARS
        }
      ]"
      @click="selectTopic(Topics.NODE_AVATARS)"
    >
      <Image
        :image-file="nodeAvatarsImage"
        class="homepage__node-avatars-link-img"
        alt="node avatars"
      />
      <span class="homepage__node-avatars-label">Node Avatars</span>
    </h1>

    <h1
      :class="[
        'homepage__title  homepage__puzzle-link',
        {
          'homepage__animate-selected-puzzle':
            selectedTopicIcon === Topics.PUZZLE
        },
        {
          'animate-unselected-puzzle':
            selectedTopicIcon && selectedTopicIcon !== Topics.PUZZLE
        }
      ]"
      @click="selectTopic(Topics.PUZZLE)"
    >
      <Image
        :image-file="puzzleImage"
        class="homepage__puzzle-link-img"
        alt="puzzle"
      />
      <span class="homepage__puzzle-link-label">Puzzle</span>
    </h1>

    <h1
      :class="[
        'homepage__title  homepage__nft-collection-link',
        {
          'homepage__animate-selected-nft-collection':
            selectedTopicIcon === Topics.NFT_COLLECTION
        },
        {
          'animate-unselected-nft-collection':
            selectedTopicIcon && selectedTopicIcon !== Topics.NFT_COLLECTION
        }
      ]"
      @click="selectTopic(Topics.NFT_COLLECTION)"
    >
      <Image
        :image-file="collect"
        class="homepage__nft-collection-thumbnail-img"
        alt="collect"
      />
      <span class="homepage__nft-collection-label">Collect</span>
    </h1>
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
import ImageFile from '~/models/ImageFile'

const { piecesNodeAvatars, piecesSansTopic, piecesGeometry, piecesPuzzle } = usePieces()

useHead({
  title: 'Portfolio of Jan Mikšík',
  meta: [{
    content: 'Portfolio of Jan Mikšík. Drawings, paintings and other pieces'
  }]
})

const sansTopicImage = ref(
  new ImageFile({
    url: 'topics-entry-icons/sans-topic-title-letters.webp',
    id: 'title-sans-topic-img',
    lastUpdated: new Date('1990').getTime()
  })
)

const geometryImage = ref(
  new ImageFile({
    url: 'topics-entry-icons/geometry-icon.png',
    id: 'geometry-title-img',
    lastUpdated: new Date('1991').getTime()
  })
)

const nodeAvatarsImage = ref(
  new ImageFile({
    url: 'topics-entry-icons/node-avatars-icon.webp',
    id: 'node-avatars-title-img',
    lastUpdated: new Date('1995').getTime()
  })
)

const puzzleImage = ref(
  new ImageFile({
    url: 'topics-entry-icons/puzzle-icon.webp',
    id: 'puzzle-title-img',
    lastUpdated: new Date('1993').getTime()
  })
)

const collect = ref(
  new ImageFile({
    url: 'topics-entry-icons/collect-icon.webp',
    id: 'collect',
    lastUpdated: new Date('1992').getTime()
  })
)

const selectedTopic = ref<Topics>()
const selectedTopicIcon = ref<Topics>()

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
</script>

<style scoped lang="stylus">
a
  color #42b983


label
  margin 0 0.5em
  font-weight bold


code
  background-color #eee
  padding 2px 4px
  border-radius 4px
  color #304455


.homepage__titles
  position relative


.homepage__title
  opacity 0.85
  transition all 0.2s
  white-space nowrap
  cursor cell
  margin 0
  // padding 0.3rem 1rem
  border-radius 2px

.homepage__unselected-title
  background-image linear-gradient(#fff, ghostwhite)
  box-shadow 2px 1px 10px 0 rgb(0 0 0 / 20%)

.homepage__title:hover
  transition all 0.2s
  opacity 1

// /
// /
// Node Avatars
// /
// /
.homepage__node-avatars-link
  position absolute
  top 9vh
  left 10vw
  display flex
  flex-direction column
  align-items center
  font-family BungeeHairline, Helvetica, Arial, sans-serif
  font-size 1rem
  text-transform uppercase


.animate-unselected-node-avatars
  top 150px
  transform scale(0.55)
  left -29px


.homepage__animate-selected-node-avatars
  top 0
  transform initial
  left calc(50% - 160px)
  font-size 2.15rem
  position fixed
  backdrop-filter grayscale(1)

  @media (min-width 700px)
    font-size 2.5rem

.homepage__node-avatars-link-img
  height auto
  width 105px
  filter drop-shadow(0 0 1px #eae2c4)

.dark-mode .homepage__node-avatars-link-img
  filter drop-shadow(0 0 1px #eae2c4) invert(1)

  @media (min-width 700px)
    width 120px

.homepage__node-avatars-label
  visibility hidden

.dark-mode .homepage__node-avatars-label
  color white
  filter invert(1)


.homepage__animate-selected-node-avatars .homepage__node-avatars-link-img
  opacity 0.2
  margin-left 6.5rem

.homepage__animate-selected-node-avatars .homepage__node-avatars-label
  position absolute
  visibility visible
  top 20px
  left 0

  @media (min-width 700px)
    left 25px

.homepage__node-avatars-link:hover .homepage__node-avatars-label
  opacity 1
  visibility visible

// /
// /
// Geometry
// /
// /
.homepage__geometry-link
  font-family BungeeHairline, Helvetica, Arial, sans-serif
  font-size 1rem
  position absolute
  top 55vh
  left 15vw
  display flex
  flex-direction column

.homepage__geometry-link-img
  height auto
  width 80px
  filter drop-shadow(0 1px 2px #7baac6)

  @media (min-width 700px)
    width 100px

.animate-unselected-geometry
  transform scale(0.6)
  left -15px

.homepage__geometry-link-label
  visibility hidden
  margin-top 0.5rem

.dark-mode .homepage__geometry-link-label
  color white

.homepage__animate-selected-geometry .homepage__geometry-link-label
  position absolute
  visibility visible
  top 12px
  left 25px

  @media (min-width 700px)
    left 25px

.homepage__geometry-link:hover .homepage__geometry-link-label
  opacity 1
  visibility visible

.homepage__animate-selected-geometry
  font-size 2.5rem
  transform initial
  top 0
  left calc(50% - 125px)
  position fixed
  // backdrop-filter grayscale(1)

.dark-mode
  .homepage__geometry-link
    filter invert(1)


.homepage__animate-selected-geometry .homepage__geometry-link-img
  opacity 0.2
  margin-left 5rem


// /
// /
// Sans Topic
// /
// /
.homepage__title-sans-topic
  // padding 0
  right calc(50% - 150px)
  top 25vh
  position absolute
  cursor crosshair
  padding 0.5rem 1rem

  @media (min-width 700px)
    padding 0.5rem 1rem 1.5rem


.homepage__title-sans-topic-img
  width 250px
  height auto

  @media (min-width 700px)
    width 410px

.animate-unselected-sans-topic
  transform scale(0.35, 0.3) rotate(89deg)
  height 55px
  right -120px

  @media (min-width 700px)
    right -200px


.homepage__animate-selected-sans-topic
  top 0
  transform initial
  right calc(50% - 125px)
  font-size 3.5rem
  position fixed
  padding 0.3rem 0.5rem 0
  backdrop-filter grayscale(1)

  @media (min-width 700px)
    right calc(50% - 150px)


// /
// /
// Puzzle
// /
// /
.homepage__puzzle-link
  line-height 1
  position absolute
  font-family BungeeHairline, Helvetica, Arial, sans-serif
  font-size 1rem
  top 70vh
  right 20vw
  display flex
  flex-direction column
  justify-content center
  transition all 0.3s

.homepage__puzzle-link-img
  width 100px
  height auto
  filter drop-shadow(1px 1px 1px black)

  @media (min-width 700px)
    width 115px

.dark-mode .homepage__puzzle-link-img
  filter drop-shadow(1px 1px 1px #eae2c4)

.animate-unselected-puzzle
  transform scale(0.6)
  right -17px

.homepage__puzzle-link-label
  visibility hidden
  margin-top 0.5rem

.dark-mode .homepage__puzzle-link-label
  color white

.homepage__animate-selected-puzzle .homepage__puzzle-link-label
  position absolute
  visibility visible
  // right 20vw

  @media (min-width 700px)
    // right 20vw

.homepage__puzzle-link:hover .homepage__puzzle-link-label
  opacity 1
  visibility visible

.homepage__animate-selected-puzzle
  font-size 3rem
  transform initial
  top 0
  right calc(50% - 60px)
  position fixed
  transition all 0.3s

.dark-mode
  .homepage__puzzle-link
    filter invert(1)


.homepage__animate-selected-puzzle .homepage__puzzle-link-img
  opacity 0.2
  margin-left 2.5rem


// /
// /
// NFT Collection
// /
// /
.homepage__nft-collection-link
  right calc(45% - 75px)
  top 42vh
  position absolute
  cursor crosshair
  padding 0.5rem 1rem
  font-size 1rem
  display flex
  flex-direction column
  gap 0.25rem

  @media (min-width 700px)
    padding 0.5rem 1rem 1.5rem
    right calc(22% - 75px)

.homepage__nft-collection-label
  visibility hidden
  // stylelint-disable-next-line font-family-no-missing-generic-family-keyword
  font-family bungeehairline

.dark-mode
  .homepage__nft-collection-link
    filter invert(1)

  .homepage__nft-collection-label
    color white

.homepage__nft-collection-thumbnail-img
  width 90px
  filter drop-shadow(0 1px 0 gray)

.homepage__nft-collection-link-img
  width 310px
  height auto

  @media (min-width 700px)
    width 410px


.homepage__animate-selected-nft-collection .homepage__nft-collection-label
  position absolute
  visibility visible
  left -25px
  top 7px

  @media (min-width 700px)
    left -60px

.animate-unselected-nft-collection .homepage__nft-collection-label
  visibility hidden

.homepage__nft-collection-link:hover .homepage__nft-collection-label
  visibility visible

.homepage__animate-selected-nft-collection .homepage__nft-collection-thumbnail-img
  opacity 0.3

.animate-unselected-nft-collection
  transform scale(0.8, 0.8)
  height 20px
  right -8px
  padding 0

.homepage__animate-selected-nft-collection
  top 0
  transform initial
  right calc(50% - 75px)
  font-size 2.1rem
  position fixed
  padding 0.3rem 0.5rem 0
  // backdrop-filter grayscale(1)

  @media (min-width 700px)
    font-size 3rem
    right calc(50% - 100px)

</style>

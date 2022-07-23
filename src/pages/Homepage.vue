<template>
  <DarkModeSwitcher />
  <div class="homepage__titles">
    <div
      :class="[
        'homepage__title homepage__title-sans-topic',
        {
          'homepage__animate-selected-sans-topic':
            selectedTopic === Topics.SANS_TOPIC
        },
        {
          'homepage__unselected-title animate-unselected-sans-topic':
            selectedTopic && selectedTopic !== Topics.SANS_TOPIC
        }
      ]"
      @click="selectTopic(Topics.SANS_TOPIC)"
    >
      <img
              src="../assets/sans-topic-title-letters.png"
              class="homepage__title-sans-topic-img"
              alt="sans topic"
          />
    </div>

    <h1
      :class="[
        'homepage__title  homepage__title-geometry',
        {
          'homepage__animate-selected-geometry':
            selectedTopic === Topics.GEOMETRY
        },
        {
          'homepage__unselected-title animate-unselected-geometry':
            selectedTopic && selectedTopic !== Topics.GEOMETRY
        }
      ]"
      @click="selectTopic(Topics.GEOMETRY)"
    >
      geometry
    </h1>

    <h1
      :class="[
        'homepage__title  homepage__title-node-avatars',
        {
          'homepage__animate-selected-node-avatars':
            selectedTopic === Topics.NODE_AVATARS
        },
        {
          'homepage__unselected-title animate-unselected-node-avatars':
            selectedTopic && selectedTopic !== Topics.NODE_AVATARS
        }
      ]"
      @click="selectTopic(Topics.NODE_AVATARS)"
    >
      node avatars
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
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Pieces from '@/components/Pieces.vue'
import { Topics } from '@/components/piecesData'
import usePieces from '@/J/usePieces'
import { useRouter } from 'vue-router'
import DarkModeSwitcher from '@/components/DarkModeSwitcher.vue'
import Contact from '@/components/Contact.vue'
const { piecesNodeAvatars, piecesSansTopic, piecesGeometry } = usePieces()
const { currentRoute } = useRouter()
const router = useRouter()

const selectedTopic = ref(currentRoute.value.params.topic as Topics | undefined)

const selectTopic = (topic: Topics) => {
  if (selectedTopic.value === topic) {
    selectedTopic.value = undefined
    router.push('/')
    return
  }
  router.push(`/${topic}`)
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
  padding 0.3rem 1rem
  border-radius 2px


.homepage__unselected-title
  background-image linear-gradient(#fff, ghostwhite)
  box-shadow 2px 1px 10px 0 rgb(0 0 0 / 20%)


.homepage__title:hover
  transition all 0.2s
  opacity 1
  // background-color black
  // color #fff
  // background-image none


// Node Avatars
.homepage__title-node-avatars
  font-family RalewayDots, Helvetica, Arial, sans-serif
  font-size 1.2rem
  top 10vh
  font-weight normal
  position absolute
  margin-left auto
  text-transform uppercase
  left 15vw


.animate-unselected-node-avatars
  transform scale(0.8, 0.7) rotate(-89deg)
  top 150px
  left -70px


.homepage__animate-selected-node-avatars
  top 0
  transform initial
  left calc(50% - 160px)
  font-size 2.5rem
  position fixed
  backdrop-filter grayscale(1)


// Geometry
.homepage__title-geometry
  font-family BungeeHairline, Helvetica, Arial, sans-serif
  font-size 1.5rem
  font-weight normal
  line-height 1
  color initial
  position absolute
  top 50vh
  left 15vw


.animate-unselected-geometry
  transform scale(0.8, 0.5) rotate(-92deg)
  left -70px


.homepage__animate-selected-geometry
  font-size 2.5rem
  transform initial
  top 0
  left calc(50% - 125px)
  position fixed
  backdrop-filter grayscale(1)


// Sans Topic
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
  width 310px
  height auto

  @media (min-width 700px)
    width 410px

.animate-unselected-sans-topic
  transform scale(0.35, 0.3) rotate(89deg)
  height 55px
  right -154px

  @media (min-width 700px)
    right -200px


.homepage__animate-selected-sans-topic
  top 0
  transform initial
  right calc(50% - 150px)
  font-size 3.5rem
  position fixed
  padding 1rem 0
  backdrop-filter grayscale(1)

</style>

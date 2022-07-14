<template>
  <DarkModeSwitcher />
  <div class="homepage__titles">
    <h1
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
      sans topic
    </h1>

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

    <div
class="homepage__contact"
@click="showContactModal"
>
contact
</div>
    <Transition name="fade">
      <div
        v-if="isContactModalVisible"
        class="homepage__contact-modal-backdrop"
        @click="isContactModalVisible = false"
      />
    </Transition>

    <Transition name="fade">
      <div
v-if="isContactModalVisible"
class="homepage__contact-modal"
>
        <div class="homepage__contact-modal-content">
          <!-- <h1>Jan Mikšík</h1> -->
          <!-- <p>
           ... email is the most certain  ..
        </p> -->
          <div class="homepage__soc-links">
            <a
              class="homepage__soc-link"
              href="mailto: jan.miksik.g@gmail.com"
            >
              <img
                loading="lazy"
                src="../assets/email.svg"
                width="35"
                alt="email"
                :style="randomizePosition()"
            /></a>
            <a
              class="homepage__soc-link"
              href="https://www.instagram.com/miksik.jan/"
              target="_blank"
              ><img
                loading="lazy"
                src="../assets/instagram.svg"
                width="27"
                alt="instagram"
                :style="randomizePosition()"
            /></a>

            <a
              class="homepage__soc-link"
              href="https://www.facebook.com/jan.miksik.1/"
              target="_blank"
              ><img
                loading="lazy"
                src="../assets/fb.svg"
                width="26"
                alt="facebook"
                :style="randomizePosition()"
            /></a>
            <a
              class="homepage__soc-link"
              href="https://twitter.com/MiksikJan"
              target="_blank"
              ><img
                loading="lazy"
                src="../assets/twitter.svg"
                width="30"
                alt="twitter"
                :style="randomizePosition()"
            /></a>
          </div>
        </div>
      </div>
    </Transition>
  </div>

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
const { piecesNodeAvatars, piecesSansTopic, piecesGeometry } = usePieces()
const { currentRoute } = useRouter()
const router = useRouter()

const selectedTopic = ref(currentRoute.value.params.topic as Topics | undefined)

const isContactModalVisible = ref(false)

const showContactModal = () => {
  isContactModalVisible.value = true
}

const generateRandomNumberPlusMinus = (max: number) => {
  return Math.floor((Math.random() * max + 1) * (Math.random() - 0.5) * 2)
}

const randomRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const randomizePosition = () => {
  return {
    transform: `scale(${
      randomRange(7, 12) / 10
    }) translateY(${generateRandomNumberPlusMinus(
      30
    )}px) translateX(${generateRandomNumberPlusMinus(50)}px)`
  }
}

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

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

.homepage__titles {
  position: relative;
}

.homepage__title {
  transition: all 0.2s;
  white-space: nowrap;
  cursor: cell;
  margin: 0;
  padding: 0.3rem 1rem;
  border-radius: 2px;
}

.homepage__unselected-title {
  background-image: linear-gradient(#fff, ghostwhite);
  box-shadow: 2px 1px 10px 0 rgb(0 0 0 / 20%);
}

.homepage__title:hover {
  transition: all 0.2s;
  background-color: black;
  color: #fff;
  background-image: none;
}

/* Node Avatars */
.homepage__title-node-avatars {
  font-family: RalewayDots, Helvetica, Arial, sans-serif;
  font-size: 1.2rem;
  top: 10vh;
  font-weight: normal;
  position: absolute;
  margin-left: auto;
  text-transform: uppercase;
  left: 15vw;
}

.animate-unselected-node-avatars {
  transform: scale(0.8, 0.7) rotate(-89deg);
  top: 150px;
  left: -70px;
}

.homepage__animate-selected-node-avatars {
  top: 0;
  transform: initial;
  left: calc(50% - 160px);
  font-size: 2.5rem;
  position: fixed;
  backdrop-filter: grayscale(1);
}

/* Geometry */
.homepage__title-geometry {
  font-family: BungeeHairline, Helvetica, Arial, sans-serif;
  font-size: 1.5rem;
  font-weight: normal;
  line-height: 1;
  color: initial;
  position: absolute;
  top: 50vh;
  left: 15vw;
}

.animate-unselected-geometry {
  transform: scale(0.8, 0.5) rotate(-92deg);
  left: -70px;
}

.homepage__animate-selected-geometry {
  font-size: 2.5rem;
  transform: initial;
  top: 0;
  left: calc(50% - 125px);
  position: fixed;
  backdrop-filter: grayscale(1);
}

/* Sans Topic */
.homepage__title-sans-topic {
  font-family: PMarker, Helvetica, Arial, sans-serif;
  font-size: 3.5rem;
  padding: 0 1rem 0.7rem;
  font-weight: normal;
  color: initial;
  line-height: 1;
  right: calc(50% - 150px);
  top: 25vh;
  position: absolute;
  cursor: crosshair;
}

.animate-unselected-sans-topic {
  transform: scale(0.35, 0.3) rotate(89deg);
  height: 55px;
  right: -139px;
}

.homepage__animate-selected-sans-topic {
  top: 0;
  transform: initial;
  right: calc(50% - 150px);
  font-size: 3.5rem;
  position: fixed;
  backdrop-filter: grayscale(1);
}

.homepage__contact {
  position: fixed;
  box-shadow: inset 2px 1px 10px 0 rgb(0 0 0 / 12%);
  box-shadow: inset 2px 1px 10px 0 rgb(0 0 0 / 12%);
  bottom: 0;
  left: 0;
  padding: 0.3rem;
  color: #6ebb94a6;
  writing-mode: vertical-rl;
  text-orientation: upright;
  cursor: cell;
  transform: rotate(-1deg);
}

.homepage__contact:hover {
  transition: all 0.2s;
  background-color: black;
  color: #fff;
  background-image: none;
}

.homepage__contact-modal-backdrop {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  height: 140vh;
  z-index: 1;
  background-color: rgb(0 0 0 / 50%);
  backdrop-filter: blur(1px) grayscale(1);
  transition: all 0.5s;
}

.dark-mode .homepage__contact-modal-backdrop {
  background-color: rgb(255 255 255 / 50%);
}

.homepage__contact-modal {
  transition: all 0.2s;
  background-color: #eee;
  padding: 1rem;
  text-align: left;
  color: #515151;
  border-radius: 350px;
  z-index: 10;
  position: fixed;
  width: 350px;
  height: 350px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.dark-mode .homepage__contact-modal {
  background-color: #272727;
}

.homepage__contact-modal-content {
  text-align: center;
}

.homepage__soc-link {
  margin: 2rem;
}

.homepage__soc-links {
  margin-top: 3.5rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-flow: row wrap;
}

/* / Animation / */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from {
  opacity: 0;
}

.fade-leave-to {
  opacity: 0;
}
</style>

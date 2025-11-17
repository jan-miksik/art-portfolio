<template>
  <div
    class="about"
    :style="aboutStyle"
    @click="handleOpenModal"
  >
  About
</div>

<Teleport to="body">
  <div v-if="isModalOpen" class="about__modal-backdrop" @click="handleCloseModal" />
  <div v-if="isModalOpen" class="about__modal">
    <img
      src="/close.svg"
      width="30"
      height="30"
      @click="handleCloseModal"
      class="about__close-modal"
    />

    <h1>About</h1>

    <h3>intro</h3>
    <p>
      These days I primarily do digital artworks. Drawing on iPad, programming and sometimes a bit beyond that. This eventually led me into the crypto worlds(NFTs, distributed networks, etc.)    
    </p>

    <h3>influences</h3>
    <p>
      In retrospect, I see influences from psychedelic themes, children's art, surrealism, and other movements in my creation. Refined by my specific path in these topics. I didn't notice any strong predefined reason why I am doing this style and processing these motives. Exist many authors who are close to me. I don't take direct inspiration from them. We may be visiting the same or similar areas. I am trying to observe them from time to time.  </p>
    <h3>process</h3>
    <p>
      The main position from which I start is to just do whatever I should do. Layers used to be overwritten as the piece evolves. Sometimes I just randomly race with the pen and watch what this produces. Other times I put more effort into the execution. I rarely work with predefined composition or theme. This provides a surprising effect, because I don't have a clear idea of what the final picture will be. One of the main tendencies is to loose control and enable reflection of what should come out.    </p>

    <h3>digital and on-chain</h3>
    <p>
      In recent times I prefer digital creation on blockchain/on-chain. What I really like about this are: movability, persistence and easier management in general. It has significantly lower dependence on physical space and materials. The final piece is also much easier to collect and transport. Plus it has very clear and traceable paths. That makes it possible even for somebody with minimal knowledge of this technology to recognise and verify the origin by themselves. The NFT and on-chain environment still feels nascent compared to the established art world. Due to the nature of the crypto space, it can be easier to fall into money-driven approaches. Anyway, I believe in the future of this environment and hope that there will be more intersection with the rooted art world. One direction which I want to explore is combinations of physical items with the on-chain.    
    </p>

    <h3>history and these days</h3>
    <p>
      The origin of my path to art is based in graffiti and hip-hop, which started in elementary school through my classmate. It has some portion of violence in the whole process. During this time, I was also interested in PC and technology, primarily as a consumer- playing games, watching videos, etc. My first high school was an IT-focused type of school. However, at that time I also drew a lot and started visiting an art interest group in an art high school. After a year and a half, I switched out from the IT school into the art school. And later continued at an art academy. Over time, my connection to hip-hop culture and graffiti started weakening and remained more like a reference to the past. I really like some parts of that space and revisit them sometimes, however it remains out of my main focus. After art academy I struggled with sources for living and started learning programming. Within a year I found my first paid IT job. I spent several years as a developer with specialisation in crypto apps in last years, because I like it and this also solved my struggle with livelihood. That partially suppressed my art creation for some time. I kept drawing and started on the digital side of my creation. 
      Currently, I'm returning more to art creation with overlaps into the IT and crypto. 
    </p>

    <h3>viewer engagement</h3>
    <p>
      When I think about what viewers take from my pieces, I believe they extract whatever they need. This might be almost nothing or it could be a realisation which doesn't even have to be intentionally included in the piece, and the piece serves as a space which allows that. Reactions to the works are welcome. To a certain extent, I simulate this myself, imagining how a person, or a representative of something, might react to the piece.
    </p>
    <p class="about__last-update">
      Last update April 2025
    </p>
  </div>
</Teleport>

</template>

<script setup lang="ts">
import { LEFT_OFFSET, TOP_OFFSET } from '~/constants/layout'

const janMiksikComPosition = ref({
  x: 7000,
  y: 6500
})

const aboutStyle = computed(() => {
  return {
    left: `${janMiksikComPosition.value.x + LEFT_OFFSET}px`,
    top: `${janMiksikComPosition.value.y + TOP_OFFSET}px`,
  }
})

const isModalOpen = ref(false)

const handleOpenModal = () => {
  isModalOpen.value = true
}

const handleCloseModal = () => {
  isModalOpen.value = false
}

</script>

<style lang="stylus" scoped>
.about
  position absolute
  font-size: 5rem;
  color: black;
  z-index 10000
  cursor pointer
  text-decoration underline

  &:hover
    opacity 0.7

.about__modal
  position absolute
  z-index 100000
  top 1rem
  right 1rem
  left 1rem
  bottom 1rem
  background-color: white
  padding 2rem 2rem 10rem 2rem
  text-align left
  overflow: auto;
  max-width 800px;
  margin auto
  user-select: text;

  @media (max-width: 768px)
    padding 1rem 1rem 10rem 1rem


h1
  margin-top 0

h3
  font-size: 1.5rem;
  margin: 2rem 0 0 0;

p
  margin-top 0.5rem

.about__modal-backdrop
  position absolute
  z-index 1000
  top 0
  right 0
  left 0
  bottom 0
  background-color: rgba(0, 0, 0, 0.5)
  cursor url("/close.svg"), auto
  backdrop-filter blur(2px)

.about__close-modal
  position absolute
  top 1rem
  right 1rem
  z-index 10000
  cursor url("/close.svg"), auto

.dark-mode .about__close-modal
  cursor url("/close-white.svg"), auto

.dark-mode .about__modal-backdrop
  cursor url("/close-white.svg"), auto

.dark-mode .about__close-modal
  filter brightness(0) saturate(100%) invert(0) sepia(98%) saturate(8%) hue-rotate(174deg) brightness(96%) contrast(102%)


.about__last-update
  font-size 1rem
  margin-top 2rem
  text-align right

</style>


<template>
  <div
    class="about"
    :style="aboutStyle"
    @click="handleOpenModal"
  >
  CV

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

    <h1>CV</h1>

    <h3>Jan Mikšík</h3>
    <p>
      Born 1988 in Czech Republic - CZ<br>
      <!-- Resides and works in Prague, CZ and Hanoi, VN -->
    </p>

    <h3>education</h3>
    <p>
      2011 - 2017, MgA, AVU - Academy of Fine Arts in Prague, painting, CZ<br>
      2007 - 2011, high school diploma, SUPŠS in Valašském Meziříčí, field of applied painting, CZ
    </p>

    <h3>selected solo exhibitions</h3>
    <p>
      2025   <i>Zero, one and two</i>, Brix bar & hostel, Prague, CZ<br>
      2016   <i>Stopové množství</i>, IC of Prague 7, Prague, CZ<br>
      2015   <i>Víra a virus</i>, church in Strmilov, CZ<br>
      2013   <i>Automaticky</i>, gallery NF, Ústí nad Labem, CZ<br>
    </p>

    <h3>selected group exhibitions</h3>
    <p>
      2025   Brix bar & hostel, Prague, CZ<br>
      2017   <i>The exhibition of diploma theses</i>, National Gallery Prague – Veletržní palác, CZ<br>
      2015   Stadion Strahov, Prague, atelier of host teacher - Josef Dabernig, CZ<br>
      2015   Klub Final, Prague, CZ<br>
      2014   <i>Festival Kruh</i>, Menza, Ústí nad Labem, CZ<br>
      2014   <i>Zhruba</i>, gallery Bunkr, Most, with Bez, CZ<br>
      2014   <i>31 nebo 42</i>, gallery AVU, Prague, atelier Painting II, CZ<br>
      2014   <i>? a !</i>, Café Jericho, Prague, with Tomáš Kolařík, CZ<br>
    </p>

    <p class="about__last-update">
      Last update June 2025
    </p>
  </div>
</Teleport>

</template>

<script setup lang="ts">
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const janMiksikComPosition = ref({
  x: 7500,
  y: 7100
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
  margin: 2rem 0 .5rem 0;

p
  margin-top 0.5rem
  line-height 1.7

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


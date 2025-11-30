<template>
  <Transition name="images">
    <div class='pieces' ref="piecesRef" data-testid="pieces-container"
    >
      <PieceComponent v-for="(piece, index) in pieces"
        :key="piece?.id || index" 
        :piece="piece"
      />

      <BallThreeJs />
      <IntoPiecesCollectionContainer />
      <JanMiksikCom />
      <Collaborations />
      <About />
      <Cv />
      <Opensea />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import usePieces from '~/J/usePieces'

const { pieces } = usePieces()

const piecesRef = ref()

// Lazy load BallThreeJs component (contains Three.js ~600KB)
const BallThreeJs = defineAsyncComponent(() => import('~/components/BallThreeJs.vue'))

</script>

<style lang="stylus" scoped>
.pieces
  position absolute
  left 0
  right 0

// Animations
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0
</style>

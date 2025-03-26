<template>
  <Transition name="images">
    <div class='pieces' ref="piecesRef"
    >
      <PieceComponent v-for="(piece, index) in pieces"
        :key="piece?.id || index" 
        :piece="piece"
      />

      <BallThreeJs />
      <IntoPiecesCollectionContainer />
      <JanMiksikCom />
      <Collaborations />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import usePieces from '~/J/usePieces'

const { pieces } = usePieces()

const piecesRef = ref()

</script>

<style lang="stylus" scoped>
.pieces
  position absolute
  left 0
  right 0

// / Animation /
.images-enter-active
.images-leave-active
  transition all 0.5s

.images-enter-from
.images-leave-to
  opacity 0
</style>

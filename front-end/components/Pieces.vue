<template>
  <Transition name="images">
    <!-- v-if="props.pieces && props.type === props.selectedTopic" -->
    <div class='pieces'
    >
    <!-- [
      'pieces',
      `pieces--${props.selectedTopic}`,
      props.pieces && props.type === props.selectedTopic
        ? 'pieces__is-section-visible'
        : 'pieces__is-section-hidden'
    ]" -->
      <PieceComponent v-for="(piece, index) in pieces"
        :key="piece?.id || index" 
        :piece="piece"
      />

      <!-- <BallThreeJs v-if="Topics.GEOMETRY === props.type" /> -->
    </div>
  </Transition>
</template>

<script setup lang="ts">
// import Piece from '~/models/Piece'
import usePieces from '~/J/usePieces'

const { pieces } = usePieces()
// import { Topics } from '~/components/piecesData'

// interface Item {
//   id: number
//   name: string
//   position: {
//     x: number
//     y: number
//   }
// }

// const props = defineProps<{
//   pieces?: Piece[]
//   // type: Topics
//   // selectedTopic?: Topics
// }>()

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

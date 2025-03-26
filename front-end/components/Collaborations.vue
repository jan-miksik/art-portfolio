<template>
	<div class="collaborations" :style="collaborationsStyle">
		<label class="collaborations-label">collaborations (me on the coding side)</label>
		<div class="collaborations-items">
			<a
				class=""
				href="https://danieladeluna.ooo/"
				target="_blank"
				rel="noopener noreferrer"
    >
      danieladeluna.ooo
    </a>
		<a
      href="https://tomaskofron.com/"
      target="_blank"
			rel="noopener noreferrer"
    >
				tomaskofron.com
			</a>
		</div>
	</div>
</template>
  
<script setup lang="ts">
import { LEFT_OFFSET, TOP_OFFSET } from '~/appSetup'

const collaborationsPosition = ref({
	x: 11000,
	y: 2700
})

const collaborationsStyle = computed(() => {
return {
    left: `${collaborationsPosition.value.x + LEFT_OFFSET}px`,
    top: `${collaborationsPosition.value.y + TOP_OFFSET}px`,
}
})
  
</script>

<style lang="stylus" scoped>
.collaborations
	position absolute
	font-size: 5rem;
	color: black;
	width: max-content;

.collaborations-label
	font-size: 4rem;
	color: black;
	margin-bottom: 1rem;

.collaborations-items
	display: flex;
	flex-direction: column;
	gap: 1rem;

</style>
  
<template>
	<div class="collaborations" :style="collaborationsStyle">
		<label class="collaborations-label">collaborations (me on the coding side)</label>
		<div class="collaborations-items">
			<a
				class="deluna"
				href="https://danieladeluna.ooo/"
				target="_blank"
				rel="noopener noreferrer"
    >
      danieladeluna.ooo <img src="~/assets/external.svg" class="deluna__external-icon" width="35" height="35" alt="external" />
    </a>
		<a
			class="tomas"
      href="https://tomaskofron.com/"
      target="_blank"
			rel="noopener noreferrer"
    >
				tomaskofron.com <img src="~/assets/external.svg" class="tomas__external-icon" width="35" height="35" alt="external" />	
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

// alternative way style
// .deluna
// &:hover
// 	cursor: url("/mrak.png") 50 50, pointer;

// .tomas
// 	&:hover
// 		cursor: url("/sunglasses.png") 50 50, pointer;
  
</script>

<style lang="stylus" scoped>
.collaborations
	position absolute;
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
	align-items: center;
	gap: 1rem;

.deluna, .tomas
	position: relative;

.deluna__external-icon, .tomas__external-icon
	position: absolute;
	right: -30px;
	top: 20px;

</style>
  
<script setup>
import { onMounted, ref } from 'vue'
import { useAppKit } from '@reown/appkit/vue'

const modal = ref()

onMounted(() => {
  modal.value = useAppKit()
})
</script>

<template>
  <!-- Triggering the modal -->
  <button @click="modal?.open()">Connect Wallet</button>
</template>

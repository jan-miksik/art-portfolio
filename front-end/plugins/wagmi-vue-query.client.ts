// plugins/wagmi-vue-query.client.ts
import { defineNuxtPlugin } from '#app'
import { WagmiPlugin } from '@wagmi/vue'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { config } from '../config'

export default defineNuxtPlugin((nuxtApp) => {
  const queryClient = new QueryClient()

  nuxtApp.vueApp.use(WagmiPlugin, { config })
  nuxtApp.vueApp.use(VueQueryPlugin, { queryClient })
})

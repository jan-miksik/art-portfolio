// plugins/appkit.client.ts
import { defineNuxtPlugin } from '#app'
import { createAppKit } from '@reown/appkit/vue'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { optimism } from '@reown/appkit/networks'

export default defineNuxtPlugin(() => {
  const projectId = import.meta.env.VITE_REOWN_APPKIT_PROJECT_ID

  const metadata = {
    name: 'art-portfolio-jan-miksik',
    description: 'drawings, digital and crypto pieces, paintings and others',
    url: 'https://janmiksik.ooo',
    icons: ['https://janmiksik.ooo/favicon.ico']
  }

  const networks: [typeof optimism] = [optimism]

  const wagmiAdapter = new WagmiAdapter({
    projectId,
    networks
  })

  createAppKit({
    adapters: [wagmiAdapter],
    networks,
    metadata,
    projectId,
    features: {
      email: false,
      socials: [],
      analytics: true
    }
  })
})

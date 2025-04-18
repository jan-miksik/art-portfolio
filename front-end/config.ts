import { http, createConfig } from '@wagmi/vue'
import { sepolia, optimism } from '@wagmi/vue/chains'

export const config = createConfig({
  chains: [optimism, sepolia],
  transports: {
    [optimism.id]: http(),
    [sepolia.id]: http(),
  },
})


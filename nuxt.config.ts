import { defineNuxtConfig } from "nuxt/config"
export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  ssr: false,
  srcDir: 'front-end/',
  components: {
    dirs: [
      '~/components',
    ]
  },
  vite: {
    server: {
      // Povolte HMR prostřednictvím zabezpečeného WebSocketu (wss)
      hmr: {
        clientPort: parseInt(process.env.GITHUB_CODESAPCE_PORT || '', 10) || 24678,
        protocol: 'wss'
      }
    }
  }
})

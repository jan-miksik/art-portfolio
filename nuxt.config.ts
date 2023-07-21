import { defineNuxtConfig } from "nuxt/config"
// import uuidPolyfill from '~/plugins/uuid-polyfill'

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
  modules: [
    '@vueuse/nuxt',
    'nuxt-swiper',
  ],
  plugins: [
    { src: '~/plugins/matomo-plugin.js', ssr: false }
  ],
  // plugins: ['~/plugins/uuid-polyfill.js'],
  // vite: {
  //   server: {
  //     // Povolte HMR prostřednictvím zabezpečeného WebSocketu (wss)
  //     hmr: {
  //       clientPort: parseInt(process.env.GITHUB_CODESAPCE_PORT || '', 10) || 24678,
  //       protocol: 'wss'
  //     }
  //   }
  // }
})

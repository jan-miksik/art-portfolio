import { defineNuxtConfig } from "nuxt/config"
const title = 'Jan Mikšík'
const url = 'https://janmiksik.ooo'
const mainImage = 'https://janmiksik.ooo/front-image-of-web-(aim).webp'
const type = 'website'
const description = 'drawings, digital and crypto pieces, paintings and further'
const twitterCard = 'summary_large_image'

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
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title,
      link: [{ rel: 'icon', type: 'image/ico', href: '/favicon.ico' }],
      meta: [
        { name: title, content: '' },

        // Open graph / Facebook
        { property: 'og:title', content: title },
        { property: 'og:image', content: mainImage },
        { property: 'og:url', content: url },
        { property: 'og:type', content: type },
        { property: 'og:description', content: description },

        // Twitter
        { name: 'twitter:title', content: title },
        { name: 'twitter:image', content: mainImage },
        { name: 'twitter:url', content: url },
        // { name: 'twitter:site', content: twitterSite },
        { name: 'twitter:card', content: twitterCard },
        { name: 'twitter:description', content: description }
      ],
      script: [
        {
          src: '//gc.zgo.at/count.js', // URL scriptu GoatCounter
          async: true,
          'data-goatcounter': 'https://janmiksik.goatcounter.com/count', // URL účtu GoatCounter
        },
      ],
    }
  },
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

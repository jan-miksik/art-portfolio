const title = 'Jan Mikšík'
const url = 'https://janmiksik.ooo'
const mainImage = 'https://janmiksik.ooo/soc-share-(aim).png'
const type = 'website'
const description = 'drawings, digital and crypto pieces, paintings and others'
const twitterCard = 'summary_large_image'

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  nitro: {
    preset: 'cloudflare-pages',
    // Ensure all HTTP methods are supported for API routes
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    }
  },
  devtools: { enabled: true },
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
  runtimeConfig: {
    // Server-only (private) - not exposed to client
    // Use non-VITE_ prefixed vars for server-side secrets (Cloudflare compatible)
    contentfulManagementToken: process.env.CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN || process.env.VITE_CONTENTFUL_CONTENT_MANAGEMENT_ACCESS_TOKEN,
    contentfulSpaceId: process.env.CONTENTFUL_SPACE_ID || process.env.VITE_CONTENTFUL_SPACE_ID,
    // Public (exposed to client) - safe for read-only operations
    public: {
      contentfulAccessToken: process.env.VITE_CONTENTFUL_ACCESS_TOKEN,
    }
  },
  // modules: [
  //   '@vueuse/nuxt',
  //   'nuxt-swiper',
  // ],
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
    }
  },
})

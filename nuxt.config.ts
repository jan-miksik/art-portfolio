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
    routeRules: {
      // Apply to your specific endpoint
      '/api/contentful/get-entry': {
        // specific headers to disable caching
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      },
      // Ensure all API routes are handled by functions
      // NOTE: CORS is permissive here because authentication is handled by Cloudflare Access
      // in production. If deploying without Cloudflare Access, restrict CORS and add auth checks.
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private'
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
    contentfulManagementToken: process.env.NUXT_CONTENTFUL_MANAGEMENT_TOKEN,
    contentfulSpaceId: process.env.NUXT_CONTENTFUL_SPACE_ID,
    // Public (exposed to client) - safe for read-only operations
    public: {
      contentfulAccessToken: process.env.NUXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
    }
  },
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

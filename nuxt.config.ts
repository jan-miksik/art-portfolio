import { defineNuxtConfig } from "nuxt/config"
export default defineNuxtConfig({
  typescript: {
    strict: true
  },
  ssr: false,
  srcDir: 'front-end/',
  // modules: ['@nuxtjs/axios'],
  // plugins: ['~/plugins/url-helpers.js'],
  // dir: {
  //   components: 'views' // Nuxt will look for the views/ instead of the pages/ folder
  // }
  components: {
    dirs: [
      '~/components',
    ]
  },
  // serverMiddleware: [
  //   {
  //     path: '/proxy',
  //     handler: './server-middleware/proxy.ts',
  //   },
  // ],
})

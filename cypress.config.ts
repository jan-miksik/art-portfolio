import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // Load Cloudflare Access service token credentials from environment
      const cfClientId = process.env.CF_CLIENT_ID
      const cfClientSecret = process.env.CF_CLIENT_SECRET

      if (cfClientId && cfClientSecret) {
        config.env.CF_CLIENT_ID = cfClientId
        config.env.CF_CLIENT_SECRET = cfClientSecret
      }

      // Register custom task for logging
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
      })

      return config
    },
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },
})


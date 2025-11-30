import { validateEnv } from '~/server/utils/validateEnv'

export default defineNitroPlugin(() => {
  // Runs once during server bootstrap so required env vars are validated early.
  // Use useRuntimeConfig() to access env vars in Cloudflare Pages runtime
  const config = useRuntimeConfig()
  validateEnv(config)
})


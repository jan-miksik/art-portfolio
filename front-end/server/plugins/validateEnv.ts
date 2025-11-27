import { validateEnv } from '~/server/utils/validateEnv'

export default defineNitroPlugin(() => {
  // Runs once during server bootstrap so required env vars are validated early.
  validateEnv()
})


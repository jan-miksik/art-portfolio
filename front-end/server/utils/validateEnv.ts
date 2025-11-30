export const validateEnv = () => {
  const required = {
    NUXT_CONTENTFUL_SPACE_ID: process.env.NUXT_CONTENTFUL_SPACE_ID,
    NUXT_CONTENTFUL_MANAGEMENT_TOKEN: process.env.NUXT_CONTENTFUL_MANAGEMENT_TOKEN,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}


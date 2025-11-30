/**
 * Validates required environment variables
 * Uses runtimeConfig to access env vars in Cloudflare Pages runtime
 * In Cloudflare Pages, environment variables are injected via runtimeConfig, not process.env
 * @param config - Runtime config from useRuntimeConfig()
 */
export const validateEnv = (config: ReturnType<typeof useRuntimeConfig>) => {
  const spaceId = config.contentfulSpaceId
  const managementToken = config.contentfulManagementToken

  const required = {
    NUXT_CONTENTFUL_SPACE_ID: spaceId,
    NUXT_CONTENTFUL_MANAGEMENT_TOKEN: managementToken,
  }

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key)

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}


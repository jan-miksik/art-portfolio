/**
 * Contentful API polling configuration constants
 */
export const CONTENTFUL_POLLING = {
  MAX_ATTEMPTS: 5,
  INITIAL_DELAY: 100,
  MAX_DELAY: 2000,
  BACKOFF_MULTIPLIER: 1.5
} as const satisfies {
  MAX_ATTEMPTS: number
  INITIAL_DELAY: number
  MAX_DELAY: number
  BACKOFF_MULTIPLIER: number
}


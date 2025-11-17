/**
 * Logger utility that can be disabled in production
 * Uses Nuxt's environment detection to only log in development
 */

const isDevelopment = import.meta.env.DEV

interface Logger {
  log: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

const createLogger = (): Logger => {
  if (!isDevelopment) {
    // In production, return no-op functions
    return {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {},
      debug: () => {}
    }
  }

  // In development, use console methods
  return {
    log: (...args: unknown[]) => console.log(...args),
    error: (...args: unknown[]) => console.error(...args),
    warn: (...args: unknown[]) => console.warn(...args),
    info: (...args: unknown[]) => console.info(...args),
    debug: (...args: unknown[]) => console.debug(...args)
  }
}

export const logger = createLogger()


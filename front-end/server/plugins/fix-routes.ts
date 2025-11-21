/**
 * Nitro plugin to fix _routes.json after build
 * Removes overlapping rules that cause Cloudflare deployment errors
 */

// Type extension for NitroApp to access options (not exposed in public type definition)
// The options property exists at runtime but is not included in the NitroApp type definition
interface NitroAppWithOptions {
  options: {
    output: {
      dir: string
    }
  }
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('close', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    
    try {
      // Type assertion: NitroApp has options at runtime, but TypeScript types don't expose it
      const nitroWithOptions = nitro as unknown as NitroAppWithOptions
      
      // Skip in dev mode or if output directory is not available (only needed during build)
      if (!nitroWithOptions.options?.output?.dir) {
        return
      }
      
      const routesPath = path.join(nitroWithOptions.options.output.dir, '_routes.json')
      const routesContent = await fs.readFile(routesPath, 'utf-8')
      const routes = JSON.parse(routesContent)
      
      // Remove overlapping rules: if "/*" exists, remove any "/api/*" or similar
      if (routes.include?.includes('/*')) {
        // Keep only "/*" since it catches all routes
        routes.include = ['/*']
      }
      
      await fs.writeFile(routesPath, JSON.stringify(routes, null, 2))
      console.log('✅ Fixed _routes.json to remove overlapping rules')
    } catch (error) {
      // If file doesn't exist or can't be read, that's okay
      console.warn('⚠️ Could not fix _routes.json:', error)
    }
  })
})



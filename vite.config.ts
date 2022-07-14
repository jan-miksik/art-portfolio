import * as path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssNesting from 'postcss-nesting'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [
        postcssNesting
      ]
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`
    }
  }
})

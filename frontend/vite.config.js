import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // Listen on all interfaces so other devices on the same network can open it
    host: true,
    port: 5173,
    allowedHosts: true,
    proxy: {
      // All API calls go to the single unified backend (port 3000)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  },
})

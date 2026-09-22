/**
 * Vite Configuration — Login frontend
 * - Serves on port 3007 and auto-opens the browser on startup.
 * - API calls are proxied to the login backend on port 3006.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3007,
    host: true,
    open: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3006',
        changeOrigin: true
      }
    }
  }
})
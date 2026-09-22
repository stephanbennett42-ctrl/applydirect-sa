/**
 * Vite Configuration — Admin frontend
 * - Serves on port 3005 and auto-opens the browser on startup.
 * - API calls are proxied to the admin backend on port 3003.
 */
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    // Listen on all network interfaces so other devices (phones/tablets)
    // on the same network can open this site via http://<this-ip>:3005
    host: true,
    port: 3005,
    open: true,
    // Accept requests from any host/IP so LAN devices are not rejected.
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true
      }
    }
  }
})
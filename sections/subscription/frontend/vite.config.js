/**
 * Vite Configuration — Subscription frontend
 * - Serves on port 3004 and auto-opens the browser on startup.
 * - API calls are proxied to the subscription backend on port 3002.
 */
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    // Listen on all network interfaces so other devices (phones/tablets)
    // on the same network can open this site via http://<this-ip>:3004
    host: true,
    port: 3004,
    open: false,
    // Accept requests from any host/IP so LAN devices are not rejected.
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3002",
        changeOrigin: true,
      },
    },
  },
});

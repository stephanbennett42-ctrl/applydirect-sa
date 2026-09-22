import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import vueDevTools from "vite-plugin-vue-devtools";

export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5173,
    open: true,
    allowedHosts: true,
    proxy: {
      "/api/auth": { target: "http://localhost:3002", changeOrigin: true },
      "/api/packages": { target: "http://localhost:3002", changeOrigin: true },
      "/api/orders": { target: "http://localhost:3002", changeOrigin: true },
      "/api/jobs": { target: "http://localhost:3002", changeOrigin: true },
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});

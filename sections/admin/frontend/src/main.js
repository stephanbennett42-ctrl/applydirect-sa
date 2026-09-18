/**
 * UniApply Admin — Main Entry Point
 * Bootstraps the Vue 3 application.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')

// PWA service worker (offline fallback). Fails silently on non-secure contexts.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
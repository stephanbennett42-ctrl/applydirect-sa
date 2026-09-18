/**
 * UniApply Login — Main Entry Point
 * Bootstraps the Vue 3 application.
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
app.use(router)
app.mount('#app')
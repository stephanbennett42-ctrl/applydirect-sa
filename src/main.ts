import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css' // Ensures custom South African flag styles are loaded

const app = createApp(App)
app.use(router)
app.mount('#app')
import { createRouter, createWebHistory } from 'vue-router'
import InstitutionsView from '../views/InstitutionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/institutions'
    },
    {
      path: '/institutions',
      name: 'institutions',
      component: InstitutionsView
    }
  ]
})

export default router
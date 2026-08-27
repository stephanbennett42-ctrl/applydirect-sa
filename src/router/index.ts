import { createRouter, createWebHistory } from 'vue-router'
import InstitutionsView from '../views/InstitutionsView.vue'
import SavedView from '../views/SavedView.vue'

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
    },
    {
      path: '/saved',
      name: 'saved',
      component: SavedView
    }
  ]
})

export default router
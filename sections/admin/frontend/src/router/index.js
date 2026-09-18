/**
 * Vue Router Configuration — Admin module
 *
 * Routes:
 *   /admin/login : admin sign-in
 *   /admin       : admin dashboard (requires admin)
 */
import { createRouter, createWebHistory } from 'vue-router'
import { isAdmin } from '../store/auth.js'

import AdminLogin from '../views/AdminLogin.vue'
import AdminDashboard from '../views/AdminDashboard.vue'

const routes = [
  { path: '/', redirect: '/admin' },
  { path: '/admin/login', name: 'AdminLogin', component: AdminLogin },
  { path: '/admin', name: 'Admin', component: AdminDashboard, meta: { requiresAdmin: true } },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/admin' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

/**
 * Global navigation guard.
 * Only logged-in admins may view the dashboard.
 */
router.beforeEach((to, from, next) => {
  if (to.name === 'AdminLogin' && isAdmin()) {
    next({ name: 'Admin' })
  } else if (to.meta.requiresAdmin && !isAdmin()) {
    next({ name: 'AdminLogin' })
  } else {
    next()
  }
})

export default router
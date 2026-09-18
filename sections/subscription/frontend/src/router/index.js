/**
 * Vue Router Configuration — Subscription module
 *
 * Routes:
 *   /              : redirect to payment plans
 *   /login         : student login (required to check out)
 *   /payment-plan  : choose a subscription plan
 *   /payment       : checkout / payment
 */
import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '../store/auth.js'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import PaymentPlan from '../views/PaymentPlan.vue'
import Payment from '../views/Payment.vue'
import GraduateJobs from '../views/GraduateJobs.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/payment-plan', name: 'PaymentPlan', component: PaymentPlan },
  { path: '/payment', name: 'Payment', component: Payment, meta: { requiresAuth: true } },
  { path: '/jobs', name: 'GraduateJobs', component: GraduateJobs },

  // Catch-all
  { path: '/:pathMatch(.*)*', redirect: '/payment-plan' }
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
 * Checkout requires a logged-in (approved) user.
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && isLoggedIn()) {
    next({ name: 'PaymentPlan' })
  } else {
    next()
  }
})

export default router
import { createRouter, createWebHistory } from 'vue-router'
import { isLoggedIn } from '../store/auth.js'

// Primary Site Views
import InstitutionsView from '../views/InstitutionsView.vue'
import AboutView from '../views/AboutView.vue'
import Portfolio from '../views/Portfolio.vue'
import ContactView from '../views/contact.vue'
import SavedView from '../views/SavedView.vue'

// Auth, Subscription & Graduate Job Views
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import PaymentPlan from '../views/PaymentPlan.vue'
import Payment from '../views/Payment.vue'
import PaymentReturn from '../views/PaymentReturn.vue'
import GraduateJobs from '../views/GraduateJobs.vue'
import Subscription from '../views/subscription.vue' // Imported with exact lowercase file casing

const routes = [
  {
    path: '/',
    redirect: '/institutions',
  },
  {
    path: '/institutions',
    name: 'Institutions',
    component: InstitutionsView,
    alias: '/universities',
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Portfolio,
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: Portfolio,
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
  },
  {
    path: '/saved',
    name: 'Saved',
    component: SavedView,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    path: '/payment-plan',
    name: 'PaymentPlan',
    component: PaymentPlan,
  },
  {
    path: '/subscription',
    name: 'Subscription',
    component: Subscription,
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment,
    meta: { requiresAuth: true },
  },
  {
    path: '/payment/return',
    name: 'PaymentReturn',
    component: PaymentReturn,
  },
  {
    path: '/jobs',
    name: 'GraduateJobs',
    component: GraduateJobs,
  },

  // Catch-all redirect for unmatched paths
  {
    path: '/:pathMatch(.*)*',
    redirect: '/institutions',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

/**
 * Global navigation guard:
 * Redirects unauthenticated users attempting to checkout to login.
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
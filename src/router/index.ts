import { createRouter, createWebHistory } from 'vue-router'
import InstitutionsView from '../views/InstitutionsView.vue'
import AboutView from '../views/AboutView.vue'

// Placeholder views for remaining pages
const ProfileView = { template: '<div class="container my-5"><h2>Profile Page</h2></div>' }
const ContactView = { template: '<div class="container my-5"><h2>Contact Page</h2></div>' }
const SubscriptionView = { template: '<div class="container my-5"><h2>Subscription Page</h2></div>' }

const routes = [
  { path: '/', redirect: '/universities' },
  { path: '/universities', name: 'Universities', component: InstitutionsView },
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/contact', name: 'Contact', component: ContactView },
  { path: '/subscription', name: 'Subscription', component: SubscriptionView }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
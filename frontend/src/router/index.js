import { createRouter, createWebHistory } from "vue-router";
import InstitutionsView from "../views/InstitutionsView.vue";
import AboutView from "../views/AboutView.vue";
import Portfolio from "../views/Portfolio.vue";
import ContactView from "../views/contact.vue";
import SavedView from "../views/SavedView.vue";

// Subscription/payment lives in the separate subscription app (port 3004)
const SubscriptionRedirect = {
  template: '<div class="container my-5"><p>Opening the subscription &amp; payment page&hellip;</p></div>',
  mounted() {
    window.location.href = "http://localhost:3004";
  },
};

const routes = [
  {
    path: "/",
    redirect: "/institutions",
  },

  {
    path: "/institutions",
    name: "Institutions",
    component: InstitutionsView,
    alias: "/universities",
  },

  {
    path: "/profile",
    name: "Profile",
    component: Portfolio,
  },

  {
    path: "/portfolio",
    name: "Portfolio",
    component: Portfolio,
  },

  {
    path: "/about",
    name: "About",
    component: AboutView,
  },

  {
    path: "/contact",
    name: "Contact",
    component: ContactView,
  },

  {
    path: "/saved",
    name: "Saved",
    component: SavedView,
  },

  {
    path: "/subscription",
    name: "Subscription",
    component: SubscriptionRedirect,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
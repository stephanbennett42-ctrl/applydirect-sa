import { createRouter, createWebHistory } from "vue-router";
import InstitutionsView from "../views/InstitutionsView.vue";
import AboutView from "../views/AboutView.vue";
import Portfolio from "../views/Portfolio.vue";
import ContactView from "../views/contact.vue";
import SavedView from "../views/SavedView.vue";

// Temporary placeholder until the team's real Subscription page is added
const SubscriptionView = {
  template: '<div class="container my-5"><h2>Subscription Page</h2></div>',
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
    component: SubscriptionView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
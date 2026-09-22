import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn } from "../store/auth.js";
import InstitutionsView from "../views/InstitutionsView.vue";
import AboutView from "../views/AboutView.vue";
import Portfolio from "../views/Portfolio.vue";
import ContactView from "../views/contact.vue";
import SavedView from "../views/SavedView.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import PaymentPlan from "../views/PaymentPlan.vue";
import Payment from "../views/Payment.vue";
import GraduateJobs from "../views/GraduateJobs.vue";

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
    path: "/login",
    name: "Login",
    component: Login,
  },

  {
    path: "/register",
    name: "Register",
    component: Register,
  },

  {
    path: "/payment-plan",
    name: "PaymentPlan",
    component: PaymentPlan,
  },

  {
    path: "/payment",
    name: "Payment",
    component: Payment,
    meta: { requiresAuth: true },
  },

  {
    path: "/jobs",
    name: "GraduateJobs",
    component: GraduateJobs,
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

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && isLoggedIn()) {
    next({ name: "PaymentPlan" });
  } else {
    next();
  }
});

export default router;
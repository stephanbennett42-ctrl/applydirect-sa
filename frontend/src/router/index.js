import { createRouter, createWebHistory } from "vue-router";
import InstitutionsView from "../views/InstitutionsView.vue";
import AboutView from "../views/AboutView.vue";
import Portfolio from "../views/Portfolio.vue";
import ContactView from "../views/contact.vue";
import SavedView from "../views/SavedView.vue";

const LOGIN_APP_URL = "http://localhost:3007";

function isLoggedIn() {
  return Boolean(
    localStorage.getItem("uniapply_token") &&
    localStorage.getItem("uniapply_currentUser"),
  );
}

function importLoginSession(to) {
  const token = to.query.auth_token;
  const encodedUser = to.query.auth_user;

  if (!token || !encodedUser) return null;

  try {
    const user = JSON.parse(encodedUser);
    localStorage.setItem("uniapply_token", token);
    localStorage.setItem("uniapply_currentUser", JSON.stringify(user));

    const query = { ...to.query };
    delete query.auth_token;
    delete query.auth_user;

    return { path: to.path, query };
  } catch {
    return null;
  }
}

// Subscription/payment lives in the separate subscription app (port 3004)
const SubscriptionRedirect = {
  template:
    '<div class="container my-5"><p>Opening the subscription &amp; payment page&hellip;</p></div>',
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

router.beforeEach((to) => {
  const cleanedRoute = importLoginSession(to);
  if (cleanedRoute) return cleanedRoute;

  if (isLoggedIn()) return true;

  const requestedUrl = `${window.location.origin}${to.fullPath}`;
  window.location.href = `${LOGIN_APP_URL}/?redirect=${encodeURIComponent(requestedUrl)}`;

  return false;
});

export default router;

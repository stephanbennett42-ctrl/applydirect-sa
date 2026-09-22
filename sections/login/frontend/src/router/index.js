/**
 * Vue Router Configuration — Login module
 *
 * Routes:
 *   /          : login page
 *   /dashboard : post-login landing (requires auth)
 */
import { createRouter, createWebHistory } from "vue-router";
import { isLoggedIn } from "../store/auth.js";

import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },

  // Catch-all
  { path: "/:pathMatch(.*)*", redirect: "/" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

function mainAppRedirect(target = "http://localhost:5173/institutions") {
  const destination = new URL(target);
  destination.searchParams.set(
    "auth_token",
    localStorage.getItem("uniapply_token") || "",
  );
  destination.searchParams.set(
    "auth_user",
    localStorage.getItem("uniapply_currentUser") || "{}",
  );
  return destination.toString();
}

/**
 * Global navigation guard.
 * Dashboard requires a logged-in user; logged-in users skip the login page.
 */
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.name === "Login" && isLoggedIn()) {
    const redirect = to.query.redirect || "http://localhost:5173/institutions";
    window.location.href = mainAppRedirect(redirect);
    next(false);
  } else {
    next();
  }
});

export default router;

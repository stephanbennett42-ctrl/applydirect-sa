<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-navy sticky-top py-2">
    <div class="container-fluid px-3 px-md-4">
      <router-link
        to="/institutions"
        class="navbar-brand fw-bold fs-4 text-white me-lg-4"
        @click="closeMobileNav"
      >
        ApplyDirect-<span class="text-gold">SA</span>
      </router-link>

      <button
        class="navbar-toggler border-0"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
        aria-controls="navbarContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse mt-2 mt-lg-0"
        id="navbarContent"
        ref="navCollapse"
      >
        <div
          v-if="$route.path === '/institutions' || $route.path === '/'"
          class="d-flex flex-column flex-lg-row gap-2 my-2 my-lg-0 mx-auto w-100 max-w-lg"
        >
          <input
            v-model="searchFilter.searchQuery"
            type="text"
            class="form-control rounded-pill bg-light border-0 px-3"
            placeholder="Search university or city..."
            aria-label="Search university or city"
          />
          <select
            v-model="searchFilter.selectedProvince"
            class="form-select rounded-pill bg-light border-0"
            aria-label="Filter by province"
          >
            <option value="">All Provinces</option>
            <option>Gauteng</option>
            <option>Western Cape</option>
            <option>KwaZulu-Natal</option>
            <option>Eastern Cape</option>
            <option>Free State</option>
            <option>Limpopo</option>
            <option>Mpumalanga</option>
            <option>North West</option>
            <option>Northern Cape</option>
          </select>
          <select
            v-model="searchFilter.selectedType"
            class="form-select rounded-pill bg-light border-0"
            aria-label="Filter by institution type"
          >
            <option value="">All Types</option>
            <option>University</option>
            <option>TVET</option>
          </select>
        </div>

        <div
          class="navbar-nav d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-auto pt-2 pt-lg-0"
        >
          <router-link
            to="/institutions"
            class="sa-nav-tab tab-green text-center"
            @click="closeMobileNav"
            >Universities</router-link
          >
          <router-link
            to="/profile"
            class="sa-nav-tab tab-gold text-center"
            @click="closeMobileNav"
            >Profile</router-link
          >
          <router-link
            to="/about"
            class="sa-nav-tab tab-red text-center"
            @click="closeMobileNav"
            >About Us</router-link
          >
          <router-link
            to="/contact"
            class="sa-nav-tab tab-blue text-center"
            @click="closeMobileNav"
            >Contact</router-link
          >
          <router-link
            to="/subscription"
            class="sa-nav-tab tab-black text-center"
            @click="closeMobileNav"
            >Subscription</router-link
          >
          <router-link
            to="/profile"
            class="profile-avatar"
            :aria-label="
              currentUser
                ? `Open ${userFirstName || 'your'} profile`
                : 'Open profile'
            "
            title="Profile"
            @click="closeMobileNav"
            >{{ userInitials }}</router-link
          >
          <button type="button" class="logout-button" @click="logout">
            Log Out
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { Collapse } from "bootstrap";
import { getCurrentUser, logout as clearSession } from "../store/auth.js";

export default {
  name: "Navbar",
  props: { searchFilter: { type: Object, required: true } },
  data() {
    return { currentUser: this.getStoredUser() };
  },
  computed: {
    userFirstName() {
      return (
        this.currentUser?.firstName ||
        this.currentUser?.first_name ||
        ""
      ).trim();
    },
    userInitials() {
      if (!this.currentUser) return "?";
      const surname = (
        this.currentUser.lastName ||
        this.currentUser.last_name ||
        this.currentUser.surname ||
        ""
      ).trim();
      const initials =
        `${this.userFirstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
      return (
        initials || (this.currentUser.email?.charAt(0) || "?").toUpperCase()
      );
    },
  },
  watch: {
    "$route.fullPath"() {
      this.currentUser = this.getStoredUser();
    },
  },
  methods: {
    getStoredUser() {
      try {
        return getCurrentUser();
      } catch {
        return null;
      }
    },
    closeMobileNav() {
      const navCollapse = this.$refs.navCollapse;
      if (navCollapse?.classList.contains("show"))
        (Collapse.getInstance(navCollapse) || new Collapse(navCollapse)).hide();
    },
    logout() {
      clearSession();
      this.$router.push("/institutions");
    },
  },
};
</script>

<style scoped>
.bg-navy {
  background-color: #001242 !important;
}
.text-gold {
  color: #ffb81c !important;
}
.max-w-lg {
  max-width: 600px;
}
.sa-nav-tab {
  padding: 8px 18px;
  border-radius: 50rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  display: inline-block;
}
.sa-nav-tab:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.profile-avatar {
  align-items: center;
  background: #ffb81c;
  border: 2px solid #fff;
  border-radius: 50%;
  color: #001242;
  display: inline-flex;
  flex: 0 0 42px;
  font-size: 0.85rem;
  font-weight: 700;
  height: 42px;
  justify-content: center;
  text-decoration: none;
  width: 42px;
}
.profile-avatar:hover {
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.45);
  color: #001242;
  transform: translateY(-1px);
}
.logout-button {
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50rem;
  background: transparent;
  color: #fff;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}
.logout-button:hover {
  background: rgba(224, 60, 49, 0.9);
  border-color: #e03c31;
}
.tab-green.router-link-active,
.tab-green.router-link-exact-active {
  background: #007a3d !important;
  color: #fff !important;
}
.tab-gold.router-link-active,
.tab-gold.router-link-exact-active {
  background: #ffb81c !important;
  color: #000 !important;
}
.tab-red.router-link-active,
.tab-red.router-link-exact-active {
  background: #e03c31 !important;
  color: #fff !important;
}
.tab-blue.router-link-active,
.tab-blue.router-link-exact-active {
  background: #002395 !important;
  color: #fff !important;
}
.tab-black.router-link-active,
.tab-black.router-link-exact-active {
  background: #1a1a1a !important;
  color: #fff !important;
}
@media (max-width: 991.98px) {
  .profile-avatar {
    align-self: flex-start;
  }
}
</style>

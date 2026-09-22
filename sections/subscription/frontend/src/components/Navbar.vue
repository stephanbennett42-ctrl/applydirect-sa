<template>
  <header class="site-nav">
    <div class="nav-inner">
      <a
        :href="mainAppUrl('/institutions')"
        class="nav-brand"
        @click="closeMenu"
      >
        ApplyDirect-<span>SA</span>
      </a>

      <button
        class="nav-toggle"
        type="button"
        @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen ? 'true' : 'false'"
        aria-controls="subscription-nav-links"
        aria-label="Toggle navigation"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        id="subscription-nav-links"
        class="nav-links"
        :class="{ 'is-open': menuOpen }"
      >
        <a
          :href="mainAppUrl('/institutions')"
          class="nav-link"
          @click="closeMenu"
          >Universities</a
        >
        <a :href="mainAppUrl('/profile')" class="nav-link" @click="closeMenu"
          >Profile</a
        >
        <a :href="mainAppUrl('/about')" class="nav-link" @click="closeMenu"
          >About Us</a
        >
        <a :href="mainAppUrl('/contact')" class="nav-link" @click="closeMenu"
          >Contact</a
        >
        <router-link
          to="/payment-plan"
          class="nav-link subscription-link"
          :class="{
            'subscription-active':
              $route.path !== '/login' && $route.path !== '/register',
          }"
          @click="closeMenu"
        >
          Subscription
        </router-link>
        <a
          :href="mainAppUrl('/profile')"
          class="profile-avatar"
          :aria-label="`Open ${userInitials} profile`"
          title="Profile"
        >
          {{ userInitials }}
        </a>
      </nav>
    </div>
  </header>
</template>

<script>
import { getCurrentUser } from "../store/auth.js";

export default {
  name: "Navbar",
  data() {
    return {
      currentUser: getCurrentUser(),
      menuOpen: false,
    };
  },
  computed: {
    userInitials() {
      if (!this.currentUser) return "?";

      const firstName = this.currentUser.firstName?.trim() || "";
      const surname = this.currentUser.surname?.trim() || "";
      const initials =
        `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();

      return (
        initials || (this.currentUser.email?.charAt(0) || "?").toUpperCase()
      );
    },
  },
  methods: {
    mainAppUrl(path) {
      return `http://localhost:5173${path}`;
    },
    closeMenu() {
      this.menuOpen = false;
    },
  },
};
</script>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--primary-dark);
  color: var(--text-white);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 10px 30px;
  gap: 24px;
}

.nav-brand {
  font-size: 1.55rem;
  font-weight: 800;
  color: var(--text-white);
  white-space: nowrap;
}

.nav-brand span {
  color: var(--gold);
}

.nav-links {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  margin-left: auto;
}

.nav-link {
  padding: 9px 16px;
  border-radius: 999px;
  color: var(--text-white);
  font-size: 0.95rem;
  font-weight: 700;
  white-space: nowrap;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.14);
  color: var(--text-white);
}

.subscription-link.subscription-active {
  background: var(--gold);
  color: #101010;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.35);
}

.subscription-link.subscription-active:hover {
  background: var(--gold-light);
  color: #101010;
}

.profile-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 2px solid var(--text-white);
  border-radius: 50%;
  background: var(--gold);
  color: #001242;
  font-size: 0.85rem;
  font-weight: 800;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-avatar:hover {
  color: #001242;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.45);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 8px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 6px;
  cursor: pointer;
}

.nav-toggle span {
  display: block;
  height: 2px;
  width: 100%;
  background: var(--text-white);
  border-radius: 2px;
  transition: var(--transition-fast);
}

.nav-toggle[aria-expanded="true"] span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.nav-toggle[aria-expanded="true"] span:nth-child(2) {
  opacity: 0;
}

.nav-toggle[aria-expanded="true"] span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@media (max-width: 768px) {
  .nav-inner {
    padding: 10px 18px;
    flex-wrap: wrap;
  }

  .nav-toggle {
    display: flex;
  }

  .nav-links {
    display: none;
    width: 100%;
    margin-left: 0;
    padding: 8px 0 4px;
    flex-direction: column;
    align-items: stretch;
  }

  .nav-links.is-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    text-align: left;
  }

  .profile-avatar {
    align-self: flex-start;
  }
}
</style>

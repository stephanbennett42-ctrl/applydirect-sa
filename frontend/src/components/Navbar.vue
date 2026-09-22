<template>
  <header class="site-nav">
    <div class="container nav-inner">
      <router-link to="/" class="nav-brand">
        ApplyDirect <span>SA</span>
      </router-link>

      <nav class="nav-links">
        <router-link to="/payment-plan" class="nav-link">Payment Plans</router-link>
        <router-link to="/jobs" class="nav-link">Graduate Jobs</router-link>
        <router-link v-if="isLoggedIn()" to="/payment" class="nav-link">Checkout</router-link>
      </nav>

      <div class="nav-auth">
        <template v-if="isLoggedIn()">
          <span class="nav-user">Hi, {{ currentUser.firstName }}</span>
          <button class="nav-btn" @click="handleLogout">Logout</button>
        </template>
        <router-link v-else to="/login" class="btn btn-primary btn-sm">Log In</router-link>
      </div>

      <button class="nav-toggle" @click="menuOpen = !menuOpen" :aria-expanded="menuOpen ? 'true' : 'false'" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <div v-if="menuOpen" class="mobile-menu">
      <router-link to="/payment-plan" class="mobile-link" @click="menuOpen = false">Payment Plans</router-link>
      <router-link to="/jobs" class="mobile-link" @click="menuOpen = false">Graduate Jobs</router-link>
      <router-link v-if="isLoggedIn()" to="/payment" class="mobile-link" @click="menuOpen = false">Checkout</router-link>
      <div class="mobile-auth">
        <template v-if="isLoggedIn()">
          <span class="mobile-user">Hi, {{ currentUser.firstName }}</span>
          <button class="nav-btn" @click="handleLogout">Logout</button>
        </template>
        <router-link v-else to="/login" class="btn btn-primary btn-sm" @click="menuOpen = false">Log In</router-link>
      </div>
    </div>
  </header>
</template>

<script>
import { getCurrentUser, isLoggedIn, logout } from '../store/auth.js'

export default {
  name: 'Navbar',
  data() {
    return {
      currentUser: getCurrentUser(),
      menuOpen: false
    }
  },
  created() {
    this.loggedIn = isLoggedIn()
  },
  methods: {
    isLoggedIn() {
      return isLoggedIn()
    },
    handleLogout() {
      logout()
      this.currentUser = null
      this.menuOpen = false
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--primary-dark);
  color: var(--text-white);
  box-shadow: var(--shadow-md);
  border-bottom: 3px solid var(--flag-stripe);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
  gap: 16px;
}

.nav-brand {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--text-white);
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.nav-brand span {
  color: var(--gold-light);
}

.nav-links {
  display: flex;
  gap: 24px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  transition: var(--transition);
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--gold-light);
}

.nav-auth {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-user {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
}

.nav-btn {
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-white);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 7px 14px;
  border-radius: var(--radius);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition);
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Hamburger - hidden on desktop */
.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 42px;
  height: 42px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: var(--radius);
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

/* Mobile menu panel */
.mobile-menu {
  display: none;
  background: var(--primary-dark);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px 20px;
  flex-direction: column;
}

.mobile-link {
  padding: 14px 4px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: var(--transition);
}

.mobile-link:hover,
.mobile-link.router-link-active {
  color: var(--gold-light);
}

.mobile-auth {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
}

.mobile-user {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 768px) {
  .nav-links,
  .nav-auth {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
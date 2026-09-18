<template>
  <div class="dashboard-page">
    <header class="dash-header">
      <div class="container dash-top">
        <div class="brand">
          <span class="brand-mark">AD</span>
          <span class="brand-name">ApplyDirect SA</span>
        </div>
        <button class="btn btn-outline" @click="handleLogout">Log Out</button>
      </div>
      <div class="flag-bar"></div>
    </header>

    <main class="container">
      <section class="welcome">
        <span class="eyebrow">Welcome back</span>
        <h1>{{ firstName }} {{ lastName }}</h1>
        <p>{{ email }}</p>
      </section>

      <div class="stats">
        <div class="stat-card">
          <span class="stat-label">Role</span>
          <span class="stat-value role-badge" :class="user?.role">{{ user?.role }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Status</span>
          <span class="stat-value status-badge" :class="user?.status">{{ user?.status }}</span>
        </div>
        <div v-if="user?.university" class="stat-card">
          <span class="stat-label">University</span>
          <span class="stat-value">{{ user.university }}</span>
        </div>
        <div v-if="user?.phone" class="stat-card">
          <span class="stat-label">Phone</span>
          <span class="stat-value">{{ user.phone }}</span>
        </div>
      </div>

      <div class="info-box">
        <p>
          You are signed in to the <strong>ApplyDirect SA</strong> student portal.
          Purchased plans and application tracking are available on the
          <a href="http://localhost:3004" target="_blank" rel="noopener">Subscription page</a>.
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import { getCurrentUser, logout } from '../store/auth.js'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: getCurrentUser()
    }
  },
  computed: {
    firstName() {
      return this.user?.firstName || 'User'
    },
    lastName() {
      return this.user?.lastName || ''
    },
    email() {
      return this.user?.email || ''
    }
  },
  methods: {
    handleLogout() {
      logout()
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  background: var(--bg-subtle);
}

.dash-header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.dash-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  border-radius: var(--radius);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-white);
  font-weight: 800;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-name {
  font-weight: 700;
  font-size: 1.05rem;
}

.flag-bar {
  height: 4px;
  background: var(--flag-stripe);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
}

.main-container {
  padding: 48px 32px;
}

.welcome {
  padding: 56px 0 32px;
}

.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  display: block;
  margin-bottom: 10px;
}

.welcome h1 {
  font-size: 2rem;
  margin-bottom: 6px;
}

.welcome p {
  color: var(--text-light);
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin: 24px 0 32px;
}

.stat-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 20px 22px;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.stat-value {
  font-weight: 700;
  font-size: 1rem;
  text-transform: capitalize;
}

.role-badge {
  color: var(--primary);
}

.status-badge.approved {
  color: var(--success);
}

.status-badge.pending {
  color: var(--gold);
}

.status-badge.rejected {
  color: var(--accent);
}

.info-box {
  background: var(--bg);
  border: 1px solid var(--border);
  border-left: 4px solid var(--primary);
  border-radius: var(--radius);
  padding: 18px 22px;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.7;
}

.info-box a {
  color: var(--primary);
  font-weight: 600;
}

.info-box a:hover {
  text-decoration: underline;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 24px;
  border-radius: var(--radius);
  font-weight: 600;
  font-size: 0.88rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
  text-align: center;
  font-family: inherit;
}

.btn-outline {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--text);
  padding: 9px 20px;
  font-size: 0.84rem;
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary);
}

@media (max-width: 768px) {
  .container { padding: 0 20px; }
  .dash-top { padding: 14px 20px; }
  .welcome { padding: 40px 0 24px; }
  .welcome h1 { font-size: 1.6rem; }
}

main {
  padding: 0;
}
main.container {
  padding-top: 0;
  padding-bottom: 48px;
}
</style>
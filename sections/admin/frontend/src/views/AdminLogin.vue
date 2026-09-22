<template>
  <div class="admin-login-page">
    <div class="admin-login-grid">
      <!-- Left panel — SA flag branded -->
      <div class="login-branding">
        <div class="branding-content">
          <span class="branding-eyebrow">ApplyDirect SA Admin</span>
          <h1>Administration Panel</h1>
          <p>Manage students, subscription plans, and approve accounts for the ApplyDirect SA platform.</p>
          <div class="branding-features">
            <div class="bf-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
              <span>Approve or reject student registrations</span>
            </div>
            <div class="bf-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
              <span>Manage subscription plans and pricing</span>
            </div>
            <div class="bf-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              <span>View orders and platform activity</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right panel — login form -->
      <div class="login-form-area">
        <div class="form-wrapper">
          <div class="admin-login-header">
            <span class="flag-mark" aria-hidden="true">
              <svg viewBox="0 0 30 20" focusable="false">
                <rect width="30" height="10" fill="#E03C31"/>
                <rect y="10" width="30" height="10" fill="#001489"/>
                <path d="M0 0h10L30 10 10 20H0z" fill="#007749"/>
                <path d="M0 0h4L24 10 4 20H0z" fill="#000"/>
                <path d="M4 0h2L26 10 6 20H4L24 10 4 0z" fill="#FFB81C"/>
              </svg>
            </span>
            <span>Admin Login</span>
          </div>

          <form @submit.prevent="handleLogin" class="auth-form">
            <div v-if="error" class="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>{{ error }}</span>
            </div>

            <div class="field">
              <label>Email</label>
              <input type="email" v-model="email" placeholder="admin@uniapply.co.za" required autocomplete="username" />
            </div>
            <div class="field">
              <label>Password</label>
              <input type="password" v-model="password" placeholder="Enter admin password" required autocomplete="current-password" />
            </div>

            <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
              <span v-if="loading" class="spinner"></span>
              {{ loading ? 'Signing in...' : 'Sign In as Admin' }}
            </button>

            <div class="login-switch">
              <span>Looking for the student portal?</span>
              <a :href="userLoginUrl">Go to user login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getCurrentUser } from '../store/auth.js'

export default {
  name: 'AdminLogin',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  computed: {
    userLoginUrl() {
      return `http://${window.location.hostname}:3007/?forceLogin=1`
    }
  },
  mounted() {
    // If already logged in as admin, go straight to dashboard
    const user = getCurrentUser()
    if (user && user.role === 'admin') {
      this.$router.replace('/admin')
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      const result = await login(this.email, this.password)
      this.loading = false
      if (result.success) {
        this.$router.push('/admin')
      } else {
        this.error = result.error || 'Login failed'
      }
    }
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
}

.admin-login-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
}

.login-branding {
  background: var(--primary-dark);
  color: white;
  padding: 60px 56px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-branding::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--flag-stripe);
}

.branding-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--gold-light);
  margin-bottom: 24px;
}

.branding-content h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: white;
  line-height: 1.1;
  margin-bottom: 14px;
  letter-spacing: -0.02em;
}

.branding-content > p {
  font-size: 0.95rem;
  opacity: 0.7;
  line-height: 1.7;
  max-width: 360px;
  margin-bottom: 48px;
}

.branding-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bf-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.88rem;
  opacity: 0.75;
}

.bf-item svg {
  opacity: 0.6;
  flex-shrink: 0;
}

.login-form-area {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: var(--bg);
}

.form-wrapper {
  width: 100%;
  max-width: 380px;
}

.admin-login-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border);
}

.admin-login-header .flag-mark {
  width: 30px;
  height: 20px;
  border-radius: 2px;
  overflow: hidden;
  flex-shrink: 0;
}

.admin-login-header .flag-mark svg {
  display: block;
  width: 100%;
  height: 100%;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.field label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.92rem;
  font-family: inherit;
}

.field input:focus {
  outline: 2px solid var(--primary-light);
  outline-offset: -1px;
}

.btn-block {
  width: 100%;
  padding: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: var(--radius);
  font-size: 0.85rem;
  line-height: 1.5;
}

.alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-error {
  background: var(--accent-50);
  color: var(--accent);
  border: 1px solid rgba(197, 48, 48, 0.12);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-switch {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
  color: var(--text-light);
  font-size: 0.82rem;
  text-align: center;
}

.login-switch a {
  color: var(--primary);
  font-weight: 700;
}

.login-switch a:hover {
  text-decoration: underline;
}

.login-switch a:focus-visible {
  outline: 2px solid var(--primary-light);
  outline-offset: 3px;
}

@media (max-width: 900px) {
  .admin-login-grid { grid-template-columns: 1fr; }
  .login-branding { padding: 40px 24px; min-height: auto; }
  .branding-content h1 { font-size: 1.8rem; }
  .branding-content > p { margin-bottom: 28px; }
  .login-form-area { padding: 32px 24px; }
}

@media (max-width: 480px) {
  .login-branding { padding: 28px 20px; }
  .login-form-area { padding: 24px 16px; }
  .branding-features { display: none; }
  .branding-content h1 { font-size: 1.5rem; }
}
</style>
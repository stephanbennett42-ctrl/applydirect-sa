<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <div class="login-head">
          <span class="login-eyebrow">ApplyDirect SA Student</span>
          <h1>Log In to Continue</h1>
          <p>Sign in to choose a payment plan and start your university application.</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div v-if="error" class="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{{ error }}</span>
          </div>

          <div class="field">
            <label>Email Address</label>
            <input type="email" v-model="email" placeholder="you@example.com" required autocomplete="username" />
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="••••••••" required autocomplete="current-password" />
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Signing in...' : 'Log In' }}
          </button>
        </form>

        <div class="demo-box">
          <p class="demo-title">Demo Student</p>
          <p>thabo@email.com / password123</p>
        </div>

        <p class="switch-text">
          Don't have an account? <router-link to="/register">Sign up</router-link>
        </p>

        <button type="button" class="btn btn-ghost btn-block admin-login-button" @click="goToAdminLogin">Admin Login</button>
      </div>
    </div>
  </div>
</template>

<script>
import { login } from '../store/auth.js'

// Link to the Admin panel on the same host the page was opened from,
// so it also works when opened from another device (phone/tablet).
function adminBaseUrl() {
  const host = window.location.hostname || 'localhost'
  return `http://${host}:3005`
}

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false,
      adminUrl: adminBaseUrl()
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true
      const result = await login(this.email, this.password)
      this.loading = false

      if (result.success) {
        const host = window.location.hostname || 'localhost'
        window.location.href = `http://${host}:5173/institutions`
      } else {
        this.error = result.error || 'Login failed'
      }
    },
    goToAdminLogin() {
      window.location.href = this.adminUrl
    }
  }
}
</script>

<style scoped>
.login-page {
  padding: 80px 0;
  min-height: calc(100vh - 160px);
  display: flex;
  align-items: center;
  background: var(--bg-subtle);
}

.login-card {
  max-width: 440px;
  margin: 0 auto;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 40px;
  box-shadow: var(--shadow-md);
}

.login-head {
  text-align: center;
  margin-bottom: 28px;
}

.login-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  display: block;
  margin-bottom: 10px;
}

.login-head h1 {
  font-size: 1.6rem;
  margin-bottom: 8px;
}

.login-head p {
  font-size: 0.9rem;
  color: var(--text-light);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

.btn-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
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

.demo-box {
  margin-top: 20px;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 14px;
  text-align: center;
  font-size: 0.82rem;
  color: var(--text-light);
  line-height: 1.7;
}

.demo-title {
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 2px;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.switch-text {
  margin-top: 20px;
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-light);
}

.switch-text a {
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
}

.switch-text a:hover {
  text-decoration: underline;
}

.admin-switch {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

@media (max-width: 480px) {
  .login-page {
    padding: 40px 0;
  }
  .login-card {
    padding: 24px 20px;
  }
}
</style>
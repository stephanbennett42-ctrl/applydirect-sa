<template>
  <div class="login-page">
    <div class="flag-bar"></div>

    <div class="login-wrap">
      <div class="brand">
        <span class="brand-mark">AD</span>
        <div class="brand-text">
          <h1>ApplyDirect SA</h1>
          <p>University Admissions Portal</p>
        </div>
      </div>

      <div class="login-card">
        <div class="login-head">
          <span class="eyebrow">Secure Sign In</span>
          <h2>Log In to Continue</h2>
          <p>Access your ApplyDirect SA account.</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div v-if="error" class="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{{ error }}</span>
          </div>

          <div class="field">
            <label for="email">Email Address</label>
            <input id="email" type="email" v-model="email" placeholder="you@example.com" required autocomplete="username" />
          </div>

          <div class="field">
            <label for="password">Password</label>
            <div class="password-wrap">
              <input id="password" :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="••••••••" required autocomplete="current-password" />
              <button type="button" class="toggle-pass" @click="showPassword = !showPassword" :aria-label="showPassword ? 'Hide password' : 'Show password'">
                <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Signing in...' : 'Log In' }}
          </button>
        </form>

        <div class="demo-box">
          <p class="demo-title">Demo Accounts</p>
          <p>thabo@email.com / password123</p>
          <p>admin@uniapply.co.za / admin123</p>
        </div>
      </div>

      <p class="footer-note">ApplyDirect SA © 2026 — South African university applications made simple.</p>
    </div>
  </div>
</template>

<script>
import { login } from '../store/auth.js'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true

      const result = await login(this.email, this.password)

      this.loading = false

      if (result.success) {
        const redirect = this.$route.query.redirect || '/dashboard'
        this.$router.push(redirect)
      } else {
        this.error = result.error || 'Login failed'
      }
    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.9)),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23001489' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flag-bar {
  width: 100%;
  height: 5px;
  background: var(--flag-stripe);
}

.login-wrap {
  width: 100%;
  max-width: 460px;
  padding: 48px 20px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 32px;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-white);
  font-weight: 800;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.brand-text h1 {
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}

.brand-text p {
  font-size: 0.78rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.login-card {
  width: 100%;
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

.eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  display: block;
  margin-bottom: 10px;
}

.login-head h2 {
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

.password-wrap {
  position: relative;
}

.password-wrap input {
  padding-right: 44px;
}

.toggle-pass {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
  display: flex;
  align-items: center;
  transition: var(--transition);
}

.toggle-pass:hover {
  color: var(--text);
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
  transition: var(--transition);
  text-align: center;
  letter-spacing: 0.01em;
  line-height: 1.2;
  font-family: inherit;
}

.btn-primary {
  background: var(--primary);
  color: var(--text-white);
}

.btn-primary:hover:not(:disabled) {
  background: var(--primary-dark);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-block {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 6px;
  padding: 14px;
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

.footer-note {
  margin-top: 28px;
  font-size: 0.78rem;
  color: var(--text-muted);
  text-align: center;
}

@media (max-width: 480px) {
  .login-wrap { padding: 32px 16px 24px; }
  .login-card { padding: 28px 22px; }
  .brand { margin-bottom: 24px; }
}
</style>
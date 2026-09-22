<template>
  <div class="register-page">
    <div class="flag-bar"></div>
    <div class="register-wrap">
      <div class="brand">
        <span class="brand-mark">AD</span>
        <div class="brand-text">
          <h1>ApplyDirect SA</h1>
          <p>Create your student account</p>
        </div>
      </div>

      <div class="register-card">
        <div class="register-head">
          <span class="eyebrow">New Student Account</span>
          <h2>Create your account</h2>
          <p>Enter your details. An admin will review your account before access is granted.</p>
        </div>

        <div v-if="error" class="alert alert-error">{{ error }}</div>

        <form class="register-form" @submit.prevent="handleRegister">
          <div class="form-grid">
            <div class="field">
              <label for="firstName">First name</label>
              <input id="firstName" v-model.trim="form.firstName" required autocomplete="given-name" />
            </div>
            <div class="field">
              <label for="lastName">Surname</label>
              <input id="lastName" v-model.trim="form.lastName" required autocomplete="family-name" />
            </div>
          </div>

          <div class="field">
            <label for="email">Email address</label>
            <input id="email" v-model.trim="form.email" type="email" required autocomplete="email" />
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="phone">Phone number</label>
              <input id="phone" v-model.trim="form.phone" type="tel" autocomplete="tel" />
            </div>
            <div class="field">
              <label for="university">University</label>
              <input id="university" v-model.trim="form.university" autocomplete="organization" />
            </div>
          </div>

          <div class="field">
            <label for="password">Password</label>
            <input id="password" v-model="form.password" type="password" minlength="8" required autocomplete="new-password" />
            <small>Use at least 8 characters.</small>
          </div>

          <div class="field">
            <label for="confirmPassword">Confirm password</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" minlength="8" required autocomplete="new-password" />
          </div>

          <button class="btn btn-primary btn-block" type="submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="switch-text">
          Already have an account?
          <router-link to="/">Back to login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../store/api.js'

export default {
  name: 'Register',
  data() {
    return {
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        university: '',
        password: '',
        confirmPassword: ''
      },
      error: '',
      loading: false
    }
  },
  methods: {
    async handleRegister() {
      this.error = ''
      if (this.form.password !== this.form.confirmPassword) {
        this.error = 'Passwords do not match.'
        return
      }

      this.loading = true
      try {
        await authAPI.register(this.form)
        this.$router.push({ name: 'Login', query: { registered: '1', email: this.form.email } })
      } catch (err) {
        this.error = err.error || 'We could not create your account. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: var(--bg-subtle);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flag-bar {
  width: 100%;
  height: 5px;
  background: var(--flag-stripe);
}

.register-wrap {
  width: 100%;
  max-width: 560px;
  padding: 36px 20px;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin-bottom: 24px;
}

.brand-mark {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: var(--text-white);
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text h1 { font-size: 1.1rem; }
.brand-text p { color: var(--text-light); font-size: 0.76rem; text-transform: uppercase; letter-spacing: 0.08em; }

.register-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 34px;
  box-shadow: var(--shadow-md);
}

.register-head { text-align: center; margin-bottom: 24px; }
.eyebrow { display: block; margin-bottom: 8px; color: var(--primary); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
.register-head h2 { font-size: 1.55rem; margin-bottom: 8px; }
.register-head p, small { color: var(--text-light); font-size: 0.85rem; }
.register-form { display: flex; flex-direction: column; gap: 15px; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.field { display: flex; flex-direction: column; gap: 5px; }
.field label { color: var(--text-secondary); font-size: 0.82rem; font-weight: 600; }
.btn { border: 0; border-radius: var(--radius); cursor: pointer; font: inherit; font-weight: 700; padding: 13px; }
.btn-primary { background: var(--primary); color: var(--text-white); }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
.btn:disabled { cursor: not-allowed; opacity: 0.7; }
.btn-block { width: 100%; }
.alert { margin-bottom: 16px; padding: 12px 14px; border-radius: var(--radius); font-size: 0.85rem; }
.alert-error { background: var(--accent-50); border: 1px solid rgba(197, 48, 48, 0.12); color: var(--accent); }
.switch-text { color: var(--text-light); font-size: 0.85rem; margin-top: 20px; text-align: center; }
.switch-text a { color: var(--primary); font-weight: 700; }
.spinner { display: inline-block; width: 16px; height: 16px; margin-right: 8px; border: 2px solid rgba(255,255,255,.35); border-top-color: white; border-radius: 50%; animation: spin .6s linear infinite; vertical-align: -3px; }
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 560px) {
  .register-card { padding: 26px 20px; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>

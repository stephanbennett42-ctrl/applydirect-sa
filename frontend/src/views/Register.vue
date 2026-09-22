<template>
  <div class="login-page">
    <div class="container">
      <div class="login-card">
        <div class="login-head">
          <span class="login-eyebrow">ApplyDirect SA Student</span>
          <h1>Create Your Account</h1>
          <p>Register to choose a payment plan and begin your university application.</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div v-if="error" class="alert alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{{ error }}</span>
          </div>

          <div v-if="success" class="alert alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>{{ success }}</span>
          </div>

          <div class="field-row">
            <div class="field">
              <label>First Name</label>
              <input type="text" v-model="firstName" @input="firstName = sanitizeName(firstName)" placeholder="Thabo" required />
            </div>
            <div class="field">
              <label>Last Name</label>
              <input type="text" v-model="lastName" @input="lastName = sanitizeName(lastName)" placeholder="Mokoena" required />
            </div>
          </div>

          <div class="field">
            <label>Email Address</label>
            <input type="email" v-model="email" placeholder="you@example.com" required autocomplete="username" />
          </div>

          <div class="field">
            <label>Password</label>
            <input type="password" v-model="password" placeholder="Min 6 characters" required minlength="6" autocomplete="new-password" />
          </div>

          <div class="field">
            <label>Phone (optional)</label>
            <input type="tel" v-model="phone" placeholder="+27 82 123 4567" />
          </div>

          <div class="field">
            <label>University (optional)</label>
            <input type="text" v-model="university" placeholder="e.g. University of Cape Town" />
          </div>

          <div class="field">
            <label>What are you / will you be studying?</label>
            <select v-model="fieldOfStudy">
              <option value="" disabled>Select your field of study...</option>
              <option v-for="f in fieldOptions" :key="f" :value="f">{{ f }}</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary btn-block btn-lg" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <p class="switch-text">
          Already have an account? <router-link to="/login">Log in</router-link>
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
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      university: '',
      fieldOfStudy: '',
      error: '',
      success: '',
      loading: false,
      fieldOptions: [
        'Information Technology & Computer Science',
        'Engineering',
        'Business & Finance',
        'Marketing & Communications',
        'Health Sciences',
        'Law',
        'Education & Teaching',
        'Science & Mathematics',
        'Social Sciences & Humanities',
        'Agriculture & Environmental',
        'Other'
      ]
    }
  },
  methods: {
    sanitizeName(v) {
      // Letters only (incl. accented letters), spaces, hyphens, apostrophes and dots.
      return v.replace(/[^A-Za-z\u00C0-\u024F'\- .]/g, '').replace(/\s{2,}/g, ' ')
    },
    async handleRegister() {
      this.error = ''
      this.success = ''
      this.loading = true
      try {
        const res = await authAPI.register({
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          password: this.password,
          phone: this.phone || undefined,
          university: this.university || undefined,
          fieldOfStudy: this.fieldOfStudy || undefined
        })
        this.success = res.message || 'Account created successfully. Awaiting admin approval.'
        setTimeout(() => this.$router.push('/login'), 3000)
      } catch (err) {
        this.error = err.error || 'Registration failed. Please try again.'
      } finally {
        this.loading = false
      }
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

.field-row {
  display: flex;
  gap: 12px;
}
.field-row .field {
  flex: 1;
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

.alert-success {
  background: var(--success-light);
  color: var(--success);
  border: 1px solid rgba(5, 150, 105, 0.12);
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

@media (max-width: 480px) {
  .login-page {
    padding: 40px 0;
  }
  .login-card {
    padding: 24px 20px;
  }
  .field-row {
    flex-direction: column;
  }
}
</style>
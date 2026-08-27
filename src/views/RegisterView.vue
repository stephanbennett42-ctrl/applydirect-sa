<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../services/authService'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !firstName.value ||
    !lastName.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please complete all fields.'
    return
  }

  if (password.value.length < 8) {
    errorMessage.value =
      'Password must be at least 8 characters.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value =
      'Passwords do not match.'
    return
  }

  loading.value = true

  try {
    await register({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    })

    successMessage.value =
      'Account created successfully. Redirecting...'

    setTimeout(() => {
      router.push('/login')
    }, 1200)

  } catch (error) {
    errorMessage.value =
      error.message ||
      'Unable to create your account. Please try again.'

  } finally {
    loading.value = false
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="register-page">

    <!-- BRAND SIDE -->
    <section class="brand-panel">

      <div class="brand">

        <div class="logo">
          AD
        </div>

        <div class="brand-name">
          ApplyDirect <strong>SA</strong>
        </div>

      </div>


      <div class="brand-content">

        <div class="eyebrow">
          <span class="eyebrow-dot"></span>
          START YOUR JOURNEY
        </div>

        <h1>
          Your future.
          <span>Starts here.</span>
        </h1>

        <p>
          Create your ApplyDirect SA account and keep your
          university applications organised in one place.
        </p>

      </div>


      <div class="brand-footer">
        <span class="footer-dot"></span>
        Built for students across South Africa
      </div>

    </section>


    <!-- REGISTER SIDE -->
    <section class="register-panel">

      <div class="register-container">

        <div class="header">

          <button
            type="button"
            class="back-button"
            @click="goToLogin"
          >
            ← Back to login
          </button>

          <h2>
            Create your account
          </h2>

          <p>
            Set up your account to start managing your applications.
          </p>

        </div>


        <form @submit.prevent="handleRegister">

          <div class="name-row">

            <div class="form-field">
              <label for="firstName">
                First name
              </label>

              <input
                id="firstName"
                v-model="firstName"
                type="text"
                placeholder="First name"
                autocomplete="given-name"
                required
              />
            </div>


            <div class="form-field">
              <label for="lastName">
                Last name
              </label>

              <input
                id="lastName"
                v-model="lastName"
                type="text"
                placeholder="Last name"
                autocomplete="family-name"
                required
              />
            </div>

          </div>


          <div class="form-field">

            <label for="email">
              Email address
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />

          </div>


          <div class="form-field">

            <label for="password">
              Password
            </label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="At least 8 characters"
              autocomplete="new-password"
              required
            />

          </div>


          <div class="form-field">

            <label for="confirmPassword">
              Confirm password
            </label>

            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Repeat your password"
              autocomplete="new-password"
              required
            />

          </div>


          <!-- ERROR -->
          <p
            v-if="errorMessage"
            class="error-message"
            role="alert"
          >
            {{ errorMessage }}
          </p>


          <!-- SUCCESS -->
          <p
            v-if="successMessage"
            class="success-message"
            role="status"
          >
            {{ successMessage }}
          </p>


          <button
            type="submit"
            class="create-account-button"
            :disabled="loading"
          >

            <span v-if="!loading">
              Create account
              <span>→</span>
            </span>

            <span v-else>
              Creating account...
            </span>

          </button>

        </form>


        <p class="login-link">

          Already have an account?

          <button
            type="button"
            @click="goToLogin"
          >
            Sign in
          </button>

        </p>

      </div>

    </section>

  </main>
</template>


<style scoped>

.register-page {
  min-height: 100vh;

  display: grid;

  grid-template-columns: 42% 58%;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;

  background: #ffffff;
}


/* BRAND */

.brand-panel {
  min-height: 100vh;

  padding: 38px 9%;

  display: flex;
  flex-direction: column;

  position: relative;

  overflow: hidden;

  background: #4724a6;

  color: #ffffff;
}


.brand-panel::before {
  content: "";

  position: absolute;

  width: 500px;
  height: 500px;

  right: -280px;
  bottom: -260px;

  border:
    1px solid
    rgba(255,255,255,0.09);

  border-radius: 50%;
}


.brand-panel::after {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  left: -180px;
  top: 18%;

  border:
    1px solid
    rgba(255,255,255,0.06);

  border-radius: 50%;
}


/* BRAND */

.brand {
  display: flex;

  align-items: center;

  gap: 10px;

  position: relative;

  z-index: 2;
}


.logo {
  width: 40px;
  height: 40px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #ffffff;

  color: #4724a6;

  border-radius: 6px;

  font-size: 12px;

  font-weight: 800;
}


.brand-name {
  font-size: 19px;

  font-weight: 500;

  letter-spacing: -0.4px;
}


.brand-name strong {
  font-weight: 800;
}


/* CONTENT */

.brand-content {
  max-width: 470px;

  margin: auto 0;

  position: relative;

  z-index: 2;
}


.eyebrow {
  display: flex;

  align-items: center;

  gap: 8px;

  margin-bottom: 20px;

  font-size: 10px;

  font-weight: 700;

  letter-spacing: 1.5px;

  color:
    rgba(255,255,255,0.65);
}


.eyebrow-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #d8ff63;
}


.brand-content h1 {
  margin: 0;

  font-size: clamp(44px, 4vw, 60px);

  line-height: 1.02;

  letter-spacing: -2.5px;

  font-weight: 700;
}


.brand-content h1 span {
  display: block;

  color: #d8ff63;
}


.brand-content p {
  max-width: 430px;

  margin-top: 24px;

  font-size: 14px;

  line-height: 1.7;

  color:
    rgba(255,255,255,0.73);
}


/* FOOTER */

.brand-footer {
  display: flex;

  align-items: center;

  gap: 8px;

  position: relative;

  z-index: 2;

  font-size: 10px;

  color:
    rgba(255,255,255,0.5);
}


.footer-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #d8ff63;
}


/* REGISTER PANEL */

.register-panel {
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 50px 9%;
}


.register-container {
  width: 100%;

  max-width: 470px;
}


/* HEADER */

.header {
  margin-bottom: 28px;
}


.back-button {
  margin-bottom: 25px;

  padding: 0;

  border: none;

  background: transparent;

  color: #5b36b5;

  font-size: 12px;

  font-weight: 600;

  cursor: pointer;
}


.back-button:hover {
  text-decoration: underline;
}


.header h2 {
  margin: 0 0 7px;

  font-size: 30px;

  line-height: 1.15;

  letter-spacing: -1px;

  color: #182033;
}


.header p {
  margin: 0;

  font-size: 13px;

  line-height: 1.6;

  color: #737b89;
}


/* FORM */

.name-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 14px;
}


.form-field {
  margin-bottom: 18px;
}


.form-field label {
  display: block;

  margin-bottom: 7px;

  font-size: 12px;

  font-weight: 600;

  color: #30394b;
}


.form-field input {
  width: 100%;

  height: 48px;

  padding: 0 13px;

  box-sizing: border-box;

  border:
    1px solid #d9dee6;

  border-radius: 5px;

  outline: none;

  background: #ffffff;

  color: #182033;

  font-size: 13px;

  transition: 0.15s ease;
}


.form-field input::placeholder {
  color: #a1a8b4;
}


.form-field input:focus {
  border-color: #6240bd;

  box-shadow:
    0 0 0 3px
    rgba(98,64,189,0.08);
}


/* MESSAGES */

.error-message {
  margin: 0 0 15px;

  padding: 10px 12px;

  border:
    1px solid #f0caca;

  border-radius: 4px;

  background: #fff7f7;

  color: #b42318;

  font-size: 11px;

  line-height: 1.5;
}


.success-message {
  margin: 0 0 15px;

  padding: 10px 12px;

  border:
    1px solid #c9e7d0;

  border-radius: 4px;

  background: #f4fbf5;

  color: #237a3b;

  font-size: 11px;
}


/* BUTTON */

.create-account-button {
  width: 100%;

  height: 48px;

  border: none;

  border-radius: 5px;

  background: #4724a6;

  color: #ffffff;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}


.create-account-button:hover:not(:disabled) {
  background: #3d1f91;
}


.create-account-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}


/* LOGIN */

.login-link {
  margin-top: 25px;

  text-align: center;

  font-size: 12px;

  color: #737b89;
}


.login-link button {
  margin-left: 3px;

  padding: 0;

  border: none;

  background: transparent;

  color: #5b36b5;

  font-size: 12px;

  font-weight: 700;

  cursor: pointer;
}


.login-link button:hover {
  text-decoration: underline;
}


/* MOBILE */

@media (max-width: 700px) {

  .register-page {
    display: block;
  }

  .brand-panel {
    display: none;
  }

  .register-panel {
    min-height: 100vh;

    padding: 35px 22px;
  }

  .name-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

}

</style>
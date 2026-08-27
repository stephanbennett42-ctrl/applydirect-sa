<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import {
  login,
  loginWithGoogle
} from '../services/authService'

const router = useRouter()

const email = ref('')
const password = ref('')

const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value =
      'Please enter your email address and password.'

    return
  }

  loading.value = true

  try {
    const response = await login(
      email.value,
      password.value
    )

    /*
     * When the backend is connected, authService.js
     * will return the authenticated user/token here.
     *
     * For now, we simply continue to the next page
     * if the request succeeds.
     */

    console.log('Login successful:', response)

    router.push('/payment')

  } catch (error) {
    console.error('Login error:', error)

    if (error.message === 'Failed to fetch') {
      errorMessage.value =
        'Unable to connect to the server. Please try again later.'
    } else {
      errorMessage.value =
        error.message ||
        'Invalid email or password.'
    }

  } finally {
    loading.value = false
  }
}


function handleGoogleLogin() {
  errorMessage.value = ''
  googleLoading.value = true

  try {
    loginWithGoogle()
  } catch (error) {
    console.error('Google login error:', error)

    errorMessage.value =
      'Google sign-in is currently unavailable.'

    googleLoading.value = false
  }
}
</script>


<template>
  <main class="login-page">

    <!-- LEFT SIDE -->

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

          YOUR NEXT CHAPTER STARTS HERE

        </div>


        <h1>
          Your future.
          <span>Your way.</span>
        </h1>


        <p class="brand-description">
          University applications shouldn't feel complicated.
          ApplyDirect SA helps you discover, apply and keep track
          of your opportunities from one place.
        </p>


        <!-- APPLICATION PREVIEW -->

        <div class="application-preview">

          <div class="preview-top">

            <span>
              Application progress
            </span>

            <strong>
              2 of 3
            </strong>

          </div>


          <div class="progress-track">

            <div class="progress-bar"></div>

          </div>


          <div class="preview-items">

            <div class="preview-item completed">

              <span class="check">
                ✓
              </span>

              <span>
                Personal details
              </span>

            </div>


            <div class="preview-item completed">

              <span class="check">
                ✓
              </span>

              <span>
                Choose institutions
              </span>

            </div>


            <div class="preview-item current">

              <span class="current-dot"></span>

              <span>
                Submit applications
              </span>

            </div>

          </div>

        </div>

      </div>


      <div class="brand-footer">

        <span class="footer-dot"></span>

        Built for students across South Africa

      </div>

    </section>



    <!-- RIGHT SIDE -->

    <section class="login-panel">

      <div class="login-container">

        <div class="login-header">

          <div class="welcome-label">
            Welcome back 👋
          </div>

          <h2>
            Let's get you in.
          </h2>

          <p>
            Sign in to continue managing your applications.
          </p>

        </div>



        <!-- LOGIN FORM -->

        <form @submit.prevent="handleLogin">

          <!-- EMAIL -->

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
              :disabled="loading"
              required
            />

          </div>



          <!-- PASSWORD -->

          <div class="form-field">

            <div class="password-heading">

              <label for="password">
                Password
              </label>

              <RouterLink to="/forgot-password">
                Forgot password?
              </RouterLink>

            </div>


            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              :disabled="loading"
              required
            />

          </div>



          <!-- ERROR -->

          <div
            v-if="errorMessage"
            class="error-message"
            role="alert"
          >

            <span class="error-icon">
              !
            </span>

            <span>
              {{ errorMessage }}
            </span>

          </div>



          <!-- LOGIN BUTTON -->

          <button
            type="submit"
            class="login-button"
            :disabled="loading"
          >

            <span v-if="!loading">
              Sign in
              <span class="arrow">→</span>
            </span>


            <span
              v-else
              class="loading-content"
            >

              <span class="spinner"></span>

              Signing in...

            </span>

          </button>

        </form>



        <!-- DIVIDER -->

        <div class="divider">

          <span>
            OR
          </span>

        </div>



        <!-- GOOGLE -->

        <button
          type="button"
          class="google-button"
          :disabled="googleLoading"
          @click="handleGoogleLogin"
        >

          <span
            v-if="!googleLoading"
            class="google-content"
          >

            <span class="google-icon">
              G
            </span>

            Continue with Google

          </span>


          <span
            v-else
            class="loading-content"
          >

            <span class="dark-spinner"></span>

            Connecting...

          </span>

        </button>



        <!-- REGISTER -->

        <p class="register">

          New to ApplyDirect?

          <RouterLink to="/register">
            Create an account
          </RouterLink>

        </p>



        <!-- TERMS -->

        <p class="terms">

          By continuing, you agree to our

          <a href="#">
            Terms of Service
          </a>

          and

          <a href="#">
            Privacy Policy
          </a>.

        </p>

      </div>

    </section>

  </main>
</template>



<style scoped>

* {
  box-sizing: border-box;
}


/* =================================
   PAGE
================================= */

.login-page {
  width: 100%;
  min-height: 100vh;

  display: grid;

  grid-template-columns: 48% 52%;

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



/* =================================
   LEFT BRAND PANEL
================================= */

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

  width: 520px;
  height: 520px;

  right: -300px;
  bottom: -270px;

  border:
    1px solid
    rgba(255, 255, 255, 0.09);

  border-radius: 50%;
}


.brand-panel::after {
  content: "";

  position: absolute;

  width: 260px;
  height: 260px;

  left: -180px;
  top: 12%;

  border:
    1px solid
    rgba(255, 255, 255, 0.06);

  border-radius: 50%;
}



/* =================================
   BRAND
================================= */

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



/* =================================
   BRAND CONTENT
================================= */

.brand-content {
  max-width: 540px;

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
    rgba(255, 255, 255, 0.66);
}


.eyebrow-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #d8ff63;
}



/* =================================
   HEADING
================================= */

.brand-content h1 {
  margin: 0;

  font-size:
    clamp(44px, 4.6vw, 64px);

  line-height: 1.02;

  letter-spacing: -2.8px;

  font-weight: 700;
}


.brand-content h1 span {
  display: block;

  color: #d8ff63;
}



/* =================================
   DESCRIPTION
================================= */

.brand-description {
  max-width: 470px;

  margin: 25px 0 0;

  font-size: 15px;

  line-height: 1.7;

  color:
    rgba(255, 255, 255, 0.75);
}



/* =================================
   APPLICATION PREVIEW
================================= */

.application-preview {
  width: 330px;

  margin-top: 32px;

  padding: 18px;

  background:
    rgba(255, 255, 255, 0.09);

  border:
    1px solid
    rgba(255, 255, 255, 0.13);

  border-radius: 7px;

  backdrop-filter: blur(5px);
}


.preview-top {
  display: flex;

  justify-content: space-between;

  align-items: center;

  margin-bottom: 11px;

  font-size: 10px;

  color:
    rgba(255, 255, 255, 0.63);
}


.preview-top strong {
  color: #d8ff63;

  font-size: 11px;
}


.progress-track {
  height: 5px;

  width: 100%;

  background:
    rgba(255, 255, 255, 0.13);

  border-radius: 10px;

  overflow: hidden;
}


.progress-bar {
  width: 67%;

  height: 100%;

  background: #d8ff63;

  border-radius: 10px;
}


.preview-items {
  margin-top: 16px;

  display: flex;

  flex-direction: column;

  gap: 9px;
}


.preview-item {
  display: flex;

  align-items: center;

  gap: 9px;

  font-size: 10px;

  color:
    rgba(255, 255, 255, 0.58);
}


.preview-item.completed {
  color:
    rgba(255, 255, 255, 0.8);
}


.check {
  width: 17px;
  height: 17px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #d8ff63;

  color: #4724a6;

  font-size: 9px;

  font-weight: 800;
}


.current-dot {
  width: 17px;
  height: 17px;

  display: block;

  border:
    2px solid #e87c55;

  border-radius: 50%;

  position: relative;
}


.current-dot::after {
  content: "";

  position: absolute;

  width: 5px;
  height: 5px;

  left: 4px;
  top: 4px;

  background: #e87c55;

  border-radius: 50%;
}



/* =================================
   FOOTER
================================= */

.brand-footer {
  display: flex;

  align-items: center;

  gap: 8px;

  position: relative;

  z-index: 2;

  font-size: 10px;

  color:
    rgba(255, 255, 255, 0.5);
}


.footer-dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: #d8ff63;
}



/* =================================
   RIGHT PANEL
================================= */

.login-panel {
  min-height: 100vh;

  display: flex;

  align-items: center;

  justify-content: center;

  padding: 50px 9%;

  background: #ffffff;
}


.login-container {
  width: 100%;

  max-width: 410px;
}



/* =================================
   HEADER
================================= */

.login-header {
  margin-bottom: 30px;
}


.welcome-label {
  margin-bottom: 10px;

  font-size: 11px;

  font-weight: 700;

  color: #6a42c1;
}


.login-header h2 {
  margin: 0 0 7px;

  font-size: 31px;

  line-height: 1.15;

  letter-spacing: -1px;

  font-weight: 700;

  color: #182033;
}


.login-header p {
  margin: 0;

  font-size: 13px;

  line-height: 1.6;

  color: #737b89;
}



/* =================================
   FORM
================================= */

.form-field {
  margin-bottom: 20px;
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

  border:
    1px solid #d9dee6;

  border-radius: 5px;

  outline: none;

  background: #ffffff;

  color: #182033;

  font-size: 13px;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}


.form-field input::placeholder {
  color: #a1a8b4;
}


.form-field input:focus {
  border-color: #6240bd;

  box-shadow:
    0 0 0 3px
    rgba(98, 64, 189, 0.08);
}


.form-field input:disabled {
  background: #f7f7f9;

  cursor: not-allowed;
}



/* =================================
   PASSWORD
================================= */

.password-heading {
  display: flex;

  justify-content: space-between;

  align-items: center;
}


.password-heading a {
  margin-bottom: 7px;

  font-size: 11px;

  color: #5b36b5;

  font-weight: 600;

  text-decoration: none;
}


.password-heading a:hover {
  text-decoration: underline;
}



/* =================================
   ERROR
================================= */

.error-message {
  display: flex;

  align-items: center;

  gap: 8px;

  margin:
    -4px 0 15px;

  padding: 10px 11px;

  border:
    1px solid #efc9c9;

  border-radius: 5px;

  background: #fff7f7;

  color: #b42318;

  font-size: 10px;

  line-height: 1.5;
}


.error-icon {
  width: 16px;
  height: 16px;

  flex-shrink: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #b42318;

  color: #ffffff;

  font-size: 9px;

  font-weight: 800;
}



/* =================================
   LOGIN BUTTON
================================= */

.login-button {
  width: 100%;

  height: 48px;

  display: flex;

  align-items: center;

  justify-content: center;

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


.login-button:hover:not(:disabled) {
  background: #3d1f91;
}


.login-button:disabled {
  opacity: 0.7;

  cursor: not-allowed;
}


.arrow {
  margin-left: 8px;

  font-size: 17px;

  line-height: 0;
}


.loading-content {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}


.spinner,
.dark-spinner {
  width: 14px;
  height: 14px;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}


.spinner {
  border:
    2px solid
    rgba(255, 255, 255, 0.35);

  border-top-color: #ffffff;
}


.dark-spinner {
  border:
    2px solid #e1e2e6;

  border-top-color: #4724a6;
}


@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}



/* =================================
   DIVIDER
================================= */

.divider {
  display: flex;

  align-items: center;

  gap: 13px;

  margin: 25px 0;

  color: #9aa1ad;

  font-size: 9px;

  font-weight: 700;
}


.divider::before,
.divider::after {
  content: "";

  height: 1px;

  flex: 1;

  background: #e5e8ec;
}



/* =================================
   GOOGLE
================================= */

.google-button {
  width: 100%;

  height: 48px;

  border:
    1px solid #d9dee6;

  border-radius: 5px;

  background: #ffffff;

  color: #30394b;

  font-size: 13px;

  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.15s ease,
    border-color 0.15s ease;
}


.google-button:hover:not(:disabled) {
  background: #f8f9fb;

  border-color: #cdd1d8;
}


.google-button:disabled {
  opacity: 0.7;

  cursor: not-allowed;
}


.google-content {
  display: flex;

  align-items: center;

  justify-content: center;
}


.google-icon {
  margin-right: 9px;

  color: #4285f4;

  font-size: 15px;

  font-weight: 800;
}



/* =================================
   REGISTER
================================= */

.register {
  margin-top: 25px;

  text-align: center;

  font-size: 12px;

  color: #737b89;
}


.register a {
  margin-left: 3px;

  color: #5b36b5;

  font-weight: 700;

  text-decoration: none;
}


.register a:hover {
  text-decoration: underline;
}



/* =================================
   TERMS
================================= */

.terms {
  max-width: 340px;

  margin: 25px auto 0;

  text-align: center;

  font-size: 9px;

  line-height: 1.6;

  color: #a0a7b2;
}


.terms a {
  color: #727b89;

  text-decoration: underline;
}



/* =================================
   MOBILE
================================= */

@media (max-width: 700px) {

  .login-page {
    display: block;
  }


  .brand-panel {
    display: none;
  }


  .login-panel {
    min-height: 100vh;

    padding: 35px 22px;
  }


  .login-container {
    max-width: 430px;
  }

}

</style>
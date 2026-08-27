<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const submitted = ref(false)
const errorMessage = ref('')

function handleSubmit() {
  errorMessage.value = ''

  if (!email.value) {
    errorMessage.value = 'Please enter your email address.'
    return
  }

  submitted.value = true

  /*
   * BACKEND INTEGRATION POINT
   *
   * Later this will call something like:
   *
   * POST /api/auth/forgot-password
   *
   * The backend will send the actual reset email.
   */
}

function goToLogin() {
  router.push('/login')
}
</script>

<template>
  <main class="forgot-page">

    <section class="forgot-container">

      <div class="brand">
        <div class="logo">
          AD
        </div>

        <div class="brand-name">
          ApplyDirect <strong>SA</strong>
        </div>
      </div>


      <button
        type="button"
        class="back-button"
        @click="goToLogin"
      >
        ← Back to login
      </button>


      <div v-if="!submitted">

        <div class="header">

          <div class="eyebrow">
            ACCOUNT RECOVERY
          </div>

          <h1>
            Forgot your password?
          </h1>

          <p>
            Enter the email address associated with your
            account and we'll help you get back in.
          </p>

        </div>


        <form @submit.prevent="handleSubmit">

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


          <p
            v-if="errorMessage"
            class="error-message"
          >
            {{ errorMessage }}
          </p>


          <button
            type="submit"
            class="submit-button"
          >
            Send reset link
            <span>→</span>
          </button>

        </form>

      </div>


      <div
        v-else
        class="success-state"
      >

        <div class="success-icon">
          ✓
        </div>

        <h1>
          Check your inbox
        </h1>

        <p>
          If an account exists for
          <strong>{{ email }}</strong>,
          you'll receive instructions to reset your password.
        </p>

        <button
          type="button"
          class="login-button"
          @click="goToLogin"
        >
          Back to login
        </button>

      </div>


      <p class="footer">
        ApplyDirect SA · Built for students across South Africa
      </p>

    </section>

  </main>
</template>


<style scoped>

.forgot-page {
  min-height: 100vh;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 40px 20px;

  background: #f7f7f9;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;

  color: #182033;
}


.forgot-container {
  width: 100%;

  max-width: 430px;

  padding: 42px;

  background: #ffffff;

  border:
    1px solid #e4e5e9;

  border-radius: 8px;

  box-shadow:
    0 12px 35px rgba(20, 24, 40, 0.06);
}


/* BRAND */

.brand {
  display: flex;

  align-items: center;

  gap: 10px;

  margin-bottom: 45px;
}


.logo {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 5px;

  background: #4724a6;

  color: #ffffff;

  font-size: 11px;

  font-weight: 800;
}


.brand-name {
  font-size: 17px;

  letter-spacing: -0.3px;
}


.brand-name strong {
  font-weight: 800;
}


/* BACK */

.back-button {
  margin-bottom: 30px;

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


/* HEADER */

.eyebrow {
  margin-bottom: 12px;

  color: #6a42c1;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.4px;
}


.header h1,
.success-state h1 {
  margin: 0 0 10px;

  color: #182033;

  font-size: 29px;

  line-height: 1.15;

  letter-spacing: -1px;
}


.header p,
.success-state p {
  margin: 0;

  color: #737b89;

  font-size: 13px;

  line-height: 1.7;
}


/* FORM */

.form-field {
  margin-top: 28px;
}


.form-field label {
  display: block;

  margin-bottom: 7px;

  color: #30394b;

  font-size: 12px;

  font-weight: 600;
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
}


.form-field input:focus {
  border-color: #6240bd;

  box-shadow:
    0 0 0 3px
    rgba(98, 64, 189, 0.08);
}


.form-field input::placeholder {
  color: #a1a8b4;
}


/* ERROR */

.error-message {
  margin: 12px 0 0;

  padding: 9px 11px;

  border:
    1px solid #efc9c9;

  border-radius: 4px;

  background: #fff7f7;

  color: #b42318;

  font-size: 10px;
}


/* BUTTON */

.submit-button,
.login-button {
  width: 100%;

  height: 48px;

  margin-top: 20px;

  border: none;

  border-radius: 5px;

  background: #4724a6;

  color: #ffffff;

  font-size: 13px;

  font-weight: 700;

  cursor: pointer;
}


.submit-button:hover,
.login-button:hover {
  background: #3d1f91;
}


.submit-button span {
  margin-left: 7px;

  font-size: 16px;
}


/* SUCCESS */

.success-state {
  text-align: center;

  padding: 10px 0;
}


.success-icon {
  width: 55px;
  height: 55px;

  margin: 0 auto 20px;

  display: flex;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: #eaf7ef;

  color: #319153;

  font-size: 25px;

  font-weight: 700;
}


.success-state strong {
  color: #303747;
}


/* FOOTER */

.footer {
  margin: 40px 0 0;

  text-align: center;

  color: #a0a5ae;

  font-size: 9px;
}


@media (max-width: 500px) {

  .forgot-container {
    padding: 30px 24px;
  }

}

</style>
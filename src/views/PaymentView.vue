<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const selectedMethod = ref('card')
const processing = ref(false)
const paymentSuccess = ref(false)
const errorMessage = ref('')

const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')
const cardName = ref('')

const applicationFee = 250

function formatCardNumber(event) {
  let value = event.target.value.replace(/\D/g, '')

  value = value.substring(0, 16)

  cardNumber.value = value.replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(event) {
  let value = event.target.value.replace(/\D/g, '')

  if (value.length > 4) {
    value = value.substring(0, 4)
  }

  if (value.length >= 3) {
    value = `${value.substring(0, 2)}/${value.substring(2)}`
  }

  expiry.value = value
}

async function handlePayment() {
  errorMessage.value = ''

  if (selectedMethod.value === 'card') {
    if (
      !cardNumber.value ||
      !expiry.value ||
      !cvv.value ||
      !cardName.value
    ) {
      errorMessage.value =
        'Please complete all card details before continuing.'

      return
    }

    const cleanCardNumber =
      cardNumber.value.replace(/\s/g, '')

    if (cleanCardNumber.length !== 16) {
      errorMessage.value =
        'Please enter a valid 16-digit card number.'

      return
    }

    if (cvv.value.length !== 3) {
      errorMessage.value =
        'Please enter a valid 3-digit CVV.'

      return
    }
  }

  processing.value = true

  /*
   * BACKEND INTEGRATION POINT
   *
   * Later your team can replace this section with:
   *
   * POST /api/payments
   *
   * The backend will then communicate with the
   * actual payment provider.
   */

  try {
    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    )

    paymentSuccess.value = true

  } catch (error) {
    errorMessage.value =
      'Payment could not be completed. Please try again.'

  } finally {
    processing.value = false
  }
}

function goBackToLogin() {
  router.push('/login')
}
</script>


<template>
  <main class="payment-page">

    <!-- HEADER -->

    <header class="payment-header">

      <div class="brand">

        <div class="logo">
          AD
        </div>

        <div class="brand-name">
          ApplyDirect <strong>SA</strong>
        </div>

      </div>


      <div class="secure-label">
        <span class="secure-dot"></span>
        Secure payment
      </div>

    </header>



    <!-- MAIN CONTENT -->

    <section class="payment-content">

      <!-- LEFT -->

      <div class="payment-intro">

        <button
          type="button"
          class="back-button"
          @click="goBackToLogin"
        >
          ← Back
        </button>


        <p class="eyebrow">
          APPLICATION PAYMENT
        </p>


        <h1>
          Complete your application.
        </h1>


        <p class="intro-text">
          You're one step away from submitting your
          application. Review the details below and
          complete your payment securely.
        </p>


        <!-- APPLICATION SUMMARY -->

        <div class="application-card">

          <div class="application-heading">
            <div>
              <span class="label">
                APPLICATION
              </span>

              <h2>
                University Application
              </h2>
            </div>

            <span class="status">
              Ready
            </span>
          </div>


          <div class="divider"></div>


          <div class="application-details">

            <div>
              <span>Application fee</span>
              <strong>R250.00</strong>
            </div>

            <div>
              <span>Processing</span>
              <strong>Included</strong>
            </div>

            <div>
              <span>Application status</span>
              <strong>Awaiting payment</strong>
            </div>

          </div>

        </div>


        <div class="notice">

          <span class="notice-icon">i</span>

          <p>
            Your application will only be submitted after
            successful payment confirmation.
          </p>

        </div>

      </div>



      <!-- RIGHT PAYMENT CARD -->

      <div class="payment-card">

        <!-- SUCCESS -->

        <div
          v-if="paymentSuccess"
          class="success-state"
        >

          <div class="success-icon">
            ✓
          </div>

          <h2>
            Payment successful
          </h2>

          <p>
            Your payment has been received and your
            application is ready to continue.
          </p>

          <button
            type="button"
            class="continue-button"
          >
            Continue to application
            <span>→</span>
          </button>

        </div>


        <!-- PAYMENT FORM -->

        <div v-else>

          <div class="payment-card-header">

            <h2>
              Payment details
            </h2>

            <p>
              Choose how you'd like to pay.
            </p>

          </div>


          <!-- PAYMENT METHODS -->

          <div class="payment-methods">

            <button
              type="button"
              class="method"
              :class="{
                active: selectedMethod === 'card'
              }"
              @click="selectedMethod = 'card'"
            >

              <span class="method-radio">
                <span
                  v-if="selectedMethod === 'card'"
                ></span>
              </span>

              <span class="method-content">
                <strong>Card</strong>
                <small>
                  Visa, Mastercard
                </small>
              </span>

            </button>


            <button
              type="button"
              class="method"
              :class="{
                active: selectedMethod === 'eft'
              }"
              @click="selectedMethod = 'eft'"
            >

              <span class="method-radio">
                <span
                  v-if="selectedMethod === 'eft'"
                ></span>
              </span>

              <span class="method-content">
                <strong>EFT</strong>
                <small>
                  Pay via bank transfer
                </small>
              </span>

            </button>

          </div>



          <!-- CARD FORM -->

          <form
            v-if="selectedMethod === 'card'"
            @submit.prevent="handlePayment"
          >

            <div class="form-field">

              <label for="cardName">
                Name on card
              </label>

              <input
                id="cardName"
                v-model="cardName"
                type="text"
                placeholder="Full name"
                autocomplete="cc-name"
              />

            </div>


            <div class="form-field">

              <label for="cardNumber">
                Card number
              </label>

              <input
                id="cardNumber"
                :value="cardNumber"
                type="text"
                inputmode="numeric"
                placeholder="1234 5678 9012 3456"
                autocomplete="cc-number"
                maxlength="19"
                @input="formatCardNumber"
              />

            </div>


            <div class="input-row">

              <div class="form-field">

                <label for="expiry">
                  Expiry date
                </label>

                <input
                  id="expiry"
                  :value="expiry"
                  type="text"
                  inputmode="numeric"
                  placeholder="MM/YY"
                  autocomplete="cc-exp"
                  maxlength="5"
                  @input="formatExpiry"
                />

              </div>


              <div class="form-field">

                <label for="cvv">
                  CVV
                </label>

                <input
                  id="cvv"
                  v-model="cvv"
                  type="password"
                  inputmode="numeric"
                  placeholder="•••"
                  autocomplete="cc-csc"
                  maxlength="3"
                />

              </div>

            </div>


            <p
              v-if="errorMessage"
              class="error-message"
              role="alert"
            >
              {{ errorMessage }}
            </p>


            <!-- TOTAL -->

            <div class="payment-total">

              <span>
                Total
              </span>

              <strong>
                R250.00
              </strong>

            </div>


            <button
              type="submit"
              class="pay-button"
              :disabled="processing"
            >

              <span v-if="!processing">
                Pay R250.00
                <span>→</span>
              </span>

              <span
                v-else
                class="processing"
              >
                <span class="spinner"></span>
                Processing...
              </span>

            </button>

          </form>



          <!-- EFT -->

          <div
            v-else
            class="eft-section"
          >

            <div class="eft-icon">
              $
            </div>

            <h3>
              EFT payment
            </h3>

            <p>
              Your banking details will be provided
              after you continue.
            </p>


            <button
              type="button"
              class="pay-button"
              @click="handlePayment"
              :disabled="processing"
            >

              <span v-if="!processing">
                Continue with EFT
                <span>→</span>
              </span>

              <span
                v-else
                class="processing"
              >
                <span class="spinner"></span>
                Processing...
              </span>

            </button>

          </div>



          <!-- SECURITY -->

          <div class="security-note">

            <span>✓</span>

            <p>
              Your payment information is encrypted
              and securely processed.
            </p>

          </div>

        </div>

      </div>

    </section>

  </main>
</template>


<style scoped>

* {
  box-sizing: border-box;
}


.payment-page {
  min-height: 100vh;

  background: #f7f7f9;

  color: #182033;

  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Arial,
    sans-serif;
}


/* HEADER */

.payment-header {
  height: 76px;

  padding: 0 7%;

  display: flex;

  align-items: center;

  justify-content: space-between;

  background: #ffffff;

  border-bottom:
    1px solid #e8e9ed;
}


.brand {
  display: flex;

  align-items: center;

  gap: 10px;
}


.logo {
  width: 38px;
  height: 38px;

  display: flex;

  align-items: center;
  justify-content: center;

  background: #4724a6;

  color: #ffffff;

  border-radius: 5px;

  font-size: 11px;

  font-weight: 800;
}


.brand-name {
  font-size: 17px;

  color: #202638;

  letter-spacing: -0.3px;
}


.brand-name strong {
  font-weight: 800;
}


.secure-label {
  display: flex;

  align-items: center;

  gap: 7px;

  color: #697180;

  font-size: 11px;

  font-weight: 600;
}


.secure-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #39a866;
}



/* MAIN */

.payment-content {
  width: 90%;

  max-width: 1120px;

  margin: 0 auto;

  padding: 65px 0;

  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    440px;

  gap: 90px;

  align-items: start;
}



/* INTRO */

.payment-intro {
  padding-top: 8px;
}


.back-button {
  padding: 0;

  margin-bottom: 38px;

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


.eyebrow {
  margin: 0 0 15px;

  color: #6a42c1;

  font-size: 10px;

  font-weight: 800;

  letter-spacing: 1.5px;
}


.payment-intro h1 {
  max-width: 600px;

  margin: 0;

  font-size: clamp(38px, 4vw, 55px);

  line-height: 1.04;

  letter-spacing: -2.5px;

  font-weight: 700;

  color: #182033;
}


.intro-text {
  max-width: 540px;

  margin: 23px 0 40px;

  color: #697180;

  font-size: 14px;

  line-height: 1.75;
}



/* APPLICATION CARD */

.application-card {
  max-width: 570px;

  padding: 22px;

  background: #ffffff;

  border:
    1px solid #e4e5e9;

  border-radius: 7px;
}


.application-heading {
  display: flex;

  justify-content: space-between;

  align-items: flex-start;

  gap: 20px;
}


.label {
  display: block;

  margin-bottom: 6px;

  color: #9298a3;

  font-size: 9px;

  font-weight: 800;

  letter-spacing: 1.2px;
}


.application-heading h2 {
  margin: 0;

  font-size: 16px;

  font-weight: 700;

  color: #202638;
}


.status {
  padding: 6px 9px;

  border-radius: 4px;

  background: #f1f8f3;

  color: #318b4e;

  font-size: 9px;

  font-weight: 700;
}


.divider {
  width: 100%;

  height: 1px;

  margin: 20px 0;

  background: #ececf0;
}


.application-details {
  display: flex;

  flex-direction: column;

  gap: 13px;
}


.application-details div {
  display: flex;

  justify-content: space-between;

  gap: 20px;

  font-size: 11px;
}


.application-details span {
  color: #858b96;
}


.application-details strong {
  color: #343b4b;

  font-weight: 600;
}



/* NOTICE */

.notice {
  max-width: 570px;

  margin-top: 18px;

  display: flex;

  align-items: flex-start;

  gap: 10px;
}


.notice-icon {
  width: 17px;
  height: 17px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid #aeb3bd;

  border-radius: 50%;

  color: #727985;

  font-size: 10px;

  font-weight: 700;
}


.notice p {
  margin: 0;

  color: #8a909b;

  font-size: 10px;

  line-height: 1.6;
}



/* PAYMENT CARD */

.payment-card {
  padding: 28px;

  background: #ffffff;

  border:
    1px solid #e2e3e8;

  border-radius: 8px;

  box-shadow:
    0 10px 30px rgba(26, 30, 45, 0.05);
}


.payment-card-header {
  margin-bottom: 22px;
}


.payment-card-header h2 {
  margin: 0 0 5px;

  color: #202638;

  font-size: 19px;

  letter-spacing: -0.4px;
}


.payment-card-header p {
  margin: 0;

  color: #858b96;

  font-size: 11px;
}



/* METHODS */

.payment-methods {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 9px;

  margin-bottom: 22px;
}


.method {
  min-height: 58px;

  padding: 10px;

  display: flex;

  align-items: center;

  gap: 9px;

  border:
    1px solid #e0e2e7;

  border-radius: 5px;

  background: #ffffff;

  text-align: left;

  cursor: pointer;

  transition: 0.15s ease;
}


.method:hover {
  border-color: #bcbfc8;
}


.method.active {
  border-color: #6843bd;

  background: #faf9fe;
}


.method-radio {
  width: 15px;
  height: 15px;

  flex-shrink: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  border:
    1px solid #b9bdc6;

  border-radius: 50%;
}


.method.active .method-radio {
  border-color: #6843bd;
}


.method-radio span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #6843bd;
}


.method-content {
  display: flex;

  flex-direction: column;

  gap: 2px;
}


.method-content strong {
  color: #303747;

  font-size: 11px;
}


.method-content small {
  color: #9197a2;

  font-size: 9px;
}



/* FORM */

.form-field {
  margin-bottom: 17px;
}


.form-field label {
  display: block;

  margin-bottom: 6px;

  color: #3a4251;

  font-size: 10px;

  font-weight: 700;
}


.form-field input {
  width: 100%;

  height: 43px;

  padding: 0 11px;

  border:
    1px solid #d9dce2;

  border-radius: 4px;

  outline: none;

  background: #ffffff;

  color: #202638;

  font-size: 11px;

  transition: 0.15s ease;
}


.form-field input::placeholder {
  color: #a5aab3;
}


.form-field input:focus {
  border-color: #6741ba;

  box-shadow:
    0 0 0 3px
    rgba(103,65,186,0.07);
}


.input-row {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 12px;
}



/* ERROR */

.error-message {
  margin: 0 0 15px;

  padding: 9px 11px;

  border:
    1px solid #efc9c9;

  border-radius: 4px;

  background: #fff7f7;

  color: #b42318;

  font-size: 10px;

  line-height: 1.5;
}



/* TOTAL */

.payment-total {
  padding-top: 18px;

  margin-top: 3px;

  border-top:
    1px solid #ececf0;

  display: flex;

  align-items: center;

  justify-content: space-between;
}


.payment-total span {
  color: #777e8a;

  font-size: 11px;
}


.payment-total strong {
  color: #202638;

  font-size: 18px;
}



/* PAY */

.pay-button,
.continue-button {
  width: 100%;

  height: 46px;

  margin-top: 18px;

  border: none;

  border-radius: 5px;

  background: #4724a6;

  color: #ffffff;

  font-size: 11px;

  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}


.pay-button:hover:not(:disabled),
.continue-button:hover {
  background: #3d1f91;
}


.pay-button:disabled {
  opacity: 0.65;

  cursor: not-allowed;
}


.pay-button span:not(.processing) {
  margin-left: 5px;
}


.processing {
  display: flex;

  align-items: center;

  justify-content: center;

  gap: 8px;
}


.spinner {
  width: 13px;
  height: 13px;

  border:
    2px solid
    rgba(255,255,255,0.35);

  border-top-color: #ffffff;

  border-radius: 50%;

  animation: spin 0.7s linear infinite;
}


@keyframes spin {

  to {
    transform: rotate(360deg);
  }

}



/* SECURITY */

.security-note {
  margin-top: 20px;

  padding-top: 17px;

  border-top:
    1px solid #ececf0;

  display: flex;

  gap: 8px;

  align-items: flex-start;
}


.security-note span {
  color: #38945a;

  font-size: 12px;

  font-weight: 800;
}


.security-note p {
  margin: 0;

  color: #9297a1;

  font-size: 9px;

  line-height: 1.5;
}



/* EFT */

.eft-section {
  padding: 15px 0 5px;

  text-align: center;
}


.eft-icon {
  width: 42px;
  height: 42px;

  margin: 0 auto 15px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #f0ecfa;

  color: #6843bd;

  font-size: 17px;

  font-weight: 700;
}


.eft-section h3 {
  margin: 0 0 7px;

  font-size: 16px;

  color: #202638;
}


.eft-section p {
  margin: 0;

  color: #858b96;

  font-size: 11px;

  line-height: 1.6;
}



/* SUCCESS */

.success-state {
  padding: 30px 5px;

  text-align: center;
}


.success-icon {
  width: 55px;
  height: 55px;

  margin: 0 auto 18px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: #eaf7ef;

  color: #319153;

  font-size: 25px;

  font-weight: 700;
}


.success-state h2 {
  margin: 0 0 8px;

  color: #202638;

  font-size: 21px;
}


.success-state p {
  max-width: 300px;

  margin: 0 auto;

  color: #858b96;

  font-size: 11px;

  line-height: 1.7;
}



/* MOBILE */

@media (max-width: 850px) {

  .payment-content {
    grid-template-columns: 1fr;

    gap: 40px;

    max-width: 650px;
  }

  .payment-intro h1 {
    font-size: 42px;
  }

}


@media (max-width: 600px) {

  .payment-header {
    padding: 0 22px;
  }

  .payment-content {
    width: auto;

    margin: 0;

    padding: 40px 22px;
  }

  .payment-intro h1 {
    font-size: 36px;
  }

  .payment-methods {
    grid-template-columns: 1fr;
  }

  .input-row {
    grid-template-columns: 1fr;
    gap: 0;
  }

}

</style>
<template>
  <div class="payment-page">
    <div class="page-header">
      <h1>Complete Your Payment</h1>
      <p>Secure checkout — your information is safe with us</p>
    </div>

    <div class="container">
      <div v-if="success" class="success-panel">
        <svg class="success-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 8 12 16 9 12"/></svg>
        <h2>Payment Successful</h2>
        <p>Your {{ planName }} subscription has been activated. A confirmation will be sent shortly.</p>
        <div class="success-details">
          <div class="success-row"><span>Amount Paid</span><strong>{{ success.amount === 0 ? 'Free' : displayPrice(success.amount) }}</strong></div>
          <div class="success-row"><span>Transaction Ref</span><strong>{{ success.transactionRef }}</strong></div>
          <div v-if="success.cardLastFour" class="success-row"><span>Card ending in</span><strong>•••• {{ success.cardLastFour }}</strong></div>
        </div>
        <button class="btn btn-primary" @click="$router.push('/payment-plan')">Back to Plans</button>
      </div>

      <div v-else class="checkout-grid">
        <!-- Payment Form -->
        <div class="checkout-form-wrapper">
          <form @submit.prevent="handlePayment" class="checkout-form">

            <!-- Plan selection -->
            <div class="form-section">
              <h3 class="selected-plan-title">Selected Plan</h3>
              <div class="selected-plan">
                <strong>{{ planName }} Plan</strong>
                <span>{{ displayPrice(planPrice) }}</span>
                <router-link to="/payment-plan" class="change-plan">Change plan</router-link>
              </div>
            </div>

            <!-- Personal Info -->
            <div class="form-section">
              <h3><span class="section-num">1</span> Personal Information</h3>
              <div class="form-row-2">
                <div class="form-group">
                  <label>First Name *</label>
                  <input type="text" v-model="form.firstName" @input="form.firstName = sanitizeName(form.firstName)" placeholder="First name" required />
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input type="text" v-model="form.lastName" @input="form.lastName = sanitizeName(form.lastName)" placeholder="Last name" required />
                </div>
              </div>
              <div class="form-group">
                <label>Email Address *</label>
                <input type="email" v-model="form.email" placeholder="you@example.com" required />
              </div>
              <div class="form-group">
                <label>Phone Number *</label>
                <input type="tel" v-model="form.phone" placeholder="+27 ..." required />
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-section">
              <h3><span class="section-num">2</span> Payment Method</h3>
              <div class="method-tabs">
                <button type="button" :class="['method-tab', { active: paymentMethod === 'card' }]" @click="paymentMethod = 'card'">
                  Credit/Debit Card
                </button>
                <button type="button" :class="['method-tab', { active: paymentMethod === 'eft' }]" @click="paymentMethod = 'eft'">
                  EFT / Bank Transfer
                </button>
                <button type="button" :class="['method-tab', { active: paymentMethod === 'instant' }]" @click="paymentMethod = 'instant'">
                  Instant EFT
                </button>
              </div>

              <!-- Card Details -->
              <div v-if="paymentMethod === 'card'" class="card-form">
                <div class="form-group">
                  <label>Card Number *</label>
                  <input type="text" v-model="form.cardNumber" @input="formatCardNumber" placeholder="1234 5678 9012 3456" maxlength="19" required />
                </div>
                <div class="form-group">
                  <label>Cardholder Name *</label>
                  <input type="text" v-model="form.cardName" placeholder="Name on card" required />
                </div>
                <div class="form-row-2">
                  <div class="form-group">
                    <label>Expiry Date *</label>
                    <input type="text" v-model="form.expiry" @input="formatExpiry" placeholder="MM/YY" maxlength="5" required />
                  </div>
                  <div class="form-group">
                    <label>CVV *</label>
                    <input type="password" v-model="form.cvv" placeholder="123" maxlength="3" required />
                  </div>
                </div>
              </div>

              <!-- EFT Details -->
              <div v-if="paymentMethod === 'eft'" class="eft-form">
                <div class="bank-info">
                  <p>Make an EFT payment to the following account:</p>
                  <div class="bank-details">
                    <div class="bank-row"><span>Bank:</span><strong>First National Bank</strong></div>
                    <div class="bank-row"><span>Account Name:</span><strong>ApplyDirect SA (Pty) Ltd</strong></div>
                    <div class="bank-row"><span>Account Number:</span><strong>628 0000 0000</strong></div>
                    <div class="bank-row"><span>Branch Code:</span><strong>250 655</strong></div>
                    <div class="bank-row"><span>Reference:</span><strong>{{ referenceCode }}</strong></div>
                  </div>
                </div>
              </div>

              <!-- Instant EFT -->
              <div v-if="paymentMethod === 'instant'" class="instant-form">
                <p class="instant-info">You will be redirected to PayFast to complete your payment securely.</p>
                <div class="form-group">
                  <label>Select Your Bank *</label>
                  <select v-model="form.bank" required>
                    <option value="">Choose your bank</option>
                    <option>ABSA</option>
                    <option>Capitec</option>
                    <option>FNB</option>
                    <option>Nedbank</option>
                    <option>Standard Bank</option>
                    <option>Investec</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Billing Address -->
            <div class="form-section">
              <h3><span class="section-num">3</span> Billing Address</h3>
              <div class="form-group">
                <label>Street Address *</label>
                <input type="text" v-model="form.address" placeholder="123 Main Street" required />
              </div>
              <div class="form-row-2">
                <div class="form-group">
                  <label>City *</label>
                  <input type="text" v-model="form.city" placeholder="Cape Town" required />
                </div>
                <div class="form-group">
                  <label>Province *</label>
                  <select v-model="form.province" required>
                    <option value="">Select province</option>
                    <option>Western Cape</option>
                    <option>Gauteng</option>
                    <option>KwaZulu-Natal</option>
                    <option>Eastern Cape</option>
                    <option>Free State</option>
                    <option>Limpopo</option>
                    <option>Mpumalanga</option>
                    <option>Northern Cape</option>
                    <option>North West</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label>Postal Code *</label>
                <input type="text" v-model="form.postalCode" placeholder="8001" required />
              </div>
            </div>

            <!-- Terms -->
            <div class="form-section">
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agreeTerms" required />
                <span>I agree to the <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a></span>
              </label>
              <label class="checkbox-label">
                <input type="checkbox" v-model="form.agreeRefund" required />
                <span>I understand the <a href="#">Refund Policy</a></span>
              </label>
            </div>

            <div v-if="error" class="alert alert-error">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              <span>{{ error }}</span>
            </div>

            <button type="submit" class="btn btn-accent btn-full btn-pay" :disabled="processing">
              <span v-if="processing" class="spinner"></span>
              {{ processing ? 'Processing...' : 'Pay ' + displayPrice(planPrice) }}
            </button>
          </form>
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <div class="summary-card">
            <h3>Order Summary</h3>
            <div class="summary-plan">
              <span class="plan-badge">{{ planName }} Plan</span>
              <p>{{ planDescription }}</p>
            </div>

            <div class="summary-breakdown">
              <div class="summary-row">
                <span>{{ planName }} Plan</span>
                <span>{{ displayPrice(planPrice) }}</span>
              </div>
              <div class="summary-row">
                <span>Service fee</span>
                <span>R 0.00</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ displayPrice(planPrice) }}</span>
              </div>
            </div>

            <div class="summary-features">
              <h4>What's included:</h4>
              <ul>
                <li v-for="f in planFeatures" :key="f">✓ {{ f }}</li>
              </ul>
            </div>

            <div class="security-badges">
              <span>SSL Encrypted</span>
              <span>Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ordersAPI } from '../store/api.js'

const formatPrice = n => 'R ' + Number(n || 0).toLocaleString('en-ZA')

export default {
  name: 'Payment',
  data() {
    return {
      paymentMethod: 'card',
      processing: false,
      error: '',
      success: null,
      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        idNumber: '',
        cardNumber: '',
        cardName: '',
        expiry: '',
        cvv: '',
        bank: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        agreeTerms: false,
        agreeRefund: false
      }
    }
  },
  computed: {
    planId() {
      return Number(this.$route.query.id) || null
    },
    planName() {
      return this.$route.query.plan || 'Premium'
    },
    planPrice() {
      return Number(this.$route.query.price) || 500
    },
    planDescription() {
      return this.$route.query.description || 'Application to up to 5 universities + career guidance'
    },
    planFeatures() {
      const plans = {
        'Basic': ['Application to 1 university', 'Document verification', 'Application submission', 'Status tracking', 'Email support'],
        'Premium': ['Application to up to 5 universities', 'Document verification & optimization', 'Application submission', 'Real-time status tracking', 'Dedicated advisor', 'Career guidance session', 'Job placement assistance after graduation']
      }
      return plans[this.planName] || plans['Premium']
    },
    referenceCode() {
      return 'UA-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    }
  },
  methods: {
    sanitizeName(v) {
      return v.replace(/[^A-Za-z\u00C0-\u024F'\- .]/g, '').replace(/\s{2,}/g, ' ')
    },
    displayPrice(n) {
      return formatPrice(n)
    },
    async handlePayment() {
      this.error = ''

      if (!this.planId) {
        this.error = 'No plan selected. Please choose a plan first.'
        return
      }

      this.processing = true
      try {
        // 1. Create the order for the selected package.
        //    A 409 means an active (paid) order already exists for this plan —
        //    treat that as already activated instead of failing.
        let order
        try {
          order = await ordersAPI.create(this.planId)
        } catch (createErr) {
          if (createErr.status === 409) {
            this.success = {
              amount: Number(this.planPrice),
              transactionRef: 'EXISTING-' + this.planId
            }
            window.scrollTo({ top: 0, behavior: 'smooth' })
            return
          }
          throw createErr
        }

        // Free plan (price 0)? The backend marks the order as paid on creation —
        // there is nothing to pay, so activate it right away.
        if (Number(this.planPrice) === 0) {
          this.success = {
            amount: 0,
            transactionRef: order.status === 'paid' ? ('FREE-' + order.id) : 'FREE'
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }

        // 2. Redirect to PayFast to complete the payment securely.
        //    If PayFast is not configured on the server, fall back to the
        //    simulated gateway so the checkout still works in demo mode.
        let payFastRedirect
        try {
          payFastRedirect = await ordersAPI.payfastInit(order.id)
        } catch (pfErr) {
          if (pfErr.code !== 'PAYFAST_NOT_CONFIGURED') throw pfErr
        }

        if (payFastRedirect) {
          this.sendToPayFast(payFastRedirect)
          return
        }

        const methodMap = {
          card: 'credit_card',
          eft: 'bank_transfer',
          instant: 'instant_eft'
        }
        const payment = await ordersAPI.pay(order.id, {
          cardNumber: this.form.cardNumber,
          cardHolder: this.form.cardName,
          expiry: this.form.expiry,
          cvv: this.form.cvv,
          paymentMethod: methodMap[this.paymentMethod]
        })
        this.success = payment
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        this.error = err.error || 'Payment failed. Please try again.'
      } finally {
        this.processing = false
      }
    },

    sendToPayFast(redirect) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = redirect.processUrl
      form.style.display = 'none'
      for (const [name, value] of Object.entries(redirect.fields)) {
        const input = document.createElement('input')
        input.type = 'hidden'
        input.name = name
        input.value = value
        form.appendChild(input)
      }
      document.body.appendChild(form)
      form.submit()
    },

    formatCardNumber() {
      let value = this.form.cardNumber.replace(/\D/g, '')
      value = value.substring(0, 16)
      this.form.cardNumber = value.replace(/(.{4})/g, '$1 ').trim()
    },

    formatExpiry() {
      let value = this.form.expiry.replace(/\D/g, '')
      value = value.substring(0, 4)
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2)
      }
      this.form.expiry = value
    }
  }
}
</script>

<style scoped>
.payment-page {
  background-color: #f4f6f9;
  min-height: 100vh;
  padding-bottom: 80px;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  margin: 48px 0 60px;
  align-items: start;
}

.checkout-form-wrapper {
  background: #ffffff !important;
  border: 1px solid #e5e7eb;
  border-radius: var(--radius-md, 6px);
  padding: 36px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid #f3f4f6;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 24px;
  padding-bottom: 0;
}

.form-section h3 {
  font-size: 1.1rem;
  color: #000A52 !important;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e0e7ff;
  color: #001489;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  flex-shrink: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}

.form-group label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1a1a1a !important;
}

.form-group input,
.form-group select {
  background: #ffffff !important;
  color: #1a1a1a !important;
  border: 1.5px solid #d1d5db;
  border-radius: 4px;
  padding: 10px 12px;
  font-size: 0.92rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #3B4DCD;
  outline: none;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.selected-plan {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb !important;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 14px 16px;
  font-size: 0.95rem;
  color: #1a1a1a !important;
}

.selected-plan strong {
  color: #000A52 !important;
}

.selected-plan span {
  color: #4b5563 !important;
  margin-left: auto;
}

.change-plan {
  font-size: 0.82rem;
  color: #3B4DCD;
  font-weight: 600;
}

.method-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.method-tab {
  padding: 12px 10px;
  border: 1.5px solid #e5e7eb;
  border-radius: 4px;
  background: #ffffff !important;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  color: #4b5563 !important;
  font-family: inherit;
  text-align: center;
}

.method-tab.active {
  border-color: #3B4DCD;
  color: #3B4DCD !important;
  background: #f0f4ff !important;
}

.bank-info {
  background: #f9fafb !important;
  padding: 20px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}

.bank-info > p {
  font-size: 0.9rem;
  color: #4b5563 !important;
  margin-bottom: 16px;
}

.bank-details {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bank-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.92rem;
}

.bank-row:last-child {
  border-bottom: none;
}

.bank-row span {
  color: #4b5563 !important;
}

.bank-row strong {
  color: #1a1a1a !important;
}

.instant-info {
  font-size: 0.92rem;
  color: #4b5563 !important;
  margin-bottom: 16px;
  padding: 14px;
  background: #f0f4ff;
  border-radius: 4px;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: #4b5563 !important;
  cursor: pointer;
  margin-bottom: 12px;
}

.checkbox-label input {
  width: auto;
  margin-top: 3px;
}

.checkbox-label a {
  color: #3B4DCD;
  font-weight: 600;
}

.btn-pay {
  width: 100%;
  padding: 16px;
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background-color: #E03C31;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.btn-full {
  width: 100%;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px;
  border-radius: 4px;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 16px;
}

.alert svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.success-panel {
  max-width: 520px;
  margin: 64px auto;
  text-align: center;
  background: #ffffff !important;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 48px 40px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
}

.success-icon {
  color: #007749;
  margin: 0 auto 18px;
}

.success-panel h2 {
  font-size: 1.6rem;
  color: #1a1a1a !important;
  margin-bottom: 10px;
}

.success-panel > p {
  color: #4b5563 !important;
  margin-bottom: 24px;
}

.success-details {
  text-align: left;
  background: #f9fafb !important;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 16px 20px;
  margin-bottom: 28px;
}

.success-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 0.92rem;
}

.success-row:last-child {
  border-bottom: none;
}

.success-row span {
  color: #4b5563 !important;
}

.success-row strong {
  color: #1a1a1a !important;
}

.summary-card {
  background: #ffffff !important;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 32px;
  position: sticky;
  top: 88px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
  color: #1a1a1a !important;
}

.summary-card h3 {
  font-size: 1.1rem;
  color: #000A52 !important;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.summary-plan {
  margin-bottom: 20px;
}

.plan-badge {
  display: inline-block;
  background: #3B4DCD;
  color: white;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.summary-plan p {
  font-size: 0.9rem;
  color: #4b5563 !important;
}

.summary-breakdown {
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  border-top: 1px solid #f3f4f6;
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.92rem;
  color: #4b5563 !important;
}

.summary-row.total {
  border-top: 1px solid #e5e7eb;
  margin-top: 8px;
  padding-top: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  color: #000A52 !important;
}

.summary-features h4 {
  font-size: 0.9rem;
  color: #1a1a1a !important;
  margin-bottom: 12px;
}

.summary-features ul {
  list-style: none;
  padding-left: 0;
}

.summary-features li {
  padding: 6px 0;
  font-size: 0.88rem;
  color: #4b5563 !important;
}

.security-badges {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.security-badges span {
  font-size: 0.78rem;
  color: #6b7280 !important;
  font-weight: 500;
}

@media (max-width: 768px) {
  .checkout-grid {
    grid-template-columns: 1fr;
  }
  .method-tabs {
    grid-template-columns: 1fr;
  }
  .summary-card {
    position: static;
  }
}
</style>
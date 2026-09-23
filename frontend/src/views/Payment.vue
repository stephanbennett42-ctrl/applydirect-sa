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
              <h3><span class="section-num">0</span> Selected Plan</h3>
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
        if (Number(this.planPrice) === 0) {
          const order = await ordersAPI.create(this.planId)
          this.success = {
            amount: 0,
            transactionRef: order.status === 'paid' ? ('FREE-' + order.id) : 'FREE'
          }
          window.scrollTo({ top: 0, behavior: 'smooth' })
          return
        }

        const order = await ordersAPI.create(this.planId)
        const redirect = await ordersAPI.payfastInit(order.id)
        this.sendToPayFast(redirect)
        return
      } catch (err) {
        if (err.code === 'PAYFAST_NOT_CONFIGURED') {
          try {
            const order = await ordersAPI.create(this.planId)
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
            return
          } catch (payErr) {
            this.error = payErr.error || 'Payment failed. Please try again.'
          }
        } else {
          this.error = err.error || 'Payment failed. Please try again.'
        }
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
.checkout-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  margin: 48px 0 60px;
  align-items: start;
}

.checkout-form-wrapper {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 36px;
}

.form-section {
  margin-bottom: 32px;
  padding-bottom: 32px;
  border-bottom: 1px solid var(--border);
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 24px;
  padding-bottom: 0;
}

.form-section h3 {
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--primary-50);
  color: var(--primary);
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
  color: var(--text);
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
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 14px 16px;
  font-size: 0.95rem;
}

.selected-plan strong {
  color: var(--primary-dark);
}

.selected-plan span {
  color: var(--text-light);
  margin-left: auto;
}

.change-plan {
  font-size: 0.82rem;
  color: var(--primary);
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
  border: 1.5px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-fast);
  font-family: inherit;
  text-align: center;
}

.method-tab.active {
  border-color: var(--primary);
  color: var(--primary);
}

.method-tab:hover:not(.active) {
  border-color: var(--primary-light);
}

.bank-info {
  background: var(--bg);
  padding: 20px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
}

.bank-info > p {
  font-size: 0.9rem;
  color: var(--text-light);
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
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}

.bank-row:last-child {
  border-bottom: none;
}

.bank-row span {
  color: var(--text-light);
}

.bank-row strong {
  color: var(--primary);
}

.instant-info {
  font-size: 0.92rem;
  color: var(--text-light);
  margin-bottom: 16px;
  padding: 14px;
  background: rgba(43, 108, 176, 0.06);
  border-radius: var(--radius);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 0.88rem;
  color: var(--text-light);
  cursor: pointer;
  margin-bottom: 12px;
}

.checkbox-label input {
  width: auto;
  margin-top: 3px;
}

.checkbox-label a {
  color: var(--primary-light);
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
  border-radius: var(--radius);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 16px;
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

.success-panel {
  max-width: 520px;
  margin: 64px auto;
  text-align: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 48px 40px;
  box-shadow: var(--shadow-md);
}

.success-icon {
  color: var(--success);
  margin: 0 auto 18px;
}

.success-panel h2 {
  font-size: 1.6rem;
  margin-bottom: 10px;
}

.success-panel > p {
  color: var(--text-light);
  margin-bottom: 24px;
}

.success-details {
  text-align: left;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 28px;
}

.success-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}

.success-row:last-child {
  border-bottom: none;
}

.success-row span {
  color: var(--text-light);
}

.success-row strong {
  color: var(--text);
}

.summary-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 32px;
  position: sticky;
  top: 88px;
}

.summary-card h3 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.summary-plan {
  margin-bottom: 20px;
}

.plan-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  padding: 4px 12px;
  border-radius: var(--radius);
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.summary-plan p {
  font-size: 0.9rem;
  color: var(--text-light);
}

.summary-breakdown {
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.92rem;
  color: var(--text-light);
}

.summary-row.total {
  border-top: 1px solid var(--border);
  margin-top: 8px;
  padding-top: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--primary-dark);
}

.summary-features h4 {
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 12px;
}

.summary-features ul {
  list-style: none;
}

.summary-features li {
  padding: 6px 0;
  font-size: 0.88rem;
  color: var(--text-light);
}

.security-badges {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.security-badges span {
  font-size: 0.78rem;
  color: var(--text-light);
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
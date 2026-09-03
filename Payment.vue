<template>
  <div class="payment-page">
    <div class="page-header">
      <h1>Complete Your Payment</h1>
      <p>Secure checkout — your information is safe with us</p>
    </div>

    <div class="container">
      <div class="checkout-grid">
        <!-- Payment Form -->
        <div class="checkout-form-wrapper">
          <form @submit.prevent="handlePayment" class="checkout-form">

            <!-- Personal Info -->
            <div class="form-section">
              <h3><span class="section-num">1</span> Personal Information</h3>
              <div class="form-row-2">
                <div class="form-group">
                  <label>First Name *</label>
                  <input type="text" v-model="form.firstName" placeholder="First name" required />
                </div>
                <div class="form-group">
                  <label>Last Name *</label>
                  <input type="text" v-model="form.lastName" placeholder="Last name" required />
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
              <div class="form-group">
                <label>ID / Passport Number *</label>
                <input type="text" v-model="form.idNumber" placeholder="South African ID" required />
              </div>
            </div>

            <!-- Payment Method -->
            <div class="form-section">
              <h3><span class="section-num">2</span> Payment Method</h3>
              <div class="method-tabs">
                <button type="button" :class="['method-tab', { active: paymentMethod === 'card' }]" @click="paymentMethod = 'card'">
                  💳 Credit/Debit Card
                </button>
                <button type="button" :class="['method-tab', { active: paymentMethod === 'eft' }]" @click="paymentMethod = 'eft'">
                  🏦 EFT / Bank Transfer
                </button>
                <button type="button" :class="['method-tab', { active: paymentMethod === 'instant' }]" @click="paymentMethod = 'instant'">
                  📱 Instant EFT
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
                    <div class="bank-row"><span>Account Name:</span><strong>UniApply (Pty) Ltd</strong></div>
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

            <button type="submit" class="btn btn-accent btn-full btn-pay" :disabled="processing">
              <span v-if="processing" class="spinner"></span>
              {{ processing ? 'Processing...' : 'Pay ' + planPrice }}
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
                <span>{{ planPrice }}</span>
              </div>
              <div class="summary-row">
                <span>Service fee</span>
                <span>R 0.00</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>{{ planPrice }}</span>
              </div>
            </div>

            <div class="summary-features">
              <h4>What's included:</h4>
              <ul>
                <li v-for="f in planFeatures" :key="f">✓ {{ f }}</li>
              </ul>
            </div>

            <div class="security-badges">
              <span>🔒 SSL Encrypted</span>
              <span>🛡️ Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Payment Page Component
 * Handles the complete checkout process with three payment methods:
 * 1. Credit/Debit Card - with card number, expiry, and CVV fields
 * 2. EFT / Bank Transfer - displays bank details and unique reference code
 * 3. Instant EFT - bank selector for PayFast redirect
 *
 * The page reads plan details from URL query parameters and displays
 * a sticky order summary sidebar. Payment is currently simulated.
 * TODO: Integrate with PayFast or another payment gateway API.
 */
export default {
  name: 'Payment',
  data() {
    return {
      paymentMethod: 'card', // Active payment method tab
      processing: false,     // Loading state during payment processing
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
    /** Retrieves the selected plan name from URL query parameters */
    planName() {
      return this.$route.query.plan || 'Standard'
    },
    /** Retrieves the selected plan price from URL query parameters */
    planPrice() {
      return this.$route.query.price || 'R 4,500'
    },
    /** Retrieves the plan description from URL query parameters */
    planDescription() {
      return this.$route.query.description || 'Application to up to 3 universities'
    },
    /**
     * Returns the feature list for the selected plan.
     * Maps plan names to their respective feature arrays.
     */
    planFeatures() {
      const plans = {
        'Basic': ['Application to 1 university', 'Document verification', 'Application submission', 'Status tracking', 'Email support'],
        'Standard': ['Application to up to 3 universities', 'Document verification', 'Application submission', 'Status tracking', 'Priority email & phone support', 'Program matching assistance'],
        'Premium': ['Application to up to 5 universities', 'Document verification & optimization', 'Application submission', 'Real-time status tracking', 'Dedicated advisor', 'Career guidance session', 'Job placement assistance after graduation']
      }
      return plans[this.planName] || plans['Standard']
    },
    /** Generates a unique reference code for EFT payments */
    referenceCode() {
      return 'UA-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    }
  },
  methods: {
    /**
     * Handle payment form submission.
     * Simulates a 2.5-second processing delay, then shows success
     * message and redirects to the home page.
     * TODO: Replace with actual payment API integration.
     */
    handlePayment() {
      this.processing = true
      setTimeout(() => {
        this.processing = false
        alert('Payment successful! You will receive a confirmation email shortly. Reference: ' + this.referenceCode)
        this.$router.push('/')
      }, 2500)
    },

    /**
     * Format card number input with spaces every 4 digits.
     * Only allows numeric characters and limits to 16 digits.
     */
    formatCardNumber() {
      let value = this.form.cardNumber.replace(/\D/g, '')
      value = value.substring(0, 16)
      this.form.cardNumber = value.replace(/(.{4})/g, '$1 ').trim()
    },

    /**
     * Format expiry date input as MM/YY.
     * Automatically inserts the slash after two digits.
     */
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

/* Payment Method Tabs */
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

/* EFT */
.bank-info {
  background: var(--bg);
  padding: 20px;
  border-radius: var(--radius);
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

/* Instant EFT */
.instant-info {
  font-size: 0.92rem;
  color: var(--text-light);
  margin-bottom: 16px;
  padding: 14px;
  background: rgba(43, 108, 176, 0.06);
  border-radius: var(--radius);
}

/* Terms */
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

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Order Summary */
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

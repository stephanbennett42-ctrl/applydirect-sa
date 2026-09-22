<template>
  <div class="return-page">
    <div class="container">
      <div class="return-card">
        <div v-if="checking" class="return-state">
          <span class="return-spinner"></span>
          <h2>Confirming your payment...</h2>
          <p>Please wait while we verify your transaction with PayFast.</p>
        </div>

        <div v-else-if="success" class="return-state">
          <svg class="return-icon success" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="16 8 12 16 9 12"/></svg>
          <h2>Payment Successful</h2>
          <p>Your {{ planName }} subscription has been activated.</p>
          <div class="return-details">
            <div class="return-row"><span>Amount Paid</span><strong>{{ displayPrice(success.amount) }}</strong></div>
            <div class="return-row"><span>Transaction Ref</span><strong>{{ success.transactionRef }}</strong></div>
          </div>
          <button class="btn btn-primary" @click="$router.push('/payment-plan')">Back to Plans</button>
        </div>

        <div v-else class="return-state">
          <svg class="return-icon error" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <h2>Payment Not Completed</h2>
          <p>{{ error || 'Your payment could not be confirmed. Please try again.' }}</p>
          <button class="btn btn-primary" @click="$router.push('/payment-plan')">Back to Plans</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * PayFast Return Page
 * PayFast redirects the browser back here (return_url) after payment.
 * Reads the confirmation query params and verifies them with the backend.
 */
import { ordersAPI } from '../store/api.js'

export default {
  name: 'PaymentReturn',
  data() {
    return {
      checking: true,
      success: null,
      error: '',
      planName: this.$route.query.plan || 'Subscription'
    }
  },
  computed: {
    orderId() {
      return this.$route.query.m_payment_id
    }
  },
  methods: {
    displayPrice(n) {
      return 'R ' + Number(n || 0).toLocaleString('en-ZA')
    }
  },
  async mounted() {
    const q = this.$route.query
    if (q && (q.m_payment_id || q.orderId)) {
      try {
        const payload = {
          m_payment_id: q.m_payment_id || q.orderId,
          pf_payment_id: q.pf_payment_id,
          payment_status: q.payment_status,
          amount_gross: q.amount_gross,
          signature: q.signature
        }
        this.success = await ordersAPI.payfastConfirm(payload)
        if (q.plan) this.planName = q.plan
      } catch (err) {
        this.error = err.error || 'Payment could not be confirmed'
      }
    } else {
      this.error = 'No payment reference received'
    }
    this.checking = false
  }
}
</script>

<style scoped>
.return-page {
  padding: 80px 0;
}

.return-card {
  max-width: 520px;
  margin: 0 auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 48px 40px;
  box-shadow: var(--shadow-md);
}

.return-state {
  text-align: center;
}

.return-state h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.return-state > p {
  color: var(--text-light);
  margin-bottom: 24px;
}

.return-icon {
  margin: 0 auto 18px;
}

.return-icon.success {
  color: var(--success);
}

.return-icon.error {
  color: var(--accent);
}

.return-details {
  text-align: left;
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 16px 20px;
  margin-bottom: 28px;
}

.return-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.92rem;
}

.return-row:last-child {
  border-bottom: none;
}

.return-row span {
  color: var(--text-light);
}

.return-row strong {
  color: var(--text);
}

.return-spinner {
  width: 34px;
  height: 34px;
  border: 4px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: returnSpin 0.7s linear infinite;
  display: inline-block;
  margin: 0 auto 18px;
}

@keyframes returnSpin {
  to { transform: rotate(360deg); }
}
</style>
<template>
  <div class="plans-page">
    <div class="page-header">
      <h1>Payment Plans</h1>
      <p>Choose the plan that suits your needs. Invest in your future today.</p>
    </div>

    <div class="container">
      <!-- Pricing cards — clean, minimal -->
      <div class="pricing-grid">
        <div v-for="plan in plans" :key="plan.id" :class="['price-card', { featured: plan.highlighted }]">
          <div v-if="plan.highlighted" class="featured-tag">Most Popular</div>
          <div class="price-head">
            <h3>{{ plan.name }}</h3>
            <p>{{ plan.description }}</p>
            <div class="price-amount">
              <span class="price-num">{{ plan.price }}</span>
              <span class="price-period">{{ plan.period }}</span>
            </div>
          </div>
          <ul class="price-features">
            <li v-for="f in plan.features" :key="f">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              {{ f }}
            </li>
          </ul>
          <button :class="['btn', 'btn-block', plan.highlighted ? 'btn-accent' : 'btn-primary']" @click="selectPlan(plan)">
            Choose {{ plan.name }}
          </button>
        </div>
      </div>

      <!-- FAQ — clean accordion -->
      <div class="faq-section">
        <div class="section-header-center">
          <span class="section-eyebrow">FAQ</span>
          <h2 class="section-title">Frequently asked questions</h2>
        </div>

        <div class="faq-list">
          <div v-for="(faq, i) in faqs" :key="i" class="faq-item">
            <button class="faq-q" @click="toggleFaq(i)">
              <span>{{ faq.question }}</span>
              <svg :class="['faq-chevron', { open: openFaq === i }]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div v-if="openFaq === i" class="faq-a">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment methods -->
      <div class="methods-bar">
        <span class="methods-label">We Accept</span>
        <div class="methods-row">
          <div class="method-chip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            <span>Credit/Debit Card</span>
          </div>
          <div class="method-chip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
            <span>EFT / Bank Transfer</span>
          </div>
          <div class="method-chip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
            <span>Instant EFT (PayFast)</span>
          </div>
          <div class="method-chip">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            <span>Cash (at office)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { paymentPlans } from '../../data/universities.js'

export default {
  name: 'PaymentPlan',
  data() {
    return {
      plans: paymentPlans,
      openFaq: null,
      faqs: [
        { question: 'When do I need to pay?', answer: 'Payment is required upfront before we begin processing your university application(s). We accept various payment methods for your convenience.' },
        { question: 'Can I upgrade my plan later?', answer: "Yes! You can upgrade to a higher plan at any time. You'll only pay the difference between your current plan and the new one." },
        { question: 'What if my application is rejected?', answer: 'If your application is rejected due to our error, we will refund your payment in full. If rejected due to not meeting requirements, we offer a partial refund or a free reapplication to another institution.' },
        { question: 'How long does the application process take?', answer: 'Once we submit your application, the university typically takes 4-8 weeks to respond. We keep you updated throughout the entire process via email and your dashboard.' },
        { question: 'Do you help with student accommodation?', answer: 'Our Premium plan includes accommodation assistance. For Basic and Standard plans, we can recommend accommodation options at an additional fee.' },
        { question: 'Can I pay in installments?', answer: 'We currently offer full upfront payment only. However, our prices are kept affordable to ensure access for all students.' }
      ]
    }
  },
  methods: {
    selectPlan(plan) {
      this.$router.push({ path: '/payment', query: { plan: plan.name, price: plan.price, description: plan.description } })
    },
    toggleFaq(i) {
      this.openFaq = this.openFaq === i ? null : i
    }
  }
}
</script>

<style scoped>
.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin: 48px 0 80px;
  align-items: start;
}

.price-card {
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 32px 28px;
  position: relative;
  transition: var(--transition);
  background: var(--bg);
}

.price-card:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-md);
}

.price-card.featured {
  border-color: var(--accent);
  box-shadow: var(--shadow-lg);
}

.featured-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: white;
  padding: 4px 16px;
  border-radius: var(--radius);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.price-head {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: 24px;
}

.price-head h3 {
  font-size: 1.15rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.price-head p {
  font-size: 0.85rem;
  color: var(--text-light);
  margin-bottom: 18px;
}

.price-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 6px;
}

.price-num {
  font-size: 2.4rem;
  font-weight: 800;
  color: var(--primary-dark);
  letter-spacing: -0.03em;
}

.price-period {
  font-size: 0.85rem;
  color: var(--text-light);
}

.price-features {
  list-style: none;
  margin-bottom: 28px;
}

.price-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  font-size: 0.88rem;
  color: var(--text-secondary);
  border-bottom: 1px solid var(--border-light);
}

.price-features li:last-child {
  border-bottom: none;
}

.price-features svg {
  color: var(--success);
  flex-shrink: 0;
}

.btn-block {
  width: 100%;
  padding: 12px;
}

/* FAQ */
.faq-section {
  margin-bottom: 64px;
}

.section-header-center {
  text-align: center;
  margin-bottom: 36px;
}

.section-eyebrow {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--primary);
  margin-bottom: 6px;
  display: block;
}

.faq-list {
  max-width: 640px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-q {
  width: 100%;
  padding: 18px 0;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text);
  text-align: left;
  font-family: inherit;
}

.faq-q:hover {
  color: var(--primary);
}

.faq-chevron {
  color: var(--text-muted);
  transition: var(--transition);
  flex-shrink: 0;
}

.faq-chevron.open {
  transform: rotate(180deg);
}

.faq-a {
  padding: 0 0 18px;
}

.faq-a p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-light);
}

/* Methods */
.methods-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 28px 32px;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 64px;
  flex-wrap: wrap;
}

.methods-label {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  flex-shrink: 0;
}

.methods-row {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.method-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.method-chip svg {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 380px;
    margin: 48px auto 80px;
  }
  .methods-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

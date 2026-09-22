/**
 * Payment plans used by the PaymentPlan page as a local fallback
 * when the backend is unreachable. Mirrors the seeded database packages.
 * Two plans: Basic (free) and Premium (R500) — Premium unlocks the
 * premium Graduate Jobs section.
 */
export const paymentPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 'Free',
    priceRaw: 0,
    period: 'one-time',
    description: 'Application to one university (free)',
    features: [
      'Application to 1 university',
      'Document verification',
      'Application submission',
      'Status tracking',
      'Email support'
    ],
    highlighted: false
  },
  {
    id: 3,
    name: 'Premium',
    price: 'R 500',
    priceRaw: 500,
    period: 'one-time',
    description: 'Application to up to 5 universities + career guidance',
    features: [
      'Application to up to 5 universities',
      'Document verification & optimization',
      'Application submission',
      'Real-time status tracking',
      'Dedicated advisor',
      'Career guidance session',
      'Job placement assistance after graduation'
    ],
    highlighted: true
  }
]
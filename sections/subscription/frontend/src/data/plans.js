/**
 * Payment plans used by the PaymentPlan page as a local fallback
 * when the backend is unreachable. Mirrors the seeded database packages.
 */
export const paymentPlans = [
  {
    id: 1,
    name: 'Basic',
    price: 'R 150',
    period: 'one-time',
    description: 'Application to one university',
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
    id: 2,
    name: 'Standard',
    price: 'R 380',
    period: 'one-time',
    description: 'Application to up to 3 universities',
    features: [
      'Application to up to 3 universities',
      'Document verification',
      'Application submission',
      'Status tracking',
      'Priority email & phone support',
      'Program matching assistance'
    ],
    highlighted: true
  },
  {
    id: 3,
    name: 'Premium',
    price: 'R 500',
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
    highlighted: false
  }
]
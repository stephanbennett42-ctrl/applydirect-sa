<template>
  <div class="card h-100 shadow-sm">
    <div class="card-body d-flex flex-column justify-content-between">
      <div>
        <!-- Title & Bookmark Star -->
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h5 class="card-title fw-bold mb-0 text-dark">{{ university.name }}</h5>
          <button 
            @click="$emit('toggle-save', university)" 
            class="btn btn-link p-0 text-warning fs-5 border-0 text-decoration-none"
            title="Save Institution"
          >
            {{ isSaved ? '★' : '☆' }}
          </button>
        </div>

        <!-- Type & Province -->
        <p class="text-muted small mb-2">
          {{ university.institution_type }} • {{ university.province }}
        </p>

        <!-- Fee Display -->
        <p class="fw-semibold mb-2">
          Fee: 
          <span v-if="Number(university.application_fee) > 0">
            R{{ Number(university.application_fee).toFixed(2) }}
          </span>
          <span v-else class="text-success fw-bold">Free</span>
        </p>

        <!-- Application Window Dates -->
        <p class="small text-muted mb-3">
          <strong>Window:</strong> {{ formatDate(university.opening_date) }} – {{ formatDate(university.closing_date) }}
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-2 mt-3">
        <!-- View Details -->
        <button 
          @click="$emit('view-details', university)" 
          class="btn btn-sa-primary flex-grow-1"
        >
          View Details
        </button>

        <!-- Locked Premium Button -->
        <button 
          @click="handlePremiumAction" 
          class="btn btn-outline-warning fw-bold text-dark"
        >
          🔒 Remind Me
        </button>
      </div>
    </div>
  </div>

  <!-- Premium Notice Modal -->
  <div v-if="showPremiumModal" class="modal-backdrop show d-flex justify-content-center align-items-center" style="background: rgba(0,0,0,0.5); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1050;">
    <div class="card p-4 shadow bg-white text-center" style="max-width: 380px; width: 100%;">
      <div class="fs-1 mb-2">⭐</div>
      <h5 class="fw-bold mb-3 text-dark">Premium Feature</h5>
      <p class="text-muted small mb-4">This is for premium users only. Unlock instant reminders, fast-track applications, and exclusive concierge features!</p>
      <div class="d-flex flex-column gap-2">
        <button @click="redirectToSubscription" class="btn btn-warning fw-bold text-dark py-2">
          Go to Subscription Page
        </button>
        <button @click="showPremiumModal = false" class="btn btn-light text-muted py-1">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UniversityCard',
  props: {
    university: {
      type: Object,
      required: true
    },
    isSaved: {
      type: Boolean,
      default: false
    }
  },
  emits: ['view-details', 'toggle-save'],
  data() {
    return {
      showPremiumModal: false
    };
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Dates TBA';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    handlePremiumAction() {
      // Always trigger the premium modal when clicked
      this.showPremiumModal = true;
    },
    redirectToSubscription() {
      this.showPremiumModal = false;
      
      // Option A: If you have a router path named 'subscription' or 'pricing'
      this.$router.push('/subscription').catch(() => {
        // Option B: Fallback alert if route isn't built yet
        alert('Redirecting to the ApplyDirect-SA Subscription & Pricing Portal...');
      });
    }
  }
}
</script>
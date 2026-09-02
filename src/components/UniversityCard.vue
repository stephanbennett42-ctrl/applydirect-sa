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
        <p class="fw-semibold mb-3">
          Fee: 
          <span v-if="Number(university.application_fee) > 0">
            R{{ Number(university.application_fee).toFixed(2) }}
          </span>
          <span v-else class="text-success fw-bold">Free</span>
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="d-flex gap-2 mt-3">
        <!-- View Details (Triggers Modal in Parent) -->
        <button 
          @click="$emit('view-details', university)" 
          class="btn btn-sa-primary flex-grow-1"
        >
          View Details
        </button>

        <!-- Direct Portal Link -->
        <a 
          :href="university.application_url || university.website_url" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-sa-green"
        >
          Apply Now
        </a>
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
  emits: ['view-details', 'toggle-save']
}
</script>
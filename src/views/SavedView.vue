<template>
  <div class="container py-4">
    <h2 class="fw-bold text-primary mb-4">Saved Institutions</h2>

    <div v-if="savedInstitutions.length === 0" class="alert alert-secondary text-center py-4">
      You haven't saved any institutions yet. Star an institution on the browse page to keep track of it here.
    </div>

    <div v-else class="row g-4">
      <div 
        v-for="institution in savedInstitutions" 
        :key="institution.institution_id" 
        class="col-12 col-md-6 col-lg-4"
      >
        <UniversityCard 
          :university="institution"
          :is-saved="true"
          @toggle-save="removeSaved"
        />
      </div>
    </div>
  </div>
</template>

<script>
import UniversityCard from '@/components/UniversityCard.vue'

export default {
  name: 'SavedView',
  components: { UniversityCard },
  data() {
    return {
      allInstitutions: [],
      savedIds: []
    }
  },
  computed: {
    savedInstitutions() {
      return this.allInstitutions.filter(item => 
        this.savedIds.includes(item.institution_id)
      );
    }
  },
  mounted() {
    const saved = localStorage.getItem('saved_institutions');
    if (saved) {
      this.savedIds = JSON.parse(saved);
    }
    this.fetchInstitutions();
  },
  methods: {
    async fetchInstitutions() {
      try {
        const res = await fetch('http://localhost:3000/api/institutions');
        const data = await res.json();
        if (data.success) {
          this.allInstitutions = data.data;
        }
      } catch (err) {
        console.error('Failed to load institutions:', err);
      }
    },
    removeSaved(institution) {
      const id = institution.institution_id;
      this.savedIds = this.savedIds.filter(savedId => savedId !== id);
      localStorage.setItem('saved_institutions', JSON.stringify(this.savedIds));
    }
  }
}
</script>
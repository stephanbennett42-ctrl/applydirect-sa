<template>
  <div class="about-page bg-navy text-white min-vh-100 pb-5">
    <!-- HERO SECTION -->
    <div class="container text-center pt-5 pb-4">
      <span class="badge bg-gold text-dark fw-bold px-3 py-2 rounded-pill text-uppercase fs-8 mb-3">
        🇿🇦 Empowering South African Students
      </span>
      <h1 class="display-4 fw-bold text-white mb-3">About ApplyDirect-SA</h1>
      <p class="lead text-light opacity-90 mx-auto max-w-2xl fs-6 fs-md-5">
        Bridging the gap between high school matriculants and South African tertiary institutions by providing a centralized, streamlined application path.
      </p>

      <!-- UPDATED STATS CARDS (34 TOTAL INSTITUTIONS) -->
      <div class="row g-3 g-md-4 mt-4 max-w-4xl mx-auto">
        <!-- UNIVERSITIES -->
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 p-md-4 rounded-4 bg-glass border border-light-subtle h-100 d-flex flex-column justify-content-center">
            <h2 class="display-5 fw-bold text-gold mb-1">{{ universityCount }}</h2>
            <p class="text-uppercase tracking-wider fs-8 text-light opacity-75 mb-0 fw-semibold">
              Universities
            </p>
          </div>
        </div>

        <!-- TVET COLLEGES -->
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 p-md-4 rounded-4 bg-glass border border-light-subtle h-100 d-flex flex-column justify-content-center">
            <h2 class="display-5 fw-bold text-gold mb-1">{{ tvetCount }}</h2>
            <p class="text-uppercase tracking-wider fs-8 text-light opacity-75 mb-0 fw-semibold">
              TVET Colleges
            </p>
          </div>
        </div>

        <!-- PROVINCES -->
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 p-md-4 rounded-4 bg-glass border border-light-subtle h-100 d-flex flex-column justify-content-center">
            <h2 class="display-5 fw-bold text-gold mb-1">9</h2>
            <p class="text-uppercase tracking-wider fs-8 text-light opacity-75 mb-0 fw-semibold">
              Provinces
            </p>
          </div>
        </div>

        <!-- REPLACED: FREE DIRECT ACCESS -->
        <div class="col-6 col-md-3">
          <div class="stat-card p-3 p-md-4 rounded-4 bg-glass border border-light-subtle h-100 d-flex flex-column justify-content-center">
            <h2 class="display-5 fw-bold text-gold mb-1">FREE</h2>
            <p class="text-uppercase tracking-wider fs-8 text-light opacity-75 mb-0 fw-semibold">
              DIRECT ACCESS
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- MISSION & FEATURES SECTION -->
    <div class="container mt-5">
      <div class="bg-white text-dark rounded-4 p-4 p-md-5 shadow-lg">
        <div class="row g-4 align-items-center">
          <div class="col-12 col-lg-6">
            <h2 class="fw-bold text-navy mb-3">Our Mission</h2>
            <p class="text-secondary fs-6 mb-3">
              Navigating tertiary admissions in South Africa can be confusing with fragmented portals, varying application fees, and strict closing deadlines.
            </p>
            <p class="text-secondary fs-6 mb-0">
              <strong>ApplyDirect-SA</strong> simplifies this journey. We consolidate public universities and TVET colleges into a single accessible portal where students can search, track application deadlines, and apply directly to official institution portals without middleman markups.
            </p>
          </div>

          <div class="col-12 col-lg-6">
            <div class="p-4 rounded-4 bg-light border-start border-4 border-primary">
              <h5 class="fw-bold text-navy mb-3">Why Choose ApplyDirect-SA?</h5>
              <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
                <li class="d-flex align-items-start gap-2">
                  <i class="bi bi-check-circle-fill text-success fs-5 mt-n1"></i>
                  <span><strong>Direct Official Links:</strong> No extra fees or hidden application redirects.</span>
                </li>
                <li class="d-flex align-items-start gap-2">
                  <i class="bi bi-check-circle-fill text-success fs-5 mt-n1"></i>
                  <span><strong>Comprehensive Filtering:</strong> Filter tertiary options by province, institution type, or application fee.</span>
                </li>
                <li class="d-flex align-items-start gap-2">
                  <i class="bi bi-check-circle-fill text-success fs-5 mt-n1"></i>
                  <span><strong>Deadline Tracking:</strong> Real-time opening and closing dates for application cycles.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      universityCount: 26,
      tvetCount: 8
    }
  },
  methods: {
    async fetchInstitutionStats() {
      try {
        const response = await fetch('/api/institutions');
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const unis = result.data.filter(item => {
            const type = (item.institution_type || '').toLowerCase();
            return type.includes('university');
          });

          const tvets = result.data.filter(item => {
            const type = (item.institution_type || '').toLowerCase();
            return type.includes('tvet') || type.includes('college');
          });

          if (result.data.length > 0) {
            this.universityCount = unis.length || 26;
            this.tvetCount = tvets.length || 8;
          }
        }
      } catch (error) {
        console.warn('Using default institution count stats:', error);
      }
    }
  },
  mounted() {
    this.fetchInstitutionStats();
  }
}
</script>

<style scoped>
.bg-navy {
  background-color: #001242 !important;
}

.text-navy {
  color: #001242 !important;
}

.text-gold {
  color: #ffb81c !important;
}

.bg-gold {
  background-color: #ffb81c !important;
}

.bg-glass {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(10px);
}

.max-w-2xl {
  max-width: 700px;
}

.max-w-4xl {
  max-width: 900px;
}

.tracking-wider {
  letter-spacing: 0.08em;
}

.fs-8 {
  font-size: 0.75rem;
}

.stat-card {
  transition: transform 0.25s ease, border-color 0.25s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 184, 28, 0.5) !important;
}
</style>
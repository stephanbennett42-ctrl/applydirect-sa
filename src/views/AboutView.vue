<template>
  <div class="about-page">
    <!-- =================================================================== -->
    <!-- HERO SECTION                                                        -->
    <!-- =================================================================== -->
    <section class="hero-section text-white py-5 mb-5 position-relative">
      <div class="container z-1 px-3 text-center">
        <span class="badge bg-gold text-dark fw-bold mb-3 px-3 py-2 rounded-pill shadow-sm">
          🇿🇦 Empowring South African Students
        </span>
        <h1 class="display-4 fw-bold mb-3">About ApplyDirect-SA</h1>
        <p class="lead mx-auto opacity-90 mb-4 px-2" style="max-width: 700px;">
          Bridging the gap between high school matriculants and South African tertiary institutions by providing a centralized, streamlined application path.
        </p>

        <!-- STATS HIGHLIGHT -->
        <div class="row justify-content-center g-3 mt-4">
          <div class="col-6 col-md-3" v-for="(stat, index) in stats" :key="index">
            <div class="p-3 glass-card rounded-3">
              <h3 class="fw-bold text-gold mb-0">{{ stat.value }}</h3>
              <small class="text-uppercase tracking-wider opacity-75">{{ stat.label }}</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =================================================================== -->
    <!-- MISSION & VISION SECTION                                           -->
    <!-- =================================================================== -->
    <main class="container px-3 pb-5">
      <div class="row align-items-center g-4 mb-5">
        <div class="col-12 col-lg-6">
          <h2 class="fw-bold text-primary mb-3">Our Mission</h2>
          <p class="text-secondary lead fs-6">
            Navigating tertiary admissions in South Africa can be confusing with fragmented portals, varying application fees, and strict closing deadlines.
          </p>
          <p class="text-secondary">
            ApplyDirect-SA simplifies this journey. We consolidate public universities, TVET colleges, and accredited private institutions into a single accessible portal where students can search, track application deadlines, and apply directly to official institution portals without middleman delays.
          </p>
        </div>
        <div class="col-12 col-lg-6">
          <div class="card border-0 shadow-sm p-4 bg-light rounded-4">
            <h4 class="fw-bold text-dark mb-3">Why Choose ApplyDirect-SA?</h4>
            <ul class="list-unstyled mb-0 d-flex flex-column gap-3">
              <li class="d-flex align-items-start gap-2">
                <span class="text-success fw-bold">✓</span>
                <span><strong>Direct Official Links:</strong> No extra fees or hidden application redirects.</span>
              </li>
              <li class="d-flex align-items-start gap-2">
                <span class="text-success fw-bold">✓</span>
                <span><strong>Comprehensive Filtering:</strong> Filter tertiary options by province, institution type, or application fee.</span>
              </li>
              <li class="d-flex align-items-start gap-2">
                <span class="text-success fw-bold">✓</span>
                <span><strong>Deadline Tracking:</strong> Real-time opening and closing dates for application cycles.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- =================================================================== -->
      <!-- DEVELOPER & TEAM SECTION                                            -->
      <!-- =================================================================== -->
      <section class="my-5 text-center">
        <h2 class="fw-bold text-primary mb-2">Built for South African Youth</h2>
        <p class="text-muted mb-5">Designed and built with modern full-stack web technologies</p>

        <div class="row justify-content-center">
          <div class="col-12 col-md-8 col-lg-6">
            <div class="card border-0 shadow-sm p-4 rounded-4 text-center">
              <div class="avatar-placeholder rounded-circle bg-primary text-white fw-bold d-flex align-items-center justify-content-center mx-auto mb-3" style="width: 80px; height: 80px; font-size: 1.8rem;">
                SA
              </div>
              <h4 class="fw-bold mb-1">ApplyDirect SA Team</h4>
              <p class="text-muted small mb-3">Vue.js • Express.js • MySQL</p>
              <p class="card-text text-secondary">
                Developed as a collaborative project to simplify higher education access across all 9 provinces in South Africa.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'AboutView',
  data() {
    return {
      stats: [
        { value: '26+', label: 'Universities' },
        { value: '50+', label: 'TVET Colleges' },
        { value: '9', label: 'Provinces' },
        { value: '100%', label: 'Free Access' }
      ]
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #002395 0%, #001254 100%);
  border-bottom: 5px solid var(--sa-gold, #ffb81c);
}

.bg-gold {
  background-color: var(--sa-gold, #ffb81c);
}

.text-gold {
  color: var(--sa-gold, #ffb81c);
}

.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tracking-wider {
  letter-spacing: 0.05em;
}
</style>
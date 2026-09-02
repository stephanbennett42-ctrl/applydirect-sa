<template>
  <div class="landing-page">
    <!-- HERO CAROUSEL SECTION -->
    <section 
      class="hero-section text-white py-4 py-md-5 mb-4 mb-md-5 position-relative"
      :class="currentSlide.themeClass"
    >
      <div class="container z-1 px-3">
        <div class="hero-carousel text-center py-2">
          <transition name="fade" mode="out-in">
            <div :key="currentSlideIndex" class="slide-content">
              <span :class="['badge fw-bold mb-2 mb-md-3 px-3 py-2 rounded-pill shadow-sm small', currentSlide.badgeClass]">
                {{ currentSlide.badge }}
              </span>
              <h1 class="hero-title fw-bold mb-2 mb-md-3">
                {{ currentSlide.title }}
              </h1>
              <p class="hero-desc lead mx-auto opacity-90 mb-3 mb-md-4 px-2">
                {{ currentSlide.description }}
              </p>
              
              <button 
                @click="handleSlideAction(currentSlide.action)" 
                :class="['btn px-4 py-2 shadow-sm fw-bold', currentSlide.btnClass]"
              >
                {{ currentSlide.buttonText }}
              </button>
            </div>
          </transition>

          <div class="carousel-dots d-flex justify-content-center gap-2 mt-4">
            <button 
              v-for="(slide, index) in slides" 
              :key="index"
              @click="setSlide(index)"
              :class="['dot-btn', { active: index === currentSlideIndex }]"
              :aria-label="'Go to slide ' + (index + 1)"
            ></button>
          </div>
        </div>

        <!-- QUICK STATS COUNTER -->
        <div class="row justify-content-center g-2 g-md-3 mt-3 mt-md-4 text-center">
          <div class="col-4 col-md-3">
            <div class="p-2 p-md-3 glass-card rounded-3">
              <h4 class="fw-bold text-gold mb-0 fs-3-mobile">{{ institutions.length }}</h4>
              <small class="text-uppercase tracking-wider stat-label">Institutions</small>
            </div>
          </div>
          <div class="col-4 col-md-3">
            <div class="p-2 p-md-3 glass-card rounded-3">
              <h4 class="fw-bold text-light mb-0 fs-3-mobile">{{ openCount }}</h4>
              <small class="text-uppercase tracking-wider stat-label">Applications Open</small>
            </div>
          </div>
          <div class="col-4 col-md-3">
            <div class="p-2 p-md-3 glass-card rounded-3">
              <h4 class="fw-bold text-gold mb-0 fs-3-mobile">{{ availableProvinces.length }}</h4>
              <small class="text-uppercase tracking-wider stat-label">Provinces</small>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MAIN CONTENT AREA -->
    <main class="container px-3 pb-5">
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h2 class="fw-bold text-primary mb-1 h3-mobile">Explore Institutions</h2>
          <p class="text-muted mb-0 small">Filter and apply directly to official portals</p>
        </div>

        <div class="btn-group shadow-sm w-100-mobile" role="group">
          <button 
            @click="activeSubTab = 'all'" 
            :class="['btn btn-sm py-2', activeSubTab === 'all' ? 'btn-sa-primary' : 'btn-outline-secondary']"
          >
            All Institutions ({{ filteredInstitutions.length }})
          </button>
          <button 
            @click="activeSubTab = 'saved'" 
            :class="['btn btn-sm py-2', activeSubTab === 'saved' ? 'btn-sa-primary' : 'btn-outline-secondary']"
          >
            ★ Saved ({{ savedIds.length }})
          </button>
        </div>
      </div>

      <!-- FILTER CONTROLS -->
      <div class="card bg-white p-3 shadow-sm filter-container mb-4">
        <div class="row g-2">
          <div class="col-12 col-md-5">
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Search by institution name or type..."
            />
          </div>

          <div class="col-6 col-md-3">
            <select v-model="selectedProvince" class="form-select">
              <option value="">All Provinces</option>
              <option 
                v-for="province in availableProvinces" 
                :key="province" 
                :value="province"
              >
                {{ province }}
              </option>
            </select>
          </div>

          <div class="col-6 col-md-2">
            <select v-model="selectedStatus" class="form-select">
              <option value="">All Statuses</option>
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div class="col-12 col-md-2">
            <button @click="resetFilters" class="btn btn-outline-secondary w-100">
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- LOADING & CONTENT GRID -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading institutions...</span>
        </div>
      </div>

      <div v-else-if="displayedInstitutions.length === 0" class="alert alert-info text-center py-4">
        No institutions found matching your criteria.
      </div>

      <div v-else class="row g-3 g-md-4">
        <div 
          v-for="(institution, index) in displayedInstitutions" 
          :key="institution.institution_id" 
          class="col-12 col-md-6 col-lg-4 scroll-card"
          :style="{ animationDelay: (index * 0.1) + 's' }"
        >
          <UniversityCard 
            :university="institution"
            :is-saved="savedIds.includes(institution.institution_id)"
            @view-details="handleViewDetails"
            @toggle-save="handleToggleSave"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import UniversityCard from '@/components/UniversityCard.vue'

export default {
  name: 'InstitutionsView',
  components: { 
    UniversityCard 
  },
  
  data() {
    return {
      institutions: [],
      searchQuery: '',
      selectedProvince: '',
      selectedStatus: '',
      savedIds: [],
      activeSubTab: 'all',
      loading: true,
      
      currentSlideIndex: 0,
      autoSlideTimer: null,
      slides: [
        {
          badge: '🇿🇦 South Africa\'s Central Tertiary Hub',
          title: 'Apply Directly to SA Universities & Colleges',
          description: 'Discover tertiary institutions across South Africa, track application status deadlines, and navigate straight to official registration portals.',
          buttonText: 'Browse All Institutions',
          action: 'all',
          themeClass: 'theme-blue',
          badgeClass: 'bg-gold text-dark',
          btnClass: 'btn-sa-green'
        },
        {
          badge: '⏳ Approaching Deadlines',
          title: 'Applications Closing Soon',
          description: 'Don\'t miss out on securing your spot at top South African institutions. Filter now to view open application portals.',
          buttonText: 'Filter Open Applications',
          action: 'open',
          themeClass: 'theme-green',
          badgeClass: 'bg-warning text-dark',
          btnClass: 'btn-light text-success'
        },
        {
          badge: '💡 Zero Application Fee Options',
          title: 'Apply to TVET Colleges & Free Campuses',
          description: 'Explore public TVET colleges and private institutions with R0 application fees to maximize your study choices.',
          buttonText: 'Find Free Applications',
          action: 'free',
          themeClass: 'theme-red',
          badgeClass: 'bg-gold text-dark',
          btnClass: 'btn-light text-danger fw-bold'
        }
      ]
    }
  },

  computed: {
    availableProvinces() {
      const provinces = this.institutions
        .map(item => (item.province || item.province_name || '').trim())
        .filter(Boolean);
        
      return [...new Set(provinces)].sort();
    },

    currentSlide() {
      return this.slides[this.currentSlideIndex];
    },

    filteredInstitutions() {
      return this.institutions.filter(item => {
        const name = (item.name || '').toLowerCase();
        const type = (item.institution_type || item.type || '').toLowerCase();
        const query = this.searchQuery.toLowerCase().trim();
        
        const matchesQuery = name.includes(query) || type.includes(query);
        
        const itemProvince = (item.province || item.province_name || '').trim().toLowerCase();
        const selectedProv = this.selectedProvince.trim().toLowerCase();
        const matchesProvince = !selectedProv || itemProvince === selectedProv;
          
        const matchesStatus = !this.selectedStatus || item.application_status === this.selectedStatus;
        
        return matchesQuery && matchesProvince && matchesStatus;
      });
    },

    displayedInstitutions() {
      if (this.activeSubTab === 'saved') {
        return this.filteredInstitutions.filter(item => this.savedIds.includes(item.institution_id));
      }
      return this.filteredInstitutions;
    },

    openCount() {
      return this.institutions.filter(i => i.application_status === 'Open').length;
    }
  },

  mounted() {
    this.fetchInstitutions();
    this.loadSavedInstitutions();
    this.startAutoSlide();
  },
  
  beforeUnmount() {
    this.stopAutoSlide();
  },

  updated() {
    this.$nextTick(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-drop');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.scroll-card').forEach(card => observer.observe(card));
    });
  },

  methods: {
    startAutoSlide() {
      this.autoSlideTimer = setInterval(() => {
        this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
      }, 4000);
    },
    stopAutoSlide() {
      if (this.autoSlideTimer) {
        clearInterval(this.autoSlideTimer);
      }
    },
    setSlide(index) {
      this.currentSlideIndex = index;
      this.stopAutoSlide();
      this.startAutoSlide();
    },
    handleSlideAction(action) {
      if (action === 'open') {
        this.selectedStatus = 'Open';
      } else if (action === 'free') {
        this.searchQuery = 'TVET';
      } else {
        this.resetFilters();
      }
      const filterElem = document.querySelector('.filter-container');
      if (filterElem) {
        filterElem.scrollIntoView({ behavior: 'smooth' });
      }
    },

    async fetchInstitutions() {
      this.loading = true;
      try {
        // Vite env check fallback to local port 3000
        const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) 
          ? import.meta.env.VITE_API_URL 
          : 'http://localhost:3000';

        const response = await fetch(`${apiBase}/api/institutions`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        
        if (result.success && Array.isArray(result.data)) {
          this.institutions = result.data;
        } else if (Array.isArray(result)) {
          this.institutions = result;
        } else {
          this.institutions = result.data || [];
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
        this.institutions = [];
      } finally {
        this.loading = false;
      }
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedProvince = '';
      this.selectedStatus = '';
    },
    handleViewDetails(institution) {
      console.log('Viewing details for:', institution);
    },
    handleToggleSave(institution) {
      const id = institution.institution_id;
      const index = this.savedIds.indexOf(id);
      if (index > -1) {
        this.savedIds.splice(index, 1);
      } else {
        this.savedIds.push(id);
      }
      localStorage.setItem('saved_institutions', JSON.stringify(this.savedIds));
    },
    loadSavedInstitutions() {
      const saved = localStorage.getItem('saved_institutions');
      if (saved) {
        this.savedIds = JSON.parse(saved);
      }
    }
  }
}
</script>

<style scoped>
.hero-section {
  transition: background 0.6s ease, border-color 0.6s ease;
}

.theme-blue {
  background: linear-gradient(135deg, #002395 0%, #001254 100%);
  border-bottom: 5px solid var(--sa-gold);
}

.theme-green {
  background: linear-gradient(135deg, #007a4d 0%, #023823 100%);
  border-bottom: 5px solid #007a4d;
}

.theme-red {
  background: linear-gradient(135deg, #e03c32 0%, #5c0b06 100%);
  border-bottom: 5px solid #e03c32;
}

.bg-gold {
  background-color: var(--sa-gold);
}

.text-gold {
  color: var(--sa-gold);
}

.glass-card {
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  line-height: 1.2;
}

.hero-desc {
  max-width: 680px;
  font-size: clamp(0.95rem, 2vw, 1.2rem);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dot-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  background-color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  padding: 0;
}

.dot-btn.active {
  background-color: var(--sa-gold);
  transform: scale(1.3);
  width: 24px;
  border-radius: 6px;
}

@media (max-width: 576px) {
  .stat-label {
    font-size: 0.65rem;
  }
  .fs-3-mobile {
    font-size: 1.25rem;
  }
  .h3-mobile {
    font-size: 1.35rem;
  }
  .w-100-mobile {
    width: 100%;
    display: flex;
  }
  .w-100-mobile .btn {
    flex: 1;
  }
}

.scroll-card {
  opacity: 0;
  will-change: transform, opacity;
}

.scroll-card.animate-drop {
  animation: dropDown 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
}

@keyframes dropDown {
  0% {
    opacity: 0;
    transform: translateY(-40px) scale(0.95);
  }
  60% {
    opacity: 1;
    transform: translateY(8px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
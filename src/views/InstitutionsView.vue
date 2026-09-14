<template>
  <div class="uni-scroll-container" ref="scrollContainer">
    <!-- FLOATING NEARBY LOCATION BUTTON (Mobile-friendly FAB) -->
    <div class="floating-geo-btn position-fixed end-0 z-3">
      <button 
        @click="getUserLocation" 
        class="btn btn-gold rounded-pill px-3 py-2 px-md-4 fw-bold shadow-lg d-flex align-items-center gap-2 hover-lift"
        :disabled="isLocating"
      >
        <i class="bi bi-geo-alt-fill text-dark fs-5"></i>
        <span class="d-none d-sm-inline">{{ isLocating ? 'Finding Location...' : (userLat ? 'Updated Nearby' : 'Find Near Me') }}</span>
        <span class="d-inline d-sm-none">{{ isLocating ? '...' : 'Near Me' }}</span>
      </button>
    </div>

    <!-- 1. SEARCHING RADAR OVERLAY -->
    <Transition name="overlay-fade">
      <div 
        v-if="isLocating" 
        class="position-fixed top-0 start-0 w-100 h-100 bg-radar-overlay d-flex flex-column align-items-center justify-content-center text-white text-center p-3 z-radar"
      >
        <div class="radar-box mb-4">
          <div class="radar-wave"></div>
          <div class="radar-wave delay-1"></div>
          <div class="radar-wave delay-2"></div>
          <i class="bi bi-geo-alt-fill text-gold fs-1 icon-pulse"></i>
        </div>
        <h3 class="fw-bold text-gold mb-2 fs-4 fs-md-3">Calculating Proximity...</h3>
        <p class="text-light opacity-75 fs-6 fs-md-5">Finding campuses closest to your live location</p>
      </div>
    </Transition>

    <!-- NO RESULTS NOTICE -->
    <Transition name="card-fade">
      <div v-if="filteredInstitutions.length === 0" class="fullscreen-card d-flex align-items-center justify-content-center text-white bg-navy p-3">
        <div class="text-center pt-5">
          <i class="bi bi-search fs-1 text-gold mb-3 d-block"></i>
          <h3>No institutions found</h3>
          <p class="text-light">Try adjusting your search query or filters.</p>
          <button @click="resetFilters" class="btn btn-gold rounded-pill px-4 fw-bold">Reset Filters</button>
        </div>
      </div>
    </Transition>

    <!-- 2. CARDS CONTAINER WITH SPRING POP-IN -->
    <TransitionGroup name="card-fade">
      <div 
        v-for="(uni, index) in filteredInstitutions" 
        :key="uni.id"
        class="fullscreen-card position-relative overflow-hidden d-flex align-items-center justify-content-center text-white p-3 p-md-5"
        :ref="el => setCardRef(el, index)"
      >
        <!-- CAMPUS BACKGROUND IMAGE WITH OVERLAY -->
        <div class="position-absolute top-0 start-0 w-100 h-100 overflow-hidden">
          <img 
            :src="uni.image" 
            :alt="uni.name"
            @error="handleImageError($event, index)"
            class="card-bg-img position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          />
          <div 
            class="card-overlay position-absolute top-0 start-0 w-100 h-100"
            :style="{ background: `linear-gradient(180deg, rgba(${uni.themeColor}, 0.7) 0%, rgba(${uni.themeColor}, 0.95) 100%)` }"
          ></div>
        </div>

        <!-- CARD HERO CONTENT -->
        <div class="card-content text-center z-1 w-100 max-w-lg">
          <!-- INSTITUTION TYPE BADGE & DISTANCE BADGE -->
          <div class="d-flex justify-content-center gap-2 mb-2 mb-md-3 flex-wrap">
            <span class="badge bg-gold text-dark fw-bold px-3 py-2 rounded-pill text-uppercase fs-8 fs-md-7">
              {{ uni.type }}
            </span>
            <span v-if="uni.distanceKm" class="badge bg-light text-dark fw-bold px-3 py-2 rounded-pill fs-8 fs-md-7 shadow-sm distance-pop-badge">
              <i class="bi bi-pin-map-fill text-danger me-1"></i> {{ uni.distanceKm }} km away
            </span>
          </div>

          <!-- RESPONSIVE HEADING -->
          <h1 class="responsive-heading fw-bold mb-2">{{ uni.name }}</h1>
          
          <p class="fs-6 fs-md-4 text-light opacity-90 mb-3">
            <i class="bi bi-geo-alt-fill text-gold me-1"></i> {{ uni.location }}, {{ uni.province }}
          </p>

          <!-- APPLICATION WINDOW & STATUS SECTION -->
          <div class="row g-3 my-2 text-start">
            <!-- Key Faculties -->
            <div class="col-12 col-md-6">
              <div class="p-3 rounded bg-navy-card h-100">
                <h6 class="text-gold fw-bold mb-2">Key Faculties</h6>
                <p class="small text-light mb-0">
                  {{ uni.facultiesRaw || 'Consult official prospectus for full list.' }}
                </p>
              </div>
            </div>

            <!-- Application Fee -->
            <div class="col-12 col-md-6">
              <div class="p-3 rounded bg-navy-card h-100">
                <h6 class="text-gold fw-bold mb-1">Application Fee</h6>
                <p class="fs-5 fw-bold text-white mb-0">
                  {{ uni.applicationFee }}
                </p>
              </div>
            </div>

            <!-- Application Window -->
            <div class="col-12 col-md-6">
              <div class="p-3 rounded bg-navy-card h-100">
                <h6 class="text-gold fw-bold mb-2">Application Window</h6>
                <p class="small mb-1 text-light">
                  <strong>Opens:</strong> {{ formatDate(uni.opening_date) }}
                </p>
                <p class="small mb-0 text-light">
                  <strong>Closes:</strong> {{ formatDate(uni.closing_date) }}
                </p>
              </div>
            </div>

            <!-- Dynamic Status -->
            <div class="col-12 col-md-6">
              <div class="p-3 rounded bg-navy-card h-100 d-flex flex-column justify-content-between">
                <h6 class="text-gold fw-bold mb-1">Status</h6>
                <div>
                  <span :class="getStatusBadgeClass(uni)">
                    {{ getApplicationStatus(uni) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center gap-2 gap-sm-3 max-btn-width mx-auto mt-3">
            <button 
              @click="openDetails(uni)" 
              class="btn btn-outline-light btn-md btn-md-lg px-4 py-2 rounded-pill fw-bold hover-lift"
            >
              <i class="bi bi-info-circle me-1"></i> View Details
            </button>
            
            <a 
              :href="uni.applicationUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="btn btn-gold btn-md btn-md-lg px-4 py-2 rounded-pill hover-lift text-dark fw-bold d-flex align-items-center justify-content-center"
              :class="{ disabled: !uni.applicationUrl || uni.applicationUrl === '#' }"
            >
              Apply Portal <i class="bi bi-box-arrow-up-right ms-1"></i>
            </a>
          </div>
        </div>

        <!-- SCROLL INDICATOR -->
        <div class="scroll-hint position-absolute bottom-0 start-50 translate-middle-x mb-2 mb-md-4 text-center text-light opacity-75">
          <small class="d-block mb-1 fs-8">Scroll to next</small>
          <i class="bi bi-chevron-down fs-5 bounce"></i>
        </div>
      </div>
    </TransitionGroup>

    <!-- FULL DETAILS MODAL -->
    <div 
      v-if="selectedUni" 
      class="modal fade show d-block backdrop-blur modal-overlay" 
      tabindex="-1" 
      @click.self="closeDetails"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable p-2 p-sm-0">
        <div class="modal-content bg-dark text-white border-gold shadow-lg">
          <div class="modal-header border-bottom border-secondary">
            <div>
              <h5 class="modal-title fw-bold mb-0 fs-6 fs-md-4">{{ selectedUni.name }}</h5>
              <small class="text-gold fs-7">
                {{ selectedUni.location }} • {{ selectedUni.province }}
                <span v-if="selectedUni.distanceKm"> • {{ selectedUni.distanceKm }} km away</span>
              </small>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="closeDetails"></button>
          </div>

          <div class="modal-body py-3 py-md-4">
            <h6 class="fw-bold text-gold mb-2">Overview</h6>
            <p class="text-light fs-7 fs-md-6 mb-4">{{ selectedUni.description }}</p>

            <div class="row g-2 g-md-3 mb-4">
              <div class="col-12 col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary h-100">
                  <h6 class="fw-bold text-gold mb-1 fs-7 fs-md-6"><i class="bi bi-book me-2"></i>Key Faculties</h6>
                  <ul class="mb-0 ps-3 small text-light">
                    <li v-for="(faculty, i) in selectedUni.faculties" :key="i">{{ faculty }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary h-100">
                  <h6 class="fw-bold text-gold mb-1 fs-7 fs-md-6"><i class="bi bi-cash-stack me-2"></i>Application Fee</h6>
                  <p class="mb-0 fs-6 fw-semibold text-white">{{ selectedUni.applicationFee }}</p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary h-100">
                  <h6 class="fw-bold text-gold mb-1 fs-7 fs-md-6"><i class="bi bi-calendar-event me-2"></i>Application Window</h6>
                  <p class="mb-0 small text-light">
                    <strong>Opens:</strong> {{ selectedUni.openingDate }}<br>
                    <strong>Closes:</strong> {{ selectedUni.closingDate }}
                  </p>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary h-100">
                  <h6 class="fw-bold text-gold mb-1 fs-7 fs-md-6"><i class="bi bi-patch-check me-2"></i>Status</h6>
                  <span :class="getStatusBadgeClass(selectedUni)">
                    {{ getApplicationStatus(selectedUni) }}
                  </span>
                </div>
              </div>
            </div>

            <h6 class="fw-bold text-gold mb-2">General Requirements</h6>
            <p class="small text-light mb-0 fs-7">{{ selectedUni.requirements }}</p>
          </div>

          <div class="modal-footer border-top border-secondary flex-column flex-sm-row justify-content-between gap-2">
            <button type="button" class="btn btn-outline-light rounded-pill px-4 w-100 w-sm-auto" @click="closeDetails">Close</button>
            <a :href="selectedUni.applicationUrl" target="_blank" rel="noopener noreferrer" class="btn btn-gold text-dark fw-bold rounded-pill px-4 w-100 w-sm-auto text-center">
              Apply Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstitutionsView',
  props: {
    searchFilter: {
      type: Object,
      default: () => ({ searchQuery: '', selectedProvince: '', selectedType: '' })
    }
  },
  data() {
    return {
      cardRefs: [],
      selectedUni: null,
      searchQuery: '',
      selectedProvince: '',
      selectedType: '',
      institutions: [],
      userLat: null,
      userLng: null,
      isLocating: false,
      fallbackPhotos: [
        'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1600&q=80'
      ]
    }
  },
  computed: {
    filteredInstitutions() {
      const query = (this.searchFilter?.searchQuery || this.searchQuery || '').trim().toLowerCase();
      const province = (this.searchFilter?.selectedProvince || this.selectedProvince || '').trim().toLowerCase();
      const type = (this.searchFilter?.selectedType || this.selectedType || '').trim().toLowerCase();

      let list = this.institutions.filter(uni => {
        const uniName = (uni.name || '').toLowerCase();
        const uniProvince = (uni.province || '').toLowerCase();
        const uniType = (uni.type || uni.institution_type || '').toLowerCase();

        const matchesSearch = !query || 
          uniName.includes(query) ||
          uniProvince.includes(query) ||
          uniType.includes(query);

        const matchesProvince = !province || uniProvince === province;

        const matchesType = !type || 
          uniType === type || 
          uniType.includes(type) || 
          type.includes(uniType);

        return matchesSearch && matchesProvince && matchesType;
      });

      if (this.userLat && this.userLng) {
        list = list.slice().sort((a, b) => {
          if (!a.distanceKm) return 1;
          if (!b.distanceKm) return -1;
          return parseFloat(a.distanceKm) - parseFloat(b.distanceKm);
        });
      }

      return list;
    }
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Dates TBA';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    getApplicationStatus(institution) {
      if (!institution || !institution.opening_date || !institution.closing_date) return 'Check Portal';
      
      const today = new Date();
      const openDate = new Date(institution.opening_date);
      const closeDate = new Date(institution.closing_date);

      if (today < openDate) return 'Opening Soon';
      if (today >= openDate && today <= closeDate) return 'Open Now';
      return 'Closed';
    },

    getStatusBadgeClass(institution) {
      const status = this.getApplicationStatus(institution);
      if (status === 'Open Now') return 'badge bg-success px-3 py-2 fs-7';
      if (status === 'Opening Soon') return 'badge bg-warning text-dark px-3 py-2 fs-7';
      return 'badge bg-danger px-3 py-2 fs-7';
    },

    getDistanceInKm(lat1, lon1, lat2, lon2) {
      if (!lat1 || !lon1 || !lat2 || !lon2) return null;
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c).toFixed(1);
    },

    getUserLocation() {
      if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser.');
        return;
      }

      this.isLocating = true;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLat = position.coords.latitude;
          this.userLng = position.coords.longitude;
          
          this.calculateDistances();

          setTimeout(() => {
            this.isLocating = false;
          }, 800);
        },
        (error) => {
          this.isLocating = false;
          alert('Unable to access location. Please check browser GPS permissions.');
          console.error(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    },

    calculateDistances() {
      if (!this.userLat || !this.userLng) return;

      this.institutions.forEach(uni => {
        if (uni.latitude && uni.longitude) {
          uni.distanceKm = this.getDistanceInKm(
            this.userLat,
            this.userLng,
            uni.latitude,
            uni.longitude
          );
        }
      });
    },

    handleImageError(event, index) {
      event.target.onerror = null;
      event.target.src = this.fallbackPhotos[index % this.fallbackPhotos.length];
    },

    async fetchInstitutions() {
      try {
        const response = await fetch('http://localhost:3000/api/institutions');
        const result = await response.json();
        
        if (result.success) {
          const saColors = [
            '0, 100, 60',   
            '0, 35, 120',   
            '170, 30, 30',  
            '180, 120, 10', 
            '20, 25, 40'    
          ];

          const coordinatesMap = {
            'cput': { lat: -33.9312, lng: 18.4243 },
            'uct': { lat: -33.9576, lng: 18.4610 },
            'stellenbosch': { lat: -33.9321, lng: 18.8644 },
            'wits': { lat: -26.1929, lng: 28.0305 },
            'pretoria': { lat: -25.7545, lng: 28.2314 },
            'johannesburg': { lat: -26.1825, lng: 27.9982 },
            'uwc': { lat: -33.9332, lng: 18.6272 },
            'tut': { lat: -25.7323, lng: 28.1622 }
          };

          const campusPhotoMap = [
            { keywords: ['cape town', 'uct'], url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['cput', 'peninsula', 'college'], url: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['stellenbosch', 'maties'], url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['witwatersrand', 'wits'], url: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['pretoria', 'tuks', 'up'], url: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['johannesburg', 'uj'], url: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['western cape', 'uwc'], url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80' },
            { keywords: ['tshwane', 'tut', 'tvet'], url: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80' }
          ];

          this.institutions = result.data.map((item, index) => {
            const themeColor = saColors[index % saColors.length];
            const nameLower = (item.name || '').toLowerCase();

            let lat = item.latitude || null;
            let lng = item.longitude || null;

            if (!lat || !lng) {
              const matchedKey = Object.keys(coordinatesMap).find(key => nameLower.includes(key));
              if (matchedKey) {
                lat = coordinatesMap[matchedKey].lat;
                lng = coordinatesMap[matchedKey].lng;
              }
            }

            const validDbUrl = item.image_url && 
              typeof item.image_url === 'string' && 
              item.image_url.trim() !== '' && 
              item.image_url !== 'null' && 
              item.image_url !== 'undefined' &&
              (item.image_url.startsWith('http://') || item.image_url.startsWith('https://'));

            const matchedCampus = campusPhotoMap.find(c => 
              c.keywords.some(kw => nameLower.includes(kw))
            );

            const campusPhoto = validDbUrl 
              ? item.image_url 
              : (matchedCampus ? matchedCampus.url : this.fallbackPhotos[index % this.fallbackPhotos.length]);

            // Parse faculties string into an array for v-for modal rendering
            let parsedFaculties = ['Consult official prospectus for full list.'];
            if (item.faculties) {
              parsedFaculties = typeof item.faculties === 'string' 
                ? item.faculties.split(',').map(f => f.trim()) 
                : item.faculties;
            }

            return {
              id: item.institution_id || item.id || index,
              name: item.name,
              province: item.province,
              location: item.province,
              type: item.institution_type || 'TVET College',
              institution_type: item.institution_type || 'TVET College',
              opening_date: item.opening_date,
              closing_date: item.closing_date,
              openingDate: this.formatDate(item.opening_date),
              closingDate: this.formatDate(item.closing_date),
              applicationFee: item.application_fee ? `R${item.application_fee}` : 'Free / R0',
              applicationUrl: item.application_url || item.website_url || '#',
              websiteUrl: item.website_url,
              facultiesRaw: item.faculties || '',
              faculties: parsedFaculties,
              requirements: item.requirements || 'National Senior Certificate (NSC) or equivalent with minimum required APS points for selected program.',
              themeColor: themeColor,
              image: campusPhoto,
              latitude: lat,
              longitude: lng,
              distanceKm: null,
              description: item.description || `${item.name} is a higher education institution located in ${item.province}, South Africa.`
            };
          });

          if (this.userLat && this.userLng) {
            this.calculateDistances();
          }
        }
      } catch (error) {
        console.error('Error loading institutions from backend:', error);
      }
    },

    setCardRef(el, index) {
      if (el) this.cardRefs[index] = el;
    },
    openDetails(uni) {
      this.selectedUni = uni;
    },
    closeDetails() {
      this.selectedUni = null;
    },
    resetFilters() {
      this.searchQuery = '';
      this.selectedProvince = '';
      this.selectedType = '';
      this.$emit('reset-filters');
    },
    initIntersectionObserver() {
      this.cardRefs = [];
      this.$nextTick(() => {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        }, { threshold: 0.3 });

        this.cardRefs.forEach(card => card && observer.observe(card));
      });
    }
  },

  watch: {
    filteredInstitutions() {
      if (this.$refs.scrollContainer) {
        this.$refs.scrollContainer.scrollTop = 0;
      }
      this.initIntersectionObserver();
    }
  },

  mounted() {
    this.fetchInstitutions();
  }
}
</script>

<style scoped>
.uni-scroll-container {
  height: 100vh;
  height: 100dvh;
  overflow-y: auto;
  scroll-snap-type: y proximity;
  scroll-behavior: smooth;
  margin: 0;
  padding: 0;
}

.max-w-lg {
  max-width: 800px;
}

.max-btn-width {
  max-width: 380px;
}

.fullscreen-card {
  height: 100vh;
  height: 100dvh;
  width: 100vw;
  scroll-snap-align: start;
  margin: 0;
  background-color: #001242;
}

.bg-navy-card {
  background-color: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* RESPONSIVE HEADING */
.responsive-heading {
  font-size: clamp(1.5rem, 5vw, 3.2rem);
  line-height: 1.15;
}

/* FLOATING BUTTON POSITIONING */
.floating-geo-btn {
  top: auto;
  bottom: 24px;
  right: 16px !important;
}

@media (min-width: 768px) {
  .floating-geo-btn {
    top: 90px;
    bottom: auto;
    right: 24px !important;
  }
}

/* 1. SEARCHING RADAR OVERLAY */
.bg-radar-overlay {
  background: rgba(0, 18, 66, 0.94);
  backdrop-filter: blur(14px);
}

.z-radar {
  z-index: 2000;
}

.radar-box {
  position: relative;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-wave {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #ffb81c;
  animation: radar-pulse 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

.radar-wave.delay-1 { animation-delay: 0.5s; }
.radar-wave.delay-2 { animation-delay: 1s; }

@keyframes radar-pulse {
  0% { transform: scale(0.2); opacity: 1; }
  100% { transform: scale(2.2); opacity: 0; }
}

.icon-pulse {
  animation: icon-bounce 1.5s infinite ease-in-out;
}

@keyframes icon-bounce {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-8px) scale(1.15); }
}

.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity 0.4s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }

/* 2. CARDS POP-IN STYLES */
.card-fade-enter-active {
  transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.card-fade-leave-active { transition: opacity 0.35s ease-in, transform 0.35s ease-in; }
.card-fade-enter-from { opacity: 0; transform: translateY(40px) scale(0.94); }
.card-fade-leave-to { opacity: 0; transform: translateY(-40px) scale(0.94); }
.card-fade-move { transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1); }

.distance-pop-badge { animation: badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes badge-pop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

/* UTILITY CLASSES */
.fs-7 { font-size: 0.85rem; }
.fs-8 { font-size: 0.75rem; }

.object-fit-cover { object-fit: cover; object-position: center; }
.card-bg-img { transition: transform 1.2s ease-out; }
.fullscreen-card.is-visible .card-bg-img { transform: scale(1.03); }

.bg-navy { background-color: #001242; }
.bg-gold { background-color: #ffb81c !important; }
.text-gold { color: #ffb81c !important; }
.btn-gold { background-color: #ffb81c; color: #000000; border: none; }
.border-gold { border: 1px solid #ffb81c !important; }

.hover-lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.hover-lift:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.4); }

.backdrop-blur { backdrop-filter: blur(10px); }
.modal-overlay { z-index: 1050; }

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-6px); }
  60% { transform: translateY(-3px); }
}
.bounce { animation: bounce 2s infinite; }
</style>
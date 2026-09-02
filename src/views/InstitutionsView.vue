<template>
  <div class="uni-scroll-container">
    <!-- STICKY CONTROL BAR (Search, Filter & Sort) -->
    <div class="sticky-top-bar position-fixed start-50 translate-middle-x w-90 max-w-lg">
      <div class="card bg-navy-glass border-gold p-2 shadow-lg backdrop-blur rounded-pill">
        <div class="row g-2 align-items-center px-2">
          <!-- SEARCH INPUT -->
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-transparent border-0 text-gold">
                <i class="bi bi-search"></i>
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control bg-transparent border-0 text-white shadow-none placeholder-light" 
                placeholder="Search university or city..."
              />
            </div>
          </div>

          <!-- PROVINCE FILTER -->
          <div class="col-md-3">
            <select v-model="selectedProvince" class="form-select bg-dark text-white border-secondary rounded-pill text-sm">
              <option value="">All Provinces</option>
              <option value="Western Cape">Western Cape</option>
              <option value="Gauteng">Gauteng</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Free State">Free State</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
            </select>
          </div>

          <!-- TYPE FILTER -->
          <div class="col-md-4">
            <select v-model="selectedType" class="form-select bg-dark text-white border-secondary rounded-pill text-sm">
              <option value="">All Types</option>
              <option value="University">University</option>
              <option value="TVET College">TVET College</option>
              <option value="Private College">Private College</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- NO RESULTS NOTICE -->
    <div v-if="filteredInstitutions.length === 0" class="fullscreen-card d-flex align-items-center justify-content-center text-white bg-navy">
      <div class="text-center pt-5">
        <i class="bi bi-search fs-1 text-gold mb-3 d-block"></i>
        <h3>No institutions found</h3>
        <p class="text-light">Try adjusting your search query or filters.</p>
        <button @click="resetFilters" class="btn btn-gold rounded-pill px-4 fw-bold">Reset Filters</button>
      </div>
    </div>

    <!-- CARDS CONTAINER -->
    <div 
      v-for="(uni, index) in filteredInstitutions" 
      :key="uni.id"
      class="fullscreen-card position-relative overflow-hidden d-flex align-items-center justify-content-center text-white"
      :ref="el => setCardRef(el, index)"
    >
      <!-- CAMPUS BACKGROUND IMAGE WITH OVERLAY -->
      <div 
        class="card-bg-image position-absolute top-0 start-0 w-100 h-100"
        :style="{ backgroundImage: `linear-gradient(rgba(0, 18, 84, 0.8), rgba(0, 12, 50, 0.92)), url(${uni.image})` }"
      ></div>

      <!-- CARD HERO CONTENT -->
      <div class="card-content text-center z-1 px-4 max-w-lg">
        <!-- ANIMATED DRAW SVG EMBLEM -->
        <div class="emblem-wrapper mx-auto mb-3">
          <svg class="emblem-svg" viewBox="0 0 100 100">
            <rect class="draw-path" x="5" y="5" width="90" height="90" rx="18" />
            <path class="draw-path inner-icon" d="M50 22 L78 38 L78 68 L50 84 L22 68 L22 38 Z" />
          </svg>
        </div>

        <span class="badge bg-gold text-dark fw-bold px-3 py-2 mb-2 rounded-pill text-uppercase fs-7">
          {{ uni.type }}
        </span>

        <h1 class="display-4 fw-bold mb-2">{{ uni.name }}</h1>
        <p class="lead fs-4 text-light opacity-90 mb-4">
          <i class="bi bi-geo-alt-fill text-gold me-1"></i> {{ uni.location }}, {{ uni.province }}
        </p>

        <!-- ACTION BUTTONS -->
        <div class="d-flex justify-content-center gap-3 flex-wrap">
          <button 
            @click="openDetails(uni)" 
            class="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-bold hover-lift"
          >
            <i class="bi bi-info-circle me-1"></i> View Institution Details
          </button>
          
          <a 
            :href="uni.applicationUrl" 
            target="_blank" 
            class="btn btn-gold btn-lg px-4 py-2 rounded-pill fw-bold hover-lift text-dark"
          >
            Apply Now <i class="bi bi-box-arrow-up-right ms-1"></i>
          </a>
        </div>
      </div>

      <!-- SCROLL INDICATOR -->
      <div class="scroll-hint position-absolute bottom-0 start-50 translate-middle-x mb-4 text-center text-light opacity-75">
        <small class="d-block mb-1">Scroll to next institution</small>
        <i class="bi bi-chevron-down fs-4 bounce"></i>
      </div>
    </div>

    <!-- FULL DETAILS MODAL / DRAWER -->
    <div 
      v-if="selectedUni" 
      class="modal fade show d-block backdrop-blur modal-overlay" 
      tabindex="-1" 
      @click.self="closeDetails"
    >
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-gold shadow-lg">
          <div class="modal-header border-bottom border-secondary">
            <div class="d-flex align-items-center gap-3">
              <img :src="selectedUni.image" :alt="selectedUni.name" class="rounded-circle object-fit-cover" width="50" height="50">
              <div>
                <h4 class="modal-title fw-bold mb-0">{{ selectedUni.name }}</h4>
                <small class="text-gold">{{ selectedUni.location }} • {{ selectedUni.province }}</small>
              </div>
            </div>
            <button type="button" class="btn-close btn-close-white" @click="closeDetails"></button>
          </div>

          <div class="modal-body py-4">
            <!-- DESCRIPTION -->
            <h5 class="fw-bold text-gold mb-2">Overview</h5>
            <p class="text-light mb-4">{{ selectedUni.description }}</p>

            <!-- DETAILS GRID -->
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary">
                  <h6 class="fw-bold text-gold mb-1"><i class="bi bi-book me-2"></i>Key Faculties / Streams</h6>
                  <ul class="mb-0 ps-3 small text-light">
                    <li v-for="(faculty, i) in selectedUni.faculties" :key="i">{{ faculty }}</li>
                  </ul>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary">
                  <h6 class="fw-bold text-gold mb-1"><i class="bi bi-cash-stack me-2"></i>Application Fee</h6>
                  <p class="mb-0 fs-5 fw-semibold text-white">{{ selectedUni.applicationFee }}</p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary">
                  <h6 class="fw-bold text-gold mb-1"><i class="bi bi-calendar-event me-2"></i>Application Window</h6>
                  <p class="mb-0 small text-light">
                    <strong>Opens:</strong> {{ selectedUni.openingDate }}<br>
                    <strong>Closes:</strong> {{ selectedUni.closingDate }}
                  </p>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 rounded bg-navy border border-secondary">
                  <h6 class="fw-bold text-gold mb-1"><i class="bi bi-patch-check me-2"></i>Application Status</h6>
                  <span class="badge bg-success px-3 py-2 rounded-pill mt-1">
                    {{ selectedUni.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- REQUIREMENTS -->
            <h5 class="fw-bold text-gold mb-2">General Admission Requirements</h5>
            <p class="small text-light mb-0">{{ selectedUni.requirements }}</p>
          </div>

          <div class="modal-footer border-top border-secondary justify-content-between">
            <button type="button" class="btn btn-outline-light rounded-pill px-4" @click="closeDetails">Close</button>
            <a :href="selectedUni.applicationUrl" target="_blank" class="btn btn-gold text-dark fw-bold rounded-pill px-4">
              Proceed to Application Portal
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
  data() {
    return {
      cardRefs: [],
      selectedUni: null,
      searchQuery: '',
      selectedProvince: '',
      selectedType: '',
      institutions: [
        {
          id: 1,
          name: 'University of Cape Town (UCT)',
          province: 'Western Cape',
          location: 'Rondebosch, Cape Town',
          type: 'University',
          status: 'Open',
          applicationFee: 'R100.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.uct.ac.za',
          description: 'South Africa\'s oldest university and top-ranked research institution located at the foot of Table Mountain.',
          faculties: ['Commerce', 'Engineering & Built Environment', 'Health Sciences', 'Humanities', 'Law', 'Science'],
          requirements: 'NSC Degree endorsement with subject minimums and APS requirements specific to each faculty.'
        },
        {
          id: 2,
          name: 'Stellenbosch University (SU)',
          province: 'Western Cape',
          location: 'Stellenbosch',
          type: 'University',
          status: 'Open',
          applicationFee: 'R100.00',
          openingDate: '2026-04-01',
          closingDate: '2026-08-31',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.sun.ac.za',
          description: 'Renowned research university situated in the Winelands of the Western Cape.',
          faculties: ['AgriSciences', 'Arts & Social Sciences', 'Economic & Management Sciences', 'Engineering', 'Medicine'],
          requirements: 'NSC Bachelors pass with minimum overall average percentage thresholds.'
        },
        {
          id: 3,
          name: 'Cape Peninsula University of Technology (CPUT)',
          province: 'Western Cape',
          location: 'Bellville / District Six, Cape Town',
          type: 'University',
          status: 'Open',
          applicationFee: 'R150.00',
          openingDate: '2026-05-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.cput.ac.za',
          description: 'The largest university of technology in the Western Cape region focusing on vocational career pathways.',
          faculties: ['Applied Sciences', 'Business & Management Sciences', 'Engineering & Built Environment', 'Informatics & Design'],
          requirements: 'NSC Diploma or Degree endorsement with minimum subject ratings.'
        },
        {
          id: 4,
          name: 'False Bay TVET College',
          province: 'Western Cape',
          location: 'Muizenberg / Khayelitsha / Westlake',
          type: 'TVET College',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-01-15',
          closingDate: '2026-10-31',
          image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.falsebaycollege.co.za',
          description: 'Top rated public TVET college providing vocational skills, NATED diplomas, and practical learnerships.',
          faculties: ['Engineering Studies', 'Business Studies', 'Information Technology', 'Hospitality & Tourism'],
          requirements: 'Grade 9 pass (NCV) or Grade 12 (NATED / Diploma streams).'
        },
        {
          id: 5,
          name: 'Eduvos (Tyger Valley Campus)',
          province: 'Western Cape',
          location: 'Tyger Valley, Cape Town',
          type: 'Private College',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-01-01',
          closingDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.eduvos.com',
          description: 'Leading private higher education provider offering flexible degree and diploma programs.',
          faculties: ['Information Technology', 'Commerce', 'Humanities', 'Applied Science'],
          requirements: 'NSC Degree / Diploma pass depending on degree path selected.'
        },
        {
          id: 6,
          name: 'University of the Witwatersrand (Wits)',
          province: 'Gauteng',
          location: 'Braamfontein, Johannesburg',
          type: 'University',
          status: 'Open',
          applicationFee: 'R100.00',
          openingDate: '2026-03-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.wits.ac.za',
          description: 'Leading research institution situated in heart of Johannesburg, known for engineering, science, and medicine.',
          faculties: ['Health Sciences', 'Humanities', 'Science', 'Engineering & Built Environment', 'Commerce & Law'],
          requirements: 'NSC Degree endorsement with competitive APS scores in core subjects.'
        },
        {
          id: 7,
          name: 'University of Johannesburg (UJ)',
          province: 'Gauteng',
          location: 'Auckland Park, Johannesburg',
          type: 'University',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-04-01',
          closingDate: '2026-10-31',
          image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.uj.ac.za',
          description: 'Dynamic comprehensive university driving 4IR technology and innovation.',
          faculties: ['Art, Design & Architecture', 'College of Business & Economics', 'Health Sciences', 'Science'],
          requirements: 'NSC Degree or Diploma endorsement depending on program track.'
        },
        {
          id: 8,
          name: 'Tshwane University of Technology (TUT)',
          province: 'Gauteng',
          location: 'Pretoria',
          type: 'University',
          status: 'Open',
          applicationFee: 'R240.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.tut.ac.za',
          description: 'Largest residential higher education institution in South Africa providing career-focused technology qualifications.',
          faculties: ['Engineering & the Built Environment', 'Information & Communication Technology', 'Arts & Design', 'Management Sciences'],
          requirements: 'NSC Diploma or Degree endorsement with faculty subject minimums.'
        },
        {
          id: 9,
          name: 'IIE Varsity College (Sandton)',
          province: 'Gauteng',
          location: 'Sandton, Johannesburg',
          type: 'Private College',
          status: 'Open',
          applicationFee: 'R400.00',
          openingDate: '2026-01-01',
          closingDate: '2026-12-31',
          image: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.varsitycollege.co.za',
          description: 'Educational brand of The Independent Institute of Education (The IIE), offering modern industry-aligned qualifications.',
          faculties: ['Computer Science & IT', 'Law', 'Commerce', 'Humanities'],
          requirements: 'NSC Degree or Diploma pass as per IIE admission standards.'
        },
        {
          id: 10,
          name: 'Rhodes University (RU)',
          province: 'Eastern Cape',
          location: 'Makhanda (Grahamstown)',
          type: 'University',
          status: 'Open',
          applicationFee: 'R100.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ru.ac.za',
          description: 'A distinctively small, highly research-intensive university with outstanding academic outcomes.',
          faculties: ['Humanities', 'Commerce', 'Science', 'Pharmacy', 'Law', 'Education'],
          requirements: 'NSC Degree pass with strong performance in written English and core subjects.'
        },
        {
          id: 11,
          name: 'Nelson Mandela University (NMU)',
          province: 'Eastern Cape',
          location: 'Gqeberha (Port Elizabeth)',
          type: 'University',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.mandela.ac.za',
          description: 'A comprehensive university offering professional, vocational, and general academic degrees.',
          faculties: ['Engineering & Built Environment', 'Health Sciences', 'Business & Economic Sciences', 'Law', 'Science'],
          requirements: 'Applicant score (AS) calculated from NSC subject ratings.'
        },
        {
          id: 12,
          name: 'University of Fort Hare (UFH)',
          province: 'Eastern Cape',
          location: 'Alice / East London',
          type: 'University',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-04-01',
          closingDate: '2026-10-31',
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ufh.ac.za',
          description: 'A historic public university with rich legacy in South African leadership and academic development.',
          faculties: ['Management & Commerce', 'Law', 'Science & Agriculture', 'Social Sciences & Humanities', 'Education'],
          requirements: 'NSC Bachelor degree endorsement meeting program cutoff points.'
        },
        {
          id: 13,
          name: 'Walter Sisulu University (WSU)',
          province: 'Eastern Cape',
          location: 'Mthatha / East London',
          type: 'University',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.wsu.ac.za',
          description: 'A developmental comprehensive university offering urban and rural community transformation programs.',
          faculties: ['Health Sciences', 'Business Sciences', 'Engineering & Technology', 'Educational Sciences'],
          requirements: 'NSC Degree or Diploma pass meeting faculty threshold limits.'
        },
        {
          id: 14,
          name: 'University of KwaZulu-Natal (UKZN)',
          province: 'KwaZulu-Natal',
          location: 'Durban & Pietermaritzburg',
          type: 'University',
          status: 'Open',
          applicationFee: 'R210.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1525921429624-479b6a26d84d?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ukzn.ac.za',
          description: 'Top research institution operating across five main campuses in KZN.',
          faculties: ['Agriculture, Engineering & Science', 'Health Sciences', 'Humanities', 'Law & Management Studies'],
          requirements: 'Applied through Central Applications Office (CAO) with NSC degree pass.'
        },
        {
          id: 15,
          name: 'Durban University of Technology (DUT)',
          province: 'KwaZulu-Natal',
          location: 'Durban / Pietermaritzburg',
          type: 'University',
          status: 'Open',
          applicationFee: 'R220.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.dut.ac.za',
          description: 'Leading university of technology prioritizing practical training, entrepreneurship, and innovation.',
          faculties: ['Accounting & Informatics', 'Applied Sciences', 'Arts & Design', 'Engineering & Built Environment', 'Health Sciences'],
          requirements: 'NSC Diploma or Degree pass submitted via CAO portal.'
        },
        {
          id: 16,
          name: 'University of the Free State (UFS)',
          province: 'Free State',
          location: 'Bloemfontein',
          type: 'University',
          status: 'Open',
          applicationFee: 'R0.00 (Free)',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ufs.ac.za',
          description: 'Multi-campus public university providing diverse undergraduate research and professional pathways.',
          faculties: ['Economic & Management Sciences', 'Health Sciences', 'Law', 'Natural & Agricultural Sciences', 'Theology'],
          requirements: 'AP score minimums starting from 28-34 depending on degree track.'
        },
        {
          id: 17,
          name: 'University of Limpopo (UL)',
          province: 'Limpopo',
          location: 'Mankweng, Polokwane',
          type: 'University',
          status: 'Open',
          applicationFee: 'R200.00',
          openingDate: '2026-04-01',
          closingDate: '2026-09-30',
          image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ul.ac.za',
          description: 'A premier rural-based university providing quality higher education tailored to regional development.',
          faculties: ['Health Sciences', 'Science & Agriculture', 'Humanities', 'Management & Law'],
          requirements: 'NSC Bachelor degree endorsement meeting specific faculty points.'
        },
        {
          id: 18,
          name: 'University of Mpumalanga (UMP)',
          province: 'Mpumalanga',
          location: 'Mbombela (Nelspruit)',
          type: 'University',
          status: 'Open',
          applicationFee: 'R150.00',
          openingDate: '2026-04-01',
          closingDate: '2026-11-30',
          image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?auto=format&fit=crop&w=1600&q=80',
          applicationUrl: 'https://www.ump.ac.za',
          description: 'Modern public university driving socio-economic growth, agriculture, and hospitality in Mpumalanga.',
          faculties: ['Agriculture & Natural Sciences', 'Development Studies', 'Education'],
          requirements: 'NSC Degree or Diploma pass meeting departmental score requirements.'
        }
      ]
    }
  },
  computed: {
    filteredInstitutions() {
      return this.institutions.filter(uni => {
        const matchesSearch = 
          uni.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          uni.location.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          uni.province.toLowerCase().includes(this.searchQuery.toLowerCase());

        const matchesProvince = this.selectedProvince === '' || uni.province === this.selectedProvince;
        const matchesType = this.selectedType === '' || uni.type === this.selectedType;

        return matchesSearch && matchesProvince && matchesType;
      });
    }
  },
  methods: {
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
        }, { threshold: 0.4 });

        this.cardRefs.forEach(card => card && observer.observe(card));
      });
    }
  },
  watch: {
    filteredInstitutions() {
      this.initIntersectionObserver();
    }
  },
  mounted() {
    this.initIntersectionObserver();
  }
}
</script>

<style scoped>
/* STICKY CONTROL BAR POSITIONING */
.sticky-top-bar {
  top: 95px; /* Sits below top main navigation bar */
  z-index: 1020;
}

.w-90 {
  width: 90%;
}

.max-w-lg {
  max-width: 800px;
}

.bg-navy-glass {
  background-color: rgba(0, 18, 66, 0.88);
}

.placeholder-light::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.fullscreen-card {
  height: 100vh;
  width: 100vw;
  scroll-snap-align: start;
}

.card-content {
  padding-top: 90px; /* Offset content so floating bar doesn't overlap titles */
}

.card-bg-image {
  background-size: cover;
  background-position: center;
  transition: transform 1.2s ease-out;
}

.fullscreen-card.is-visible .card-bg-image {
  transform: scale(1.03);
}

.bg-navy {
  background-color: #001242;
}

.bg-gold {
  background-color: #ffb81c !important;
}

.text-gold {
  color: #ffb81c !important;
}

.btn-gold {
  background-color: #ffb81c;
  color: #000000;
  border: none;
}

.border-gold {
  border: 1px solid #ffb81c !important;
}

.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.4);
}

/* DRAW SVG ANIMATION */
.emblem-wrapper {
  width: 110px;
  height: 110px;
}

.emblem-svg {
  width: 100%;
  height: 100%;
}

.draw-path {
  fill: transparent;
  stroke: #ffb81c;
  stroke-width: 4;
  stroke-dasharray: 400;
  stroke-dashoffset: 400;
  transition: stroke-dashoffset 2s ease-in-out, fill 0.5s ease 1.8s;
}

.fullscreen-card.is-visible .draw-path {
  stroke-dashoffset: 0;
  fill: rgba(255, 184, 28, 0.2);
}

.backdrop-blur {
  backdrop-filter: blur(10px);
}

.modal-overlay {
  z-index: 1050;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-8px); }
  60% { transform: translateY(-4px); }
}

.bounce {
  animation: bounce 2s infinite;
}
</style>
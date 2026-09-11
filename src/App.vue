<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-navy sticky-top py-2">
      <div class="container-fluid px-3 px-md-4">
        
        <!-- 1. BRAND LOGO -->
        <router-link to="/institutions" class="navbar-brand fw-bold fs-4 text-white me-lg-4">
          ApplyDirect-<span class="text-gold">SA</span>
        </router-link>

        <!-- 2. MOBILE HAMBURGER TOGGLER -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- 3. COLLAPSIBLE CONTENT -->
        <div class="collapse navbar-collapse mt-2 mt-lg-0" id="navbarContent">
          
          <!-- SEARCH & FILTERS -->
          <div class="d-flex flex-column flex-lg-row gap-2 my-2 my-lg-0 mx-auto w-100 max-w-lg">
            <input 
              type="text" 
              class="form-control rounded-pill bg-light border-0 px-3" 
              placeholder="Search university or city..." 
              v-model="searchFilter.searchQuery"
            />
            <select class="form-select rounded-pill bg-light border-0" v-model="searchFilter.selectedProvince">
              <option value="">All Provinces</option>
              <option value="Gauteng">Gauteng</option>
              <option value="Western Cape">Western Cape</option>
              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
              <option value="Eastern Cape">Eastern Cape</option>
              <option value="Free State">Free State</option>
              <option value="Limpopo">Limpopo</option>
              <option value="Mpumalanga">Mpumalanga</option>
              <option value="North West">North West</option>
              <option value="Northern Cape">Northern Cape</option>
            </select>
            <select class="form-select rounded-pill bg-light border-0" v-model="searchFilter.selectedType">
              <option value="">All Types</option>
              <option value="University">University</option>
              <option value="TVET">TVET</option>
            </select>
          </div>

          <!-- NAV LINKS -->
          <div class="navbar-nav d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-auto pt-2 pt-lg-0">
            <router-link to="/institutions" class="sa-nav-tab tab-green text-center">
              Universities
            </router-link>

            <router-link to="/profile" class="sa-nav-tab tab-gold text-center">
              Profile
            </router-link>

            <router-link to="/about" class="sa-nav-tab tab-red text-center">
              About Us
            </router-link>

            <router-link to="/contact" class="sa-nav-tab tab-blue text-center">
              Contact
            </router-link>

            <router-link to="/subscription" class="sa-nav-tab tab-black text-center">
              Subscription
            </router-link>
          </div>

        </div>
      </div>
    </nav>

    <!-- MAIN CONTENT AREA -->
    <main>
      <router-view :search-filter="searchFilter" @reset-filters="resetFilters" />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchFilter: {
        searchQuery: '',
        selectedProvince: '',
        selectedType: ''
      }
    }
  },
  methods: {
    resetFilters() {
      this.searchFilter = {
        searchQuery: '',
        selectedProvince: '',
        selectedType: ''
      };
    }
  }
}
</script>

<style>
/* UTILITIES & BRAND COLORS */
.bg-navy {
  background-color: #001242 !important;
}

.text-gold {
  color: #ffb81c !important;
}

.max-w-lg {
  max-width: 600px;
}

/* BASE NAV TAB STYLING */
.sa-nav-tab {
  padding: 8px 18px;
  border-radius: 50rem;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  display: inline-block;
}

.sa-nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* SOUTH AFRICAN FLAG THEMED ACTIVE TABS */

/* 1. UNIVERSITIES -> SA GREEN */
.tab-green.router-link-active,
.tab-green.router-link-exact-active {
  background-color: #007a3d !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 122, 61, 0.4);
}

/* 2. PROFILE -> SA GOLD */
.tab-gold.router-link-active,
.tab-gold.router-link-exact-active {
  background-color: #ffb81c !important;
  color: #000000 !important;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.4);
}

/* 3. ABOUT US -> SA RED */
.tab-red.router-link-active,
.tab-red.router-link-exact-active {
  background-color: #e03c31 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(224, 60, 49, 0.4);
}

/* 4. CONTACT -> SA BLUE */
.tab-blue.router-link-active,
.tab-blue.router-link-exact-active {
  background-color: #002395 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 35, 149, 0.4);
}

/* 5. SUBSCRIPTION -> SA BLACK */
.tab-black.router-link-active,
.tab-black.router-link-exact-active {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}
</style>
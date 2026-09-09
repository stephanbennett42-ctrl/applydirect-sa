<template>
  <div id="app">
    <!-- NAVBAR -->
    <nav class="navbar navbar-expand-lg bg-white shadow-sm py-2">
      <div class="container-fluid px-4">
        <!-- BRAND LOGO -->
        <router-link to="/institutions" class="navbar-brand fw-bold fs-4 text-dark me-4">
          ApplyDirect-<span class="text-sa-blue">SA</span>
        </router-link>

        <!-- SEARCH & FILTERS -->
        <div class="d-flex gap-2 flex-grow-1 max-w-lg me-4">
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

        <!-- SA FLAG THEMED NAV TABS -->
        <div class="navbar-nav d-flex align-items-center gap-1">
          <!-- SA GREEN FOR UNIVERSITIES -->
          <router-link to="/institutions" class="sa-nav-tab tab-green">
            Universities
          </router-link>

          <!-- SA GOLD FOR PROFILE -->
          <router-link to="/profile" class="sa-nav-tab tab-gold">
            Profile
          </router-link>

          <!-- SA RED FOR ABOUT US -->
          <router-link to="/about" class="sa-nav-tab tab-red">
            About Us
          </router-link>

          <!-- SA BLUE FOR CONTACT -->
          <router-link to="/contact" class="sa-nav-tab tab-blue">
            Contact
          </router-link>

          <!-- SA BLACK FOR SUBSCRIPTION -->
          <router-link to="/subscription" class="sa-nav-tab tab-black">
            Subscription
          </router-link>
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
      this.searchFilter = { searchQuery: '', selectedProvince: '', selectedType: '' };
    }
  }
}
</script>

<style>
.max-w-lg {
  max-width: 600px;
}

.text-sa-blue {
  color: #002395;
}

/* BASE TAB STYLING */
.sa-nav-tab {
  padding: 8px 18px;
  border-radius: 50rem;
  font-weight: 600;
  color: #333333;
  text-decoration: none;
  transition: all 0.25s ease-in-out;
  display: inline-block;
}

.sa-nav-tab:hover {
  background-color: #f1f3f5;
  color: #000000;
}

/* --- SOUTH AFRICAN FLAG COLOR THEMES WHEN ACTIVE --- */

/* 1. UNIVERSITIES -> SA GREEN */
.tab-green.router-link-active,
.tab-green.router-link-exact-active {
  background-color: #007a3d !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 122, 61, 0.3);
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
  box-shadow: 0 4px 12px rgba(224, 60, 49, 0.3);
}

/* 4. CONTACT -> SA BLUE */
.tab-blue.router-link-active,
.tab-blue.router-link-exact-active {
  background-color: #002395 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 35, 149, 0.3);
}

/* 5. SUBSCRIPTION -> SA BLACK */
.tab-black.router-link-active,
.tab-black.router-link-exact-active {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>
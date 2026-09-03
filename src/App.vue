<template>
  <div id="app">
    <!-- TOP NAVIGATION BAR -->
    <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-sm py-2 px-4 border-0">
      <div class="container-fluid p-0">
        <!-- LOGO -->
        <router-link to="/" class="navbar-brand fw-bold fs-4 text-dark m-0">
          ApplyDirect<span class="text-primary">-SA</span>
        </router-link>

        <!-- SEARCH BAR & FILTERS EMBEDDED DIRECTLY IN NAV BAR -->
        <div class="d-none d-lg-flex align-items-center gap-2 mx-auto nav-search-container">
          <div class="input-group input-group-sm">
            <span class="input-group-text bg-light border-0 text-muted">
              <i class="bi bi-search"></i>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control bg-light border-0 shadow-none" 
              placeholder="Search university or city..."
              @input="onSearchChange"
            />
          </div>

          <select v-model="selectedProvince" @change="onSearchChange" class="form-select form-select-sm bg-light border-0 w-auto">
            <option value="">All Provinces</option>
            <option value="Western Cape">Western Cape</option>
            <option value="Gauteng">Gauteng</option>
            <option value="Eastern Cape">Eastern Cape</option>
            <option value="KwaZulu-Natal">KwaZulu-Natal</option>
            <option value="Free State">Free State</option>
            <option value="Limpopo">Limpopo</option>
            <option value="Mpumalanga">Mpumalanga</option>
          </select>

          <select v-model="selectedType" @change="onSearchChange" class="form-select form-select-sm bg-light border-0 w-auto">
            <option value="">All Types</option>
            <option value="University">University</option>
            <option value="TVET College">TVET College</option>
            <option value="Private College">Private College</option>
          </select>
        </div>

        <!-- MENU LINKS -->
        <ul class="navbar-nav ms-auto align-items-center gap-2 mb-0">
          <li class="nav-item">
            <router-link to="/institutions" class="btn btn-primary rounded-pill px-3 py-1 fw-semibold btn-sm">Universities</router-link>
          </li>
          <li class="nav-item"><router-link to="/profile" class="nav-link text-dark fw-medium py-0">Profile</router-link></li>
          <li class="nav-item"><router-link to="/about" class="nav-link text-dark fw-medium py-0">About Us</router-link></li>
          <li class="nav-item"><router-link to="/contact" class="nav-link text-dark fw-medium py-0">Contact</router-link></li>
          <li class="nav-item"><router-link to="/subscription" class="nav-link text-dark fw-medium py-0">Subscription</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- MAIN ROUTER VIEW -->
    <div class="main-content">
      <router-view :search-filter="{ searchQuery, selectedProvince, selectedType }" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      selectedProvince: '',
      selectedType: ''
    }
  },
  methods: {
    onSearchChange() {
      // Passes search state down to current route
    }
  }
}
</script>

<style>
/* Reset default margins and background to prevent white gaps */
html, body {
  margin: 0;
  padding: 0;
  background-color: #001242; /* Matches navy theme */
  overflow-x: hidden;
}

/* Nav bar fixes */
.navbar {
  height: 60px;
  border-bottom: none !important; /* Removes the light border line */
  box-shadow: 0 2px 10px rgba(0,0,0,0.08) !important;
}

.nav-search-container {
  max-width: 520px;
  width: 100%;
}

.main-content {
  padding-top: 60px; /* Exactly matches nav height so cards start flush under nav */
}
</style>
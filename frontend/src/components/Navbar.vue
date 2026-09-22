<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-navy sticky-top py-2">
    <div class="container-fluid px-3 px-md-4">
      
      <!-- BRAND LOGO -->
      <router-link to="/institutions" class="navbar-brand fw-bold fs-4 text-white me-lg-4" @click="closeMobileNav">
        ApplyDirect-<span class="text-gold">SA</span>
      </router-link>

      <!-- MOBILE HAMBURGER TOGGLER -->
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

      <!-- COLLAPSIBLE CONTENT -->
      <div class="collapse navbar-collapse mt-2 mt-lg-0" id="navbarContent" ref="navCollapse">
        
        <!-- SEARCH & FILTERS (Visible only on institution routes) -->
        <div 
          v-if="$route.path === '/institutions' || $route.path === '/'" 
          class="d-flex flex-column flex-lg-row gap-2 my-2 my-lg-0 mx-auto w-100 max-w-lg"
        >
          <input 
            type="text" 
            class="form-control rounded-pill bg-light border-0 px-3" 
            placeholder="Search university or city..." 
            v-model="searchFilter.searchQuery"
            aria-label="Search university or city"
          />
          <select 
            class="form-select rounded-pill bg-light border-0" 
            v-model="searchFilter.selectedProvince"
            aria-label="Filter by province"
          >
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
          <select 
            class="form-select rounded-pill bg-light border-0" 
            v-model="searchFilter.selectedType"
            aria-label="Filter by institution type"
          >
            <option value="">All Types</option>
            <option value="University">University</option>
            <option value="TVET">TVET</option>
          </select>
        </div>

        <!-- NAV LINKS -->
        <div class="navbar-nav d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center gap-2 ms-auto pt-2 pt-lg-0">
          <router-link to="/institutions" class="sa-nav-tab tab-green text-center" @click="closeMobileNav">
            Universities
          </router-link>

          <router-link to="/profile" class="sa-nav-tab tab-gold text-center" @click="closeMobileNav">
            Profile
          </router-link>

          <router-link to="/about" class="sa-nav-tab tab-red text-center" @click="closeMobileNav">
            About Us
          </router-link>

          <router-link to="/contact" class="sa-nav-tab tab-blue text-center" @click="closeMobileNav">
            Contact
          </router-link>

          <router-link to="/subscription" class="sa-nav-tab tab-black text-center" @click="closeMobileNav">
            Subscription
          </router-link>

          <div class="profile-account" :title="profileDisplayName">
            <span class="profile-name">{{ profileDisplayName }}</span>
            <div class="profile-icon" :aria-label="`Logged in as ${profileDisplayName}`">
              {{ profileInitials }}
            </div>
          </div>
        </div>

      </div>
    </div>
  </nav>
</template>

<script>
import { Collapse } from 'bootstrap';

export default {
  name: 'Navbar',
  props: {
    searchFilter: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      profile: {
        firstName: '',
        surname: ''
      }
    };
  },
  computed: {
    profileDisplayName() {
      return this.profile.firstName.trim() || 'My Profile';
    },
    profileInitials() {
      const firstName = this.profile.firstName.trim();
      const surname = this.profile.surname.trim();

      if (!firstName && !surname) {
        return '--';
      }

      return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
    }
  },
  mounted() {
    this.getProfile();
  },
  methods: {
    async getProfile() {
      try {
        const response = await fetch('http://localhost:3000/api/portfolio/1');
        const data = await response.json();

        if (response.ok && data.profile) {
          this.profile.firstName = data.profile.first_name || '';
          this.profile.surname = data.profile.last_name || '';
        }
      } catch (error) {
        console.error('Error loading navbar profile:', error);
      }
    },
    closeMobileNav() {
      const navCollapse = this.$refs.navCollapse;
      if (navCollapse && navCollapse.classList.contains('show')) {
        const bsCollapse = Collapse.getInstance(navCollapse) || new Collapse(navCollapse);
        bsCollapse.hide();
      }
    }
  }
}
</script>

<style scoped>
/* UTILITIES & BRAND COLORS */
.bg-navy { background-color: #001242 !important; }
.text-gold { color: #ffb81c !important; }
.max-w-lg { max-width: 600px; }

.navbar-nav {
  flex-direction: row !important;
  align-items: center !important;
  flex-wrap: nowrap;
  overflow-x: auto;
  white-space: nowrap;
}

@media (min-width: 992px) {
  .navbar-collapse {
    min-width: 0;
  }

  .navbar-collapse > div:first-child {
    flex: 1 1 auto;
    min-width: 0;
  }

  .navbar-collapse > div:first-child > div {
    flex-wrap: nowrap;
    max-width: none;
  }

  .navbar-nav {
    flex: 0 0 auto;
    flex-wrap: nowrap;
  }
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
.tab-green.router-link-active,
.tab-green.router-link-exact-active {
  background-color: #007a3d !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 122, 61, 0.4);
}

.tab-gold.router-link-active,
.tab-gold.router-link-exact-active {
  background-color: #ffb81c !important;
  color: #000000 !important;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.4);
}

.tab-red.router-link-active,
.tab-red.router-link-exact-active {
  background-color: #e03c31 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(224, 60, 49, 0.4);
}

.tab-blue.router-link-active,
.tab-blue.router-link-exact-active {
  background-color: #002395 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 35, 149, 0.4);
}

.tab-black.router-link-active,
.tab-black.router-link-exact-active {
  background-color: #1a1a1a !important;
  color: #ffffff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.profile-account {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: 4px;
  padding-left: 12px;
  border-left: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.profile-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border-radius: 50%;
  background: #ffb81c;
  color: #14223b;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(255, 184, 28, 0.35);
}

@media (max-width: 991px) {
  .profile-account {
    justify-content: flex-start;
    margin: 4px 0 0;
    padding: 8px 0 0;
    border-left: 0;
    border-top: 1px solid rgba(255, 255, 255, 0.25);
  }
}
</style>
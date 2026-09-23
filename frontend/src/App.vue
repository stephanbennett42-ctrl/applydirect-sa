<template>
  <div id="app" class="app-container">
    <!-- TOP NAVBAR: Displays on all pages across your app -->
    <Navbar :search-filter="searchFilter" />

    <main class="main-content">
      <router-view
        :search-filter="searchFilter"
        @reset-filters="resetFilters"
      />
    </main>
  </div>
</template>

<script>
import Navbar from './components/MainNavbar.vue'

export default {
  name: "App",
  components: {
    Navbar,
  },
  data() {
    return {
      searchFilter: {
        searchQuery: "",
        selectedProvince: "",
        selectedType: "",
      },
    };
  },
  methods: {
    resetFilters() {
      this.searchFilter = {
        searchQuery: "",
        selectedProvince: "",
        selectedType: "",
      };
    },
  },
};
</script>

<style>
/* GLOBAL LAYOUT STYLES */
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #001242;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
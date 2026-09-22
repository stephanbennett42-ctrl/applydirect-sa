<template>
  <div id="app">
    <!-- NAVBAR COMPONENT -->
    <Navbar />

    <!-- MAIN CONTENT AREA -->
    <main>
      <router-view :search-filter="searchFilter" @reset-filters="resetFilters" />
    </main>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      searchFilter: {
        searchQuery: '',
        selectedProvince: '',
        selectedType: ''
      }
    };
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
};
</script>

<style>
/* GLOBAL LAYOUT STYLES */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}
</style>
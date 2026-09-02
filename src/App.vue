<template>
  <div id="app">
    <!-- NAVIGATION BAR -->
    <nav class="navbar navbar-expand-lg bg-white shadow-sm py-3 mb-4">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- BRAND BRANDING / LOGO -->
        <router-link to="/" class="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <span class="fs-4 fw-bold text-dark tracking-tight">
            ApplyDirect<span class="text-primary">-SA</span>
          </span>
        </router-link>

        <!-- NAVIGATION TABS -->
        <div class="navbar-nav d-flex flex-row flex-wrap gap-2 align-items-center">
          <router-link 
            v-for="link in navLinks" 
            :key="link.path"
            :to="link.path"
            class="nav-tab px-3 py-2 rounded text-decoration-none fw-semibold"
            :style="getTabStyle(link.path)"
            @click="rotateColor"
          >
            {{ link.label }}
          </router-link>
        </div>
      </div>
    </nav>

    <!-- ROUTER VIEW -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      currentColorIndex: 0,
      saFlagColors: [
        '#002395', // SA Navy Blue
        '#007A4D', // SA Green
        '#E03C32', // SA Chilli Red
        '#FFB81C', // SA Gold
        '#000000'  // SA Black
      ],
      navLinks: [
        { path: '/universities', label: 'Universities' },
        { path: '/profile', label: 'Profile' },
        { path: '/about', label: 'About Us' },
        { path: '/contact', label: 'Contact' },
        { path: '/subscription', label: 'Subscription' }
      ]
    }
  },
  methods: {
    rotateColor() {
      this.currentColorIndex = (this.currentColorIndex + 1) % this.saFlagColors.length;
    },
    getTabStyle(path) {
      const currentPath = this.$route ? this.$route.path : '';
      const isActive = currentPath === path || (path === '/universities' && (currentPath === '/' || currentPath === ''));
      const currentColor = this.saFlagColors[this.currentColorIndex];

      if (isActive) {
        return {
          backgroundColor: currentColor,
          border: `2px solid ${currentColor}`,
          color: currentColor === '#FFB81C' ? '#000000' : '#ffffff',
          display: 'inline-block'
        }
      }

      return {
        backgroundColor: 'transparent',
        border: '2px solid transparent',
        color: '#212529',
        display: 'inline-block'
      }
    }
  }
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.02em;
}

.nav-tab {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
  font-size: 0.95rem;
}

.nav-tab:hover {
  opacity: 0.85;
}
</style>
<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <!-- Top SA Flag Gradient Line -->
    <div class="flag-accent-border"></div>

    <!-- Main Clean Header -->
    <header class="bg-white shadow-sm py-3">
      <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h1 style="color: var(--sa-blue);" class="fw-bold m-0 fs-2 mb-2 mb-md-0">
          ApplyDirect SA
        </h1>

        <nav class="nav nav-pills">
          <router-link to="/universities" class="nav-link" active-class="active bg-sa-blue">
            Universities
          </router-link>
          <router-link to="/profile" class="nav-link">Profile</router-link>
          <router-link to="/about" class="nav-link">About</router-link>
          <router-link to="/contact" class="nav-link">Contact</router-link>
          <router-link to="/about" class="nav-link">About Us</router-link>
          <router-link to="/subscription" 
          class="nav-link">Subscription</router-link>
        </nav>
      </div>
    </header>

    <main class="flex-grow-1">
      <router-view />
    </main>

    <footer class="bg-dark text-white py-3 text-center small mt-5">
      <div class="container">
        &copy; 2026 ApplyDirect SA. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-link {
  color: var(--sa-black);
  font-weight: 500;
}
.nav-link.active {
  background-color: var(--sa-blue) !important;
  color: var(--sa-white) !important;
}
</style>
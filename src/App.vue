<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const savedCount = ref(0)

const updateCount = () => {
  const saved = JSON.parse(localStorage.getItem('saved_institutions') || '[]')
  savedCount.value = saved.length
}

onMounted(() => {
  updateCount()
  window.addEventListener('storage', updateCount)
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- Navbar -->
    <header>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div class="container">
          <RouterLink class="navbar-brand fw-bold text-warning fs-4" to="/institutions">
            ApplyDirect SA
          </RouterLink>
          
          <div class="navbar-nav ms-auto d-flex flex-row gap-3">
            <RouterLink class="nav-link" active-class="active fw-bold" to="/institutions">
              Institutions
            </RouterLink>
            <RouterLink class="nav-link" active-class="active fw-bold" to="/saved">
              Saved ★
            </RouterLink>
          </div>
        </div>
      </nav>

      <!-- Hero Banner -->
      <section class="bg-primary text-white text-center py-5 shadow-sm">
        <div class="container">
          <h1 class="display-5 fw-bold mb-2">South African Tertiary Directory</h1>
          <p class="lead mb-0">Explore application portals, fee structures, and current admission statuses nationwide.</p>
        </div>
      </section>
    </header>

    <!-- Main Content -->
    <main class="flex-grow-1">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-1 fw-bold">ApplyDirect SA Directory</p>
        <p class="text-muted small mb-0">&copy; 2026 ApplyDirect SA. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
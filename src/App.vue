<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div class="container">
        <RouterLink class="navbar-brand fw-bold" to="/institutions">ApplyDirect SA</RouterLink>
        <div class="navbar-nav">
          <RouterLink class="nav-link" to="/institutions">Institutions</RouterLink>
        </div>
      </div>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
</style>
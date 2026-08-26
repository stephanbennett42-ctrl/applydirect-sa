<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Institution {
  institution_id: number
  name: string
  institution_type: string
  province: string
  application_status: string
  application_fee: string
  website_url: string
}

const institutions = ref<Institution[]>([])
const loading = ref(true)
const errorMsg = ref('')

const fetchInstitutions = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/institutions')
    if (!res.ok) throw new Error('Failed to fetch data from backend')
    
    const json = await res.json()
    if (json.success) {
      institutions.value = json.data
    }
  } catch (err: any) {
    errorMsg.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchInstitutions()
})
</script>

<template>
  <div class="container my-4">
    <h2 class="mb-4">South African Tertiary Institutions</h2>

    <div v-if="loading" class="text-center my-4">
      <p>Loading institutions database...</p>
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <div v-else class="row g-4">
      <div 
        v-for="item in institutions" 
        :key="item.institution_id" 
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title h6 mb-0">{{ item.name }}</h5>
              <span 
                class="badge" 
                :class="item.application_status === 'Open' ? 'bg-success' : 'bg-danger'"
              >
                {{ item.application_status }}
              </span>
            </div>
            
            <p class="text-muted small mb-2">
              {{ item.institution_type }} • {{ item.province }}
            </p>
            
            <p class="mb-3">
              <strong>Fee:</strong> 
              {{ Number(item.application_fee) === 0 ? 'Free' : `R${item.application_fee}` }}
            </p>

            <a 
              :href="item.website_url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-outline-primary btn-sm mt-auto w-100"
            >
              Visit Portal
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
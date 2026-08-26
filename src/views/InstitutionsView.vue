<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

// Filter State Variables
const searchQuery = ref('')
const selectedProvince = ref('')
const selectedStatus = ref('')

const fetchInstitutions = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/institutions')
    if (!res.ok) throw new Error('Failed to fetch data from server')
    
    const json = await res.json()
    if (json.success) {
      institutions.value = json.data
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Error connecting to API'
  } finally {
    loading.value = false
  }
}

// Dynamically extract unique provinces for the dropdown list
const provinces = computed(() => {
  const list = institutions.value.map(i => i.province)
  return [...new Set(list)].filter(Boolean).sort()
})

// Real-time reactive filtering logic
const filteredInstitutions = computed(() => {
  return institutions.value.filter((inst) => {
    const matchesSearch = inst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          inst.institution_type.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    const matchesProvince = !selectedProvince.value || inst.province === selectedProvince.value
    const matchesStatus = !selectedStatus.value || inst.application_status === selectedStatus.value

    return matchesSearch && matchesProvince && matchesStatus
  })
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedProvince.value = ''
  selectedStatus.value = ''
}

onMounted(() => {
  fetchInstitutions()
})
</script>

<template>
  <div class="container my-4">
    <h2 class="mb-4 fw-bold">South African Tertiary Institutions</h2>

    <!-- Search & Filter Bar -->
    <div class="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div class="row g-3">
        <!-- Search Field -->
        <div class="col-md-5">
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control" 
            placeholder="Search by institution name or type..."
          />
        </div>

        <!-- Province Dropdown -->
        <div class="col-md-3">
          <select v-model="selectedProvince" class="form-select">
            <option value="">All Provinces</option>
            <option v-for="prov in provinces" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>
        </div>

        <!-- Application Status Dropdown -->
        <div class="col-md-2">
          <select v-model="selectedStatus" class="form-select">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <!-- Reset Button -->
        <div class="col-md-2">
          <button @click="resetFilters" class="btn btn-outline-secondary w-100">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2 text-muted">Loading institutions database...</p>
    </div>

    <!-- Error Alert -->
    <div v-else-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <!-- Dynamic Card Grid -->
    <div v-else-if="filteredInstitutions.length > 0" class="row g-4">
      <div 
        v-for="item in filteredInstitutions" 
        :key="item.institution_id" 
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title h6 mb-0 fw-bold">{{ item.name }}</h5>
              <span 
                class="badge ms-2" 
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

    <!-- Empty Results Fallback -->
    <div v-else class="text-center my-5 text-muted">
      <h5>No institutions match your search criteria.</h5>
      <p>Try clearing your search terms or resetting filters.</p>
    </div>
  </div>
</template>
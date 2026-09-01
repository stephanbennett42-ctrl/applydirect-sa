<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

interface Institution {
  institution_id: number
  name: string
  institution_type: string
  province: string
  application_status: string
  application_fee: string
  website_url: string
  application_url?: string
}

const institutions = ref<Institution[]>([])
const loading = ref(true)
const activeModalItem = ref<Institution | null>(null)
const savedIds = ref<number[]>(JSON.parse(localStorage.getItem('saved_institutions') || '[]'))

const fetchInstitutions = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/institutions')
    if (res.ok) {
      const json = await res.json()
      if (json.success) institutions.value = json.data
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const removeBookmark = (id: number) => {
  savedIds.value = savedIds.value.filter(item => item !== id)
  localStorage.setItem('saved_institutions', JSON.stringify(savedIds.value))
  window.dispatchEvent(new Event('storage'))
}

const savedInstitutions = computed(() => {
  return institutions.value.filter(inst => savedIds.value.includes(inst.institution_id))
})

onMounted(() => {
  fetchInstitutions()
})
</script>

<template>
  <div class="container my-4">
    <h2 class="fw-bold mb-4">Your Saved Institutions ({{ savedInstitutions.length }})</h2>

    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="savedInstitutions.length > 0" class="row g-4">
      <div v-for="item in savedInstitutions" :key="item.institution_id" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title h6 mb-0 fw-bold">{{ item.name }}</h5>
              <button @click="removeBookmark(item.institution_id)" class="btn btn-sm btn-outline-danger ms-2">
                Remove
              </button>
            </div>
            <p class="text-muted small mb-2">{{ item.institution_type }} • {{ item.province }}</p>
            <p class="mb-3">
              <strong>Fee:</strong> 
              {{ Number(item.application_fee) === 0 ? 'Free' : `R${item.application_fee}` }}
            </p>
            <div class="d-flex gap-2 mt-auto">
              <button @click="activeModalItem = item" class="btn btn-sa-primary btn-sm flex-grow-1">
                View Details
              </button>
              <a 
                :href="item.application_url || item.website_url" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-sa-green btn-sm"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center my-5 text-muted">
      <h5>You haven't saved any institutions yet.</h5>
      <RouterLink to="/institutions" class="btn btn-sa-primary mt-3">Browse Institutions</RouterLink>
    </div>

    <!-- Details Modal -->
    <div v-if="activeModalItem" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5)">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ activeModalItem.name }}</h5>
            <button @click="activeModalItem = null" type="button" class="btn-close"></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Type:</strong> {{ activeModalItem.institution_type }}
              <span 
                class="badge ms-2" 
                :class="activeModalItem.institution_type.toLowerCase().includes('private') ? 'bg-warning text-dark' : 'bg-info text-dark'"
              >
                {{ activeModalItem.institution_type.toLowerCase().includes('private') ? 'Private' : 'Public' }}
              </span>
            </p>
            <p><strong>Province:</strong> {{ activeModalItem.province }}</p>
            <p>
              <strong>Status:</strong> 
              <span class="badge ms-2" :class="activeModalItem.application_status === 'Open' ? 'bg-success' : 'bg-danger'">
                {{ activeModalItem.application_status }}
              </span>
            </p>
            <p>
              <strong>Application Fee:</strong> 
              {{ Number(activeModalItem.application_fee) === 0 ? 'Free' : `R${activeModalItem.application_fee}` }}
            </p>
          </div>
          <div class="modal-footer">
            <a 
              :href="activeModalItem.application_url || activeModalItem.website_url" 
              target="_blank" 
              rel="noopener noreferrer" 
              class="btn btn-sa-green btn-sm"
            >
              Apply Now
            </a>
            <button @click="activeModalItem = null" class="btn btn-secondary btn-sm">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

interface Institution {
  institution_id: number;
  name: string;
  institution_type: string;
  province: string;
  application_status: string;
  application_fee: string;
  website_url: string;
  application_url?: string;
}

const institutions = ref<Institution[]>([]);
const loading = ref(true);
const errorMsg = ref("");

// Tab State: 'all' or 'saved'
const currentTab = ref<'all' | 'saved'>('all');

const searchQuery = ref("");
const selectedProvince = ref("");
const selectedStatus = ref("");
const activeModalItem = ref<Institution | null>(null);
const savedIds = ref<number[]>(
  JSON.parse(localStorage.getItem("saved_institutions") || "[]")
);

const fetchInstitutions = async () => {
  try {
    const res = await fetch("http://localhost:3000/api/institutions");
    if (!res.ok) throw new Error("Failed to fetch data from server");
    const json = await res.json();
    if (json.success) institutions.value = json.data;
  } catch (err: any) {
    errorMsg.value = err.message || "Error connecting to API";
  } finally {
    loading.value = false;
  }
};

const toggleBookmark = (id: number) => {
  if (savedIds.value.includes(id)) {
    savedIds.value = savedIds.value.filter((item) => item !== id);
  } else {
    savedIds.value.push(id);
  }
  localStorage.setItem("saved_institutions", JSON.stringify(savedIds.value));
  window.dispatchEvent(new Event("storage"));
};

const provinces = computed(() => {
  const list = institutions.value.map((i) => i.province);
  return [...new Set(list)].filter(Boolean).sort();
});

// Computed list that accounts for search filters AND current tab selection
const displayedInstitutions = computed(() => {
  return institutions.value.filter((inst) => {
    const matchesTab = currentTab.value === 'all' || savedIds.value.includes(inst.institution_id);
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inst.institution_type
        .toLowerCase()
        .includes(searchQuery.value.toLowerCase());
    const matchesProvince =
      !selectedProvince.value || inst.province === selectedProvince.value;
    const matchesStatus =
      !selectedStatus.value || inst.application_status === selectedStatus.value;

    return matchesTab && matchesSearch && matchesProvince && matchesStatus;
  });
});

const resetFilters = () => {
  searchQuery.value = "";
  selectedProvince.value = "";
  selectedStatus.value = "";
};

onMounted(() => {
  fetchInstitutions();
});
</script>

<template>
  <div class="container my-4">
    <!-- Sub-Navigation Bar for Universities Page -->
    <div class="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
      <h2 class="fw-bold mb-0" style="color: var(--sa-blue);">
        {{ currentTab === 'all' ? 'Tertiary Institutions' : 'Saved Institutions' }}
      </h2>
      <div class="btn-group" role="group">
        <button 
          @click="currentTab = 'all'" 
          class="btn btn-sm"
          :class="currentTab === 'all' ? 'btn-sa-primary' : 'btn-outline-secondary'"
        >
          All Universities ({{ institutions.length }})
        </button>
        <button 
          @click="currentTab = 'saved'" 
          class="btn btn-sm"
          :class="currentTab === 'saved' ? 'btn-sa-primary' : 'btn-outline-secondary'"
        >
          ★ Saved ({{ savedIds.length }})
        </button>
      </div>
    </div>

    <!-- Search & Filter Bar -->
    <div class="card p-3 mb-4 shadow-sm border-0 bg-light">
      <div class="row g-3">
        <div class="col-md-5">
          <input
            v-model="searchQuery"
            type="text"
            class="form-control"
            placeholder="Search by institution name or type..."
          />
        </div>
        <div class="col-md-3">
          <select v-model="selectedProvince" class="form-select">
            <option value="">All Provinces</option>
            <option v-for="prov in provinces" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <select v-model="selectedStatus" class="form-select">
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div class="col-md-2">
          <button @click="resetFilters" class="btn btn-outline-secondary w-100">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Loading & Error Displays -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>
    <div v-else-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <!-- Card Grid -->
    <div v-else-if="displayedInstitutions.length > 0" class="row g-4">
      <div
        v-for="item in displayedInstitutions"
        :key="item.institution_id"
        class="col-md-6 col-lg-4"
      >
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <h5 class="card-title h6 mb-0 fw-bold">{{ item.name }}</h5>
              <button
                @click="toggleBookmark(item.institution_id)"
                class="btn btn-sm p-0 border-0 ms-2"
              >
                <span class="fs-4 text-warning">{{
                  savedIds.includes(item.institution_id) ? "★" : "☆"
                }}</span>
              </button>
            </div>

            <p class="text-muted small mb-2">
              {{ item.institution_type }} • {{ item.province }}
            </p>
            <p class="mb-3">
              <strong>Fee:</strong>
              {{
                Number(item.application_fee) === 0
                  ? "Free"
                  : `R${item.application_fee}`
              }}
            </p>

            <div class="d-flex gap-2 mt-auto">
              <button
                @click="activeModalItem = item"
                class="btn btn-sa-primary btn-sm flex-grow-1"
              >
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

    <!-- Empty State -->
    <div v-else class="text-center my-5 text-muted">
      <h5 v-if="currentTab === 'saved' && savedIds.length === 0">
        You haven't saved any institutions yet. Click the star icon (☆) on any card to save it.
      </h5>
      <h5 v-else>
        No institutions match your search criteria.
      </h5>
    </div>

    <!-- Details Modal Overlay -->
    <div
      v-if="activeModalItem"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.5)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow">
          <div class="modal-header">
            <h5 class="modal-title fw-bold">{{ activeModalItem.name }}</h5>
            <button
              @click="activeModalItem = null"
              type="button"
              class="btn-close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              <strong>Type:</strong> {{ activeModalItem.institution_type }}
              <span
                class="badge ms-2"
                :class="
                  activeModalItem.institution_type
                    .toLowerCase()
                    .includes('private')
                    ? 'bg-warning text-dark'
                    : 'bg-info text-dark'
                "
              >
                {{
                  activeModalItem.institution_type
                    .toLowerCase()
                    .includes("private")
                    ? "Private"
                    : "Public"
                }}
              </span>
            </p>
            <p><strong>Province:</strong> {{ activeModalItem.province }}</p>
            <p>
              <strong>Status:</strong>
              <span
                class="badge ms-2"
                :class="
                  activeModalItem.application_status === 'Open'
                    ? 'bg-sa-green'
                    : 'bg-sa-red'
                "
              >
                {{ activeModalItem.application_status }}
              </span>
            </p>
            <p>
              <strong>Application Fee:</strong>
              {{
                Number(activeModalItem.application_fee) === 0
                  ? "Free"
                  : `R${activeModalItem.application_fee}`
              }}
            </p>
          </div>
          <div class="modal-footer">
            <a
              :href="
                activeModalItem.application_url || activeModalItem.website_url
              "
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-sa-green btn-sm"
            >
              Apply Now
            </a>
            <button
              @click="activeModalItem = null"
              class="btn btn-secondary btn-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
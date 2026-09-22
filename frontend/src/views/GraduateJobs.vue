<template>
  <div class="jobs-page">
    <div class="page-header">
      <h1>Graduate Jobs</h1>
      <p>Find opportunities matched to your field of study across South Africa.</p>
    </div>

    <div class="container">
      <!-- Match banner for logged-in users -->
      <div v-if="currentUser && currentUser.fieldOfStudy" class="match-banner">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>
          Showing jobs for <strong>{{ currentUser.fieldOfStudy }}</strong>.
          <button class="banner-link" @click="filterField = currentUser.fieldOfStudy">View matched jobs</button>
          <button class="banner-dismiss" @click="filterField = ''">Clear filter</button>
        </span>
      </div>

      <!-- 5% placement commission notice -->
      <div class="commission-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <span>
          <strong>Placement commission:</strong> when you're employed through ApplyDirect SA, a <strong>5%</strong> commission applies to your wages for <strong>up to 24 months</strong> from your employment start date. This is how we fund our services to graduates.
        </span>
      </div>

      <!-- Filters -->
      <div class="jobs-toolbar">
        <div class="filter-chips">
          <button :class="['chip', { active: !filterField && !filterType }]" @click="filterField = ''; filterType = ''">All Jobs</button>
          <button
            v-for="f in fields"
            :key="f.field"
            :class="['chip', { active: filterField === f.field }]"
            @click="filterField = f.field; filterType = ''"
          >
            {{ f.field }} <span class="chip-count">{{ f.count }}</span>
          </button>
        </div>

        <div class="type-filters">
          <button
            v-for="t in jobTypes"
            :key="t.value"
            :class="['chip chip-sm', { active: filterType === t.value }]"
            @click="filterType = filterType === t.value ? '' : t.value"
          >{{ t.label }}</button>
        </div>
      </div>

      <!-- Search bar -->
      <div class="jobs-search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by job title, company, location or keyword..."
          @input="debouncedSearch"
        />
      </div>

      <!-- Loading / Error / Empty states -->
      <p v-if="loading" class="jobs-note">Loading jobs...</p>
      <p v-else-if="loadError" class="jobs-note jobs-error">{{ loadError }}</p>
      <p v-else-if="filteredJobs.length === 0" class="jobs-note">
        No jobs found matching your criteria.
        <button v-if="filterField || filterType || searchQuery" class="clear-btn" @click="clearAll">Clear all filters</button>
      </p>

      <!-- Job cards -->
      <div v-else class="jobs-grid">
        <div v-for="job in filteredJobs" :key="job.id" class="job-card" @click="openJob(job)">
          <div class="job-head">
            <div class="job-title-row">
              <h3 class="job-title">{{ job.title }}</h3>
              <span :class="['job-type-badge', 'type-' + job.type]">{{ job.type }}</span>
            </div>
            <p class="job-company">{{ job.company }}</p>
          </div>

          <div class="job-details">
            <div class="job-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ job.location || 'South Africa' }}</span>
            </div>
            <div v-if="job.salary" class="job-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span>{{ job.salary }}</span>
            </div>
            <div class="job-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <span>{{ job.field }}</span>
            </div>
          </div>

          <p class="job-excerpt">{{ truncate(job.description, 120) }}</p>

          <div class="job-footer">
            <div class="job-footer-left">
              <span class="job-date">Posted {{ formatDate(job.postedDate) }}</span>
              <button v-if="hasApplied(job.id)" class="job-applied" disabled>Applied</button>
              <button v-else class="job-apply" @click.stop="openApply(job)">Apply Now</button>
            </div>
            <span class="job-view-link">View Details
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </div>
        </div>
      </div>

      <!-- Job detail modal -->
      <div v-if="selectedJob" class="modal-overlay" @click.self="selectedJob = null">
        <div class="modal-card">
          <button class="modal-close" @click="selectedJob = null">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div class="modal-head">
            <h2>{{ selectedJob.title }}</h2>
            <p class="modal-company">{{ selectedJob.company }}</p>
          </div>

          <div class="modal-meta">
            <span :class="['job-type-badge', 'type-' + selectedJob.type]">{{ selectedJob.type }}</span>
            <span class="modal-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ selectedJob.location || 'South Africa' }}
            </span>
            <span v-if="selectedJob.salary" class="modal-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              {{ selectedJob.salary }}
            </span>
            <span class="modal-detail">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              {{ selectedJob.field }}
            </span>
          </div>

          <div class="modal-body">
            <p>{{ selectedJob.description }}</p>
          </div>

          <div class="modal-footer">
            <span class="modal-date">Posted {{ formatDate(selectedJob.postedDate) }}</span>
          </div>
        </div>
      </div>

      <!-- My applications -->
      <div v-if="currentUser" class="my-apps">
        <h3 class="my-apps-heading">My Applications</h3>
        <p v-if="loadingApps" class="jobs-note">Loading your applications...</p>
        <p v-else-if="myApplications.length === 0" class="jobs-note">You haven't applied to any jobs yet.</p>
        <div v-else class="my-apps-list">
          <div v-for="app in myApplications" :key="app.id" class="my-app-item">
            <div class="my-app-info">
              <strong>{{ app.job.title }}</strong>
              <span class="my-app-company">{{ app.job.company }} — {{ app.job.location || 'South Africa' }}</span>
            </div>
            <span :class="['apply-status', 'apply-status-' + app.status]">{{ app.status }}</span>
            <span class="my-app-date">Applied {{ formatDate(app.appliedDate) }}</span>
          </div>
        </div>
      </div>

      <!-- Job application form modal -->
      <div v-if="applyingJob" class="modal-overlay" @click.self="closeApply">
        <div class="modal-card apply-card">
          <button class="modal-close" @click="closeApply">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <div v-if="applySuccess" class="apply-success">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <h3>Application submitted!</h3>
            <p>Your application for <strong>{{ applyingJob.title }}</strong> at {{ applyingJob.company }} has been received and sent to the recruiter.</p>
            <button class="btn btn-primary" @click="closeApply">Done</button>
          </div>

          <form v-else @submit.prevent="submitApplication" class="apply-form">
            <div class="modal-head">
              <h2>Apply for {{ applyingJob.title }}</h2>
              <p class="modal-company">{{ applyingJob.company }} · {{ applyingJob.location || 'South Africa' }}</p>
            </div>

            <div class="form-row-2">
              <div class="field">
                <label>Full name *</label>
                <input v-model="applyForm.fullName" @input="applyForm.fullName = sanitizeName(applyForm.fullName)" placeholder="Your full name" required />
              </div>
              <div class="field">
                <label>Email *</label>
                <input type="email" v-model="applyForm.email" placeholder="you@email.com" required />
              </div>
            </div>
            <div class="form-row-2">
              <div class="field">
                <label>Phone</label>
                <input v-model="applyForm.phone" placeholder="e.g. 067 802 0783" />
              </div>
              <div class="field">
                <label>University</label>
                <input v-model="applyForm.university" placeholder="Where are you studying?" />
              </div>
            </div>
            <div class="field">
              <label>Field of study</label>
              <input v-model="applyForm.fieldOfStudy" placeholder="e.g. Information Technology & Computer Science" />
            </div>
            <div class="field">
              <label>Cover letter * <span class="field-hint">Why are you a good fit for this role?</span></label>
              <textarea v-model="applyForm.coverLetter" rows="5" placeholder="Tell the recruiter about yourself..." required></textarea>
            </div>
            <div class="field">
              <label>Experience / notes <span class="field-hint">Optional — relevant experience, availability, projects...</span></label>
              <textarea v-model="applyForm.experience" rows="3"></textarea>
            </div>

            <p v-if="applyError" class="apply-error">{{ applyError }}</p>

            <div class="modal-footer">
              <div class="apply-actions">
                <button class="btn btn-primary" type="submit" :disabled="applying">
                  {{ applying ? 'Submitting...' : 'Submit Application' }}
                </button>
                <button class="btn btn-ghost" type="button" @click="closeApply">Cancel</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { jobsAPI } from '../store/api.js'
import { getCurrentUser } from '../store/auth.js'

export default {
  name: 'GraduateJobs',
  data() {
    return {
      currentUser: getCurrentUser(),
      jobs: [],
      fields: [],
      filterField: '',
      filterType: '',
      searchQuery: '',
      loading: true,
      loadError: '',
      selectedJob: null,
      searchTimer: null,
      applyingJob: null,
      applyForm: { fullName: '', email: '', phone: '', university: '', fieldOfStudy: '', coverLetter: '', experience: '' },
      applying: false,
      applyError: '',
      applySuccess: false,
      myApplications: [],
      loadingApps: false,
      jobTypes: [
        { value: 'full-time', label: 'Full-time' },
        { value: 'part-time', label: 'Part-time' },
        { value: 'internship', label: 'Internship' },
        { value: 'contract', label: 'Contract' }
      ]
    }
  },
  computed: {
    filteredJobs() {
      return this.jobs.filter(job => {
        const matchesField = !this.filterField || job.field === this.filterField
        const matchesType = !this.filterType || job.type === this.filterType
        return matchesField && matchesType
      })
    },
    appliedJobIds() {
      return this.myApplications.map(a => a.jobId)
    }
  },
  mounted() {
    this.loadJobs()
    this.loadFields()
    this.loadMyApplications()
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer)
  },
  methods: {
    async loadJobs() {
      this.loading = true
      this.loadError = ''
      try {
        this.jobs = await jobsAPI.getAll()
      } catch (err) {
        this.loadError = err.error || 'Could not load jobs. Please try again.'
      } finally {
        this.loading = false
      }
    },
    async loadFields() {
      try {
        this.fields = await jobsAPI.getFields()
      } catch {
        // silently fail — not critical
      }
    },
    debouncedSearch() {
      clearTimeout(this.searchTimer)
      this.searchTimer = setTimeout(async () => {
        if (!this.searchQuery.trim()) {
          await this.loadJobs()
          return
        }
        this.loading = true
        try {
          this.jobs = await jobsAPI.getAll({ q: this.searchQuery.trim() })
        } catch (err) {
          this.loadError = err.error || 'Search failed'
        } finally {
          this.loading = false
        }
      }, 350)
    },
    openJob(job) {
      this.selectedJob = job
    },
    hasApplied(jobId) {
      return this.appliedJobIds.includes(jobId)
    },
    async loadMyApplications() {
      if (!this.currentUser) return
      this.loadingApps = true
      try {
        this.myApplications = await jobsAPI.getMyApplications()
      } catch {
        // silently fail — the apply buttons stay enabled
      } finally {
        this.loadingApps = false
      }
    },
    sanitizeName(v) {
      // Letters only (incl. accented letters), spaces, hyphens, apostrophes and dots.
      return v.replace(/[^A-Za-z\u00C0-\u024F'\- .]/g, '').replace(/\s{2,}/g, ' ')
    },
    openApply(job) {
      if (!this.currentUser) {
        this.$router.push('/login')
        return
      }
      this.applyForm = {
        fullName: `${this.currentUser.firstName || ''} ${this.currentUser.lastName || ''}`.trim(),
        email: this.currentUser.email || '',
        phone: this.currentUser.phone || '',
        university: this.currentUser.university || '',
        fieldOfStudy: this.currentUser.fieldOfStudy || '',
        coverLetter: '',
        experience: ''
      }
      this.applyError = ''
      this.applySuccess = false
      this.applyingJob = job
    },
    closeApply() {
      this.applyingJob = null
      this.applyError = ''
      this.applySuccess = false
    },
    async submitApplication() {
      this.applying = true
      this.applyError = ''
      try {
        await jobsAPI.apply(this.applyingJob.id, { ...this.applyForm })
        this.applySuccess = true
        await this.loadMyApplications()
      } catch (err) {
        this.applyError = err.error || 'Could not submit your application. Please try again.'
      } finally {
        this.applying = false
      }
    },
    clearAll() {
      this.filterField = ''
      this.filterType = ''
      this.searchQuery = ''
      this.loadJobs()
    },
    truncate(text, len) {
      if (!text) return ''
      return text.length > len ? text.slice(0, len) + '...' : text
    },
    formatDate(d) {
      if (!d) return 'recently'
      const diff = Date.now() - new Date(d).getTime()
      const days = Math.floor(diff / 86400000)
      if (days === 0) return 'today'
      if (days === 1) return 'yesterday'
      if (days < 7) return days + ' days ago'
      if (days < 30) return Math.floor(days / 7) + ' week' + (Math.floor(days / 7) > 1 ? 's' : '') + ' ago'
      return new Date(d).toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }
}
</script>

<style scoped>
.match-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: var(--primary-50);
  border: 1px solid var(--primary-100);
  border-radius: var(--radius-md);
  margin-top: 32px;
  font-size: 0.88rem;
  color: var(--primary-dark);
}

.match-banner svg {
  flex-shrink: 0;
  color: var(--primary);
}

.banner-link {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  font-size: inherit;
}

.banner-dismiss {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.82rem;
  margin-left: 8px;
}

.banner-dismiss:hover {
  color: var(--text);
}

.commission-banner {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 18px;
  background: #fdf6ec;
  border: 1px solid #f0ddc0;
  border-radius: var(--radius-md);
  margin-top: 14px;
  font-size: 0.85rem;
  color: #7a4a12;
  line-height: 1.5;
}

.commission-banner svg {
  flex-shrink: 0;
  margin-top: 2px;
  color: #b06a18;
}

.commission-banner strong {
  color: #5c350b;
}

.jobs-toolbar {
  margin-top: 24px;
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.chip {
  padding: 7px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-light);
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.chip.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.chip:hover:not(.active) {
  border-color: var(--primary-light);
  color: var(--primary);
}

.chip-count {
  background: rgba(0,0,0,0.08);
  padding: 1px 7px;
  border-radius: 999px;
  font-size: 0.72rem;
  margin-left: 4px;
}

.chip.active .chip-count {
  background: rgba(255,255,255,0.25);
}

.type-filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chip-sm {
  font-size: 0.75rem;
  padding: 5px 12px;
}

.jobs-search {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 16px;
  margin: 20px 0 24px;
}

.jobs-search svg {
  flex-shrink: 0;
  color: var(--text-muted);
}

.jobs-search input {
  flex: 1;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  background: transparent;
}

.jobs-search input:focus {
  outline: none;
  box-shadow: none;
}

.jobs-note {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 60px 0;
}

.jobs-error {
  color: var(--accent);
}

.clear-btn {
  background: none;
  border: none;
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
  font-size: inherit;
  margin-left: 6px;
}

.jobs-grid {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 64px;
}

.job-card {
  background: var(--bg);
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px 28px;
  cursor: pointer;
  transition: var(--transition);
}

.job-card:hover {
  border-color: var(--primary-light);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.job-head {
  margin-bottom: 14px;
}

.job-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
}

.job-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--primary-dark);
  margin: 0;
}

.job-type-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
  flex-shrink: 0;
}

.type-full-time {
  background: var(--success-light);
  color: var(--success);
}

.type-part-time {
  background: var(--primary-50);
  color: var(--primary);
}

.type-internship {
  background: var(--gold-light);
  color: var(--primary-dark);
}

.type-contract {
  background: var(--accent-50);
  color: var(--accent);
}

.job-company {
  font-size: 0.88rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0;
}

.job-details {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.job-detail {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  color: var(--text-light);
}

.job-detail svg {
  color: var(--text-muted);
  flex-shrink: 0;
}

.job-excerpt {
  font-size: 0.85rem;
  color: var(--text-light);
  line-height: 1.6;
  margin-bottom: 14px;
}

.job-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.job-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.job-view-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--primary);
}

.job-footer-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.job-apply {
  padding: 6px 16px;
  border: none;
  border-radius: 999px;
  background: var(--primary);
  color: var(--text-white);
  font-weight: 700;
  font-size: 0.78rem;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
}

.job-apply:hover {
  background: var(--primary-dark);
}

.job-applied {
  padding: 6px 14px;
  border: 1px solid var(--success);
  background: var(--success-light);
  color: var(--success);
  font-weight: 700;
  font-size: 0.75rem;
  border-radius: 999px;
  cursor: default;
}

/* Apply form */
.apply-form .field {
  margin-bottom: 14px;
}

.apply-form .form-row-2 {
  display: flex;
  gap: 14px;
}

.apply-form .form-row-2 .field {
  flex: 1;
  margin-bottom: 14px;
}

.field-hint {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-weight: 400;
}

.apply-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.apply-error {
  color: var(--accent);
  font-size: 0.85rem;
  margin: 8px 0 12px;
}

.apply-success {
  text-align: center;
  padding: 24px 8px;
}

.apply-success svg {
  color: var(--success);
}

.apply-success h3 {
  margin: 12px 0 8px;
  color: var(--primary-dark);
}

.apply-success p {
  color: var(--text-secondary);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* My applications */
.my-apps {
  margin: 40px 0 64px;
  border-top: 1px solid var(--border-light);
  padding-top: 24px;
}

.my-apps-heading {
  font-size: 1.05rem;
  color: var(--primary-dark);
  margin-bottom: 16px;
}

.my-apps-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.my-app-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 18px;
  border: 1.5px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--bg);
  flex-wrap: wrap;
}

.my-app-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.my-app-info strong {
  color: var(--primary-dark);
  font-size: 0.92rem;
}

.my-app-company {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.my-app-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.apply-status {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  white-space: nowrap;
}

.apply-status-pending {
  background: #fdf0e3;
  color: #8a4b0a;
}

.apply-status-shortlisted {
  background: #e0f2ff;
  color: #0a6fb0;
}

.apply-status-hired {
  background: #e3f5e9;
  color: #1a7f37;
}

.apply-status-rejected {
  background: #fde8e8;
  color: #b00a1f;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}

.modal-card {
  background: var(--bg);
  border-radius: var(--radius-md);
  max-width: 600px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  padding: 32px;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
}

.modal-close:hover {
  color: var(--text);
}

.modal-head {
  margin-bottom: 16px;
}

.modal-head h2 {
  font-size: 1.35rem;
  margin-bottom: 4px;
}

.modal-company {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 600;
  margin: 0;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

.modal-detail {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.82rem;
  color: var(--text-light);
}

.modal-body p {
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-secondary);
}

.modal-footer {
  margin-top: 24px;
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
}

.modal-date {
  font-size: 0.78rem;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .job-title-row {
    flex-direction: column;
    gap: 8px;
  }

  .modal-card {
    padding: 24px;
  }

  .apply-form .form-row-2 {
    flex-direction: column;
    gap: 0;
  }
}
</style>

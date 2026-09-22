<template>
  <div class="admin-page">
    <header class="admin-nav">
      <div class="admin-nav-inner">
        <span class="admin-nav-brand">ApplyDirect <span>SA</span> Admin</span>
        <div class="admin-nav-right">
          <span class="admin-nav-user">Hi, {{ adminName }}</span>
          <a class="admin-nav-btn" :href="userUrl">User Login</a>
          <button class="admin-nav-btn" @click="handleLogout">Sign Out</button>
        </div>
      </div>
    </header>
    <div class="page-header">
      <h1>Admin Dashboard</h1>
      <p>Approve students, manage subscription plans, and monitor orders.</p>
    </div>

    <div class="container">
      <!-- Stats overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Total Students</span>
          <span class="stat-value">{{ students.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Pending Approval</span>
          <span class="stat-value stat-pending">{{ countStatus('pending') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Approved</span>
          <span class="stat-value stat-approved">{{ countStatus('approved') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Rejected</span>
          <span class="stat-value stat-rejected">{{ countStatus('rejected') }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Active Plans</span>
          <span class="stat-value">{{ packages.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Orders</span>
          <span class="stat-value">{{ orders.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Job Applications</span>
          <span class="stat-value">{{ applications.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Revenue (paid)</span>
          <span class="stat-value">R {{ totalRevenue }}</span>
        </div>
      </div>

      <!-- Tabs -->
      <div class="admin-tabs">
        <button :class="['admin-tab', { active: tab === 'students' }]" @click="tab = 'students'">Students</button>
        <button :class="['admin-tab', { active: tab === 'plans' }]" @click="tab = 'plans'">Subscription Plans</button>
        <button :class="['admin-tab', { active: tab === 'orders' }]" @click="tab = 'orders'">Orders</button>
        <button :class="['admin-tab', { active: tab === 'admins' }]" @click="tab = 'admins'">Admins</button>
        <button :class="['admin-tab', { active: tab === 'jobs' }]" @click="tab = 'jobs'">Graduate Jobs</button>
        <button :class="['admin-tab', { active: tab === 'placements' }]" @click="tab = 'placements'">Placements</button>
        <button :class="['admin-tab', { active: tab === 'applications' }]" @click="tab = 'applications'">Applications</button>
        <button :class="['admin-tab', { active: tab === 'messages' }]" @click="tab = 'messages'">WhatsApp</button>
      </div>

      <div v-if="message" class="alert admin-alert">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>{{ message }}</span>
      </div>

      <!-- Students tab -->
      <div v-if="tab === 'students'">
        <div class="toolbar">
          <input
            type="text"
            class="search-input"
            v-model="search"
            placeholder="Search by name or email..."
          />
          <div class="filter-chips">
            <button
              v-for="f in ['all', 'pending', 'approved', 'rejected']"
              :key="f"
              :class="['chip', { active: filter === f }]"
              @click="filter = f"
            >{{ f }}</button>
          </div>
        </div>

        <p v-if="loadingUsers" class="admin-note">Loading students...</p>
        <p v-else-if="filteredStudents.length === 0" class="admin-note">No students match your search.</p>

        <div v-else class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>University</th>
                <th>Status</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in filteredStudents" :key="u.id">
                <td>
                  <strong>{{ u.firstName }} {{ u.lastName }}</strong>
                  <span v-if="u.role === 'admin'" class="role-badge">Admin</span>
                </td>
                <td>{{ u.email }}</td>
                <td>{{ u.phone || '—' }}</td>
                <td>{{ u.university || '—' }}</td>
                <td>
                  <span :class="['status-badge', 'status-' + u.status]">{{ u.status }}</span>
                </td>
                <td class="col-actions">
                  <template v-if="u.role !== 'admin'">
                    <button
                      v-if="u.status !== 'approved'"
                      class="btn btn-primary btn-small icon-btn"
                      @click="setUserStatus(u, 'approved')"
                      :disabled="busyId === u.id"
                      aria-label="Approve"
                      title="Approve"
                    >
                      <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Approve
                    </button>
                    <button
                      v-if="u.status !== 'rejected'"
                      class="btn btn-accent btn-small icon-btn"
                      @click="setUserStatus(u, 'rejected')"
                      :disabled="busyId === u.id"
                      aria-label="Reject"
                      title="Reject"
                    >
                      <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Reject
                    </button>
                    <button
                      v-else
                      class="btn btn-ghost btn-small icon-btn"
                      @click="setUserStatus(u, 'pending')"
                      :disabled="busyId === u.id"
                      aria-label="Reset to pending"
                      title="Reset to pending"
                    >
                      <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                      Reset
                    </button>
                  </template>
                  <span v-else class="admin-note">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Admins tab -->
      <div v-if="tab === 'admins'">
        <p class="admin-note">Create new admin logins directly. Created accounts are approved immediately and can sign in using the credentials you set here.</p>

        <div class="panel-card">
          <h3 class="panel-title">Create New Admin</h3>
          <form @submit.prevent="createAdmin" class="admin-form">
            <div class="form-row-3">
              <div class="field"><label>First name</label><input v-model="adminForm.firstName" @input="adminForm.firstName = sanitizeName(adminForm.firstName)" placeholder="First name" required /></div>
              <div class="field"><label>Last name</label><input v-model="adminForm.lastName" @input="adminForm.lastName = sanitizeName(adminForm.lastName)" placeholder="Last name" required /></div>
              <div class="field"><label>Email</label><input type="email" v-model="adminForm.email" placeholder="admin@example.com" required /></div>
            </div>
            <div class="field" style="max-width:320px;">
              <label>Password</label>
              <input v-model="adminForm.password" placeholder="Min 6 characters" required minlength="6" />
            </div>
            <button class="btn btn-primary btn-small" :disabled="creatingAdmin" type="submit">
              {{ creatingAdmin ? 'Creating...' : 'Create Admin' }}
            </button>
          </form>

          <div v-if="adminCreated" class="alert success-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Admin created — login: <strong>{{ adminCreated.email }}</strong> / {{ adminCreated.password }}</span>
          </div>
        </div>

        <div class="table-wrap" style="margin-top:24px;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in admins" :key="a.id">
                <td><strong>{{ a.firstName }} {{ a.lastName }}</strong></td>
                <td>{{ a.email }}</td>
                <td><span :class="['status-badge', 'status-' + a.status]">{{ a.status }}</span></td>
                <td>{{ formatDate(a.registeredDate) }}</td>
                <td class="col-actions">
                  <button class="btn btn-ghost btn-small" title="Edit login details" @click="startEditAdmin(a)">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Edit admin login modal -->
      <div v-if="editingAdmin" class="admin-modal-overlay" @click.self="closeEditAdmin">
        <div class="admin-modal">
          <button class="admin-modal-close" @click="closeEditAdmin">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <h3 class="panel-title">Edit Admin Login</h3>
          <p class="admin-note" style="margin-bottom:16px;">Update {{ editingAdmin.firstName }} {{ editingAdmin.lastName }}'s login details. Leave the password blank to keep the current one.</p>

          <form @submit.prevent="saveAdminEdit" class="admin-form">
            <div class="form-row-2">
              <div class="field"><label>First name</label><input v-model="editingAdmin.firstName" @input="editingAdmin.firstName = sanitizeName(editingAdmin.firstName)" required /></div>
              <div class="field"><label>Last name</label><input v-model="editingAdmin.lastName" @input="editingAdmin.lastName = sanitizeName(editingAdmin.lastName)" required /></div>
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" v-model="editingAdmin.email" required />
            </div>
            <div class="field">
              <label>New password <span class="field-hint">Blank = keep current</span></label>
              <input v-model="editingAdmin.password" type="password" placeholder="Min 6 characters (blank keeps current)" minlength="6" autocomplete="new-password" />
            </div>
            <p v-if="editAdminError" class="admin-error">{{ editAdminError }}</p>
            <div class="form-actions">
              <button class="btn btn-primary btn-small" type="submit" :disabled="savingAdminEdit">
                {{ savingAdminEdit ? 'Saving...' : 'Save Changes' }}
              </button>
              <button class="btn btn-ghost btn-small" type="button" @click="closeEditAdmin">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Job Applications tab -->
      <div v-if="tab === 'applications'">
        <p class="admin-note">Job applications submitted by students from the Graduate Jobs page. Review, shortlist, hire or reject each applicant.</p>

        <p v-if="loadingApplications" class="admin-note">Loading applications...</p>
        <p v-else-if="applications.length === 0" class="admin-note">No job applications yet. Applications appear here when students apply on the site.</p>

        <div v-else class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Job</th>
                <th>Location</th>
                <th>Applied</th>
                <th>Status</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in applications" :key="a.id">
                <td>
                  <strong>{{ a.fullName }}</strong>
                  <span class="sub-cell">{{ a.email }}<template v-if="a.phone"> · {{ a.phone }}</template></span>
                  <span v-if="a.university" class="sub-cell">{{ a.university }}<template v-if="a.fieldOfStudy"> — {{ a.fieldOfStudy }}</template></span>
                </td>
                <td>
                  <strong>{{ a.jobTitle }}</strong>
                  <span class="sub-cell">{{ a.company }}</span>
                </td>
                <td>{{ a.location || '—' }}</td>
                <td>{{ formatDate(a.appliedDate) }}</td>
                <td>
                  <span :class="['status-badge', appStatusClass(a.status)]">{{ a.status }}</span>
                </td>
                <td class="col-actions">
                  <button class="btn btn-ghost btn-small" title="View application" @click="selectedApplication = a">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    View
                  </button>
                  <button v-if="a.status !== 'shortlisted'" class="btn btn-primary btn-small" @click="setApplicationStatus(a, 'shortlisted')" :disabled="savingApplicationId === a.id">Shortlist</button>
                  <button v-if="a.status !== 'hired'" class="btn btn-primary btn-small" @click="setApplicationStatus(a, 'hired')" :disabled="savingApplicationId === a.id">Hire</button>
                  <button v-if="a.status !== 'rejected'" class="btn btn-accent btn-small" @click="setApplicationStatus(a, 'rejected')" :disabled="savingApplicationId === a.id">Reject</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Application detail modal -->
      <div v-if="selectedApplication" class="admin-modal-overlay" @click.self="selectedApplication = null">
        <div class="admin-modal admin-modal-wide">
          <button class="admin-modal-close" @click="selectedApplication = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>

          <h3 class="panel-title">{{ selectedApplication.jobTitle }} <span class="field-hint">at {{ selectedApplication.company }}</span></h3>
          <p class="admin-note">Applied {{ formatDate(selectedApplication.appliedDate) }} · Status:
            <span :class="['status-badge', appStatusClass(selectedApplication.status)]">{{ selectedApplication.status }}</span>
          </p>

          <div class="app-detail-grid">
            <div class="field">
              <label>Full name</label>
              <p class="app-detail-text">{{ selectedApplication.fullName }}</p>
            </div>
            <div class="field">
              <label>Email</label>
              <p class="app-detail-text">{{ selectedApplication.email }}</p>
            </div>
            <div class="field">
              <label>Phone</label>
              <p class="app-detail-text">{{ selectedApplication.phone || '—' }}</p>
            </div>
            <div class="field">
              <label>University</label>
              <p class="app-detail-text">{{ selectedApplication.university || '—' }}</p>
            </div>
            <div class="field">
              <label>Field of study</label>
              <p class="app-detail-text">{{ selectedApplication.fieldOfStudy || '—' }}</p>
            </div>
            <div class="field">
              <label>Location</label>
              <p class="app-detail-text">{{ selectedApplication.location || '—' }}</p>
            </div>
          </div>

          <div class="field">
            <label>Cover letter</label>
            <p class="app-detail-text app-detail-block">{{ selectedApplication.coverLetter }}</p>
          </div>
          <div class="field" v-if="selectedApplication.experience">
            <label>Experience / notes</label>
            <p class="app-detail-text app-detail-block">{{ selectedApplication.experience }}</p>
          </div>

          <div class="form-actions" style="margin-top:16px;">
            <button v-if="selectedApplication.status !== 'shortlisted'" class="btn btn-primary btn-small" @click="setApplicationStatus(selectedApplication, 'shortlisted'); selectedApplication = null">Shortlist</button>
            <button v-if="selectedApplication.status !== 'hired'" class="btn btn-primary btn-small" @click="setApplicationStatus(selectedApplication, 'hired'); selectedApplication = null">Mark Hired</button>
            <button v-if="selectedApplication.status !== 'rejected'" class="btn btn-accent btn-small" @click="setApplicationStatus(selectedApplication, 'rejected'); selectedApplication = null">Reject</button>
            <button class="btn btn-ghost btn-small" @click="selectedApplication = null">Close</button>
          </div>
        </div>
      </div>

      <!-- WhatsApp Messages tab -->
      <div v-if="tab === 'messages'">
        <p class="admin-note">Compose a message, pick a student, and WhatsApp opens with it pre-filled — just press send. Works for any number, no API account needed.</p>

        <div class="panel-card">
          <h3 class="panel-title">Send Message on WhatsApp</h3>

          <div class="field" style="max-width:520px;">
            <label>Student</label>
            <select v-model="msgUserId" @change="onSelectStudent">
              <option value="" disabled>Select a student...</option>
              <option v-for="u in students" :key="u.id" :value="u.id">
                {{ u.firstName }} {{ u.lastName }} — {{ u.phone || 'no phone' }}
              </option>
            </select>
          </div>

          <div class="field" style="max-width:520px;">
            <label>Phone number (WhatsApp)</label>
            <input v-model="msgPhone" placeholder="e.g. 067 802 0783" />
          </div>

          <div class="field">
            <label>Message</label>
            <textarea v-model="msgText" rows="4" placeholder="Type your message here..."></textarea>
          </div>

          <button class="btn btn-primary btn-small" @click="openWhatsApp" :disabled="msgBusy || !msgPhone.trim() || !msgText.trim()">
            <span v-if="msgBusy">Opening WhatsApp...</span>
            <span v-else>Open WhatsApp</span>
          </button>

          <div v-if="msgError" class="alert admin-alert msg-error" style="margin-top:14px;">
            {{ msgError }}
          </div>
        </div>
      </div>

      <!-- Plans tab -->
      <div v-if="tab === 'plans'">
        <p v-if="loadingPackages" class="admin-note">Loading plans...</p>

        <div v-else class="plans-list">
          <div v-for="p in packages" :key="p.id" class="plan-edit-card">
            <div class="plan-edit-head">
              <h3>#{{ p.id }} — {{ p.name }}</h3>
              <label class="check-label">
                <input type="checkbox" v-model="p.highlighted" />
                <span>Featured</span>
              </label>
            </div>

            <div class="form-row-3">
              <div class="field">
                <label>Name</label>
                <input type="text" v-model="p.name" />
              </div>
              <div class="field">
                <label>Price (Rands)</label>
                <input type="number" v-model.number="p.price" min="0" step="0.01" />
              </div>
              <div class="field">
                <label>Max Universities</label>
                <input type="number" v-model.number="p.maxUniversities" min="1" />
              </div>
            </div>

            <div class="field">
              <label>Description</label>
              <input type="text" v-model="p.description" />
            </div>

            <div class="field">
              <label>Features (one per line)</label>
              <textarea v-model="featuresText[p.id]" rows="5"></textarea>
            </div>

            <button
              class="btn btn-primary btn-small"
              @click="savePackage(p)"
              :disabled="busyId === p.id"
            >{{ busyId === p.id ? 'Saving...' : 'Save Changes' }}</button>
          </div>
        </div>
      </div>

      <!-- Orders tab -->
      <div v-if="tab === 'orders'">
        <p v-if="loadingOrders" class="admin-note">Loading orders...</p>
        <p v-else-if="orders.length === 0" class="admin-note">No orders have been placed yet.</p>

        <div v-else class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Student</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in orders" :key="o.id">
                <td>{{ o.id }}</td>
                <td>{{ o.studentName }}</td>
                <td>{{ o.studentEmail }}</td>
                <td>{{ o.packageName }}</td>
                <td>R {{ o.amount }}</td>
                <td>{{ o.paymentMethod || '—' }}</td>
                <td>
                  <span :class="['status-badge', 'status-' + o.status]">{{ o.status }}</span>
                </td>
                <td>{{ formatDate(o.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Graduate Jobs tab -->
      <div v-if="tab === 'jobs'">
        <p class="admin-note">Manage graduate job listings shown on the public site. Students browse these by their field of study.</p>

        <div class="panel-card">
          <h3 class="panel-title">{{ editingJobId ? 'Edit Job' : 'Add New Job' }}</h3>
          <form @submit.prevent="saveJob" class="admin-form">
            <div class="form-row-2">
              <div class="field">
                <label>Job Title *</label>
                <input v-model="jobForm.title" placeholder="e.g. Junior Software Developer" required />
              </div>
              <div class="field">
                <label>Company *</label>
                <input v-model="jobForm.company" placeholder="e.g. AfroSoft Solutions" required />
              </div>
            </div>
            <div class="form-row-2">
              <div class="field">
                <label>Location</label>
                <input v-model="jobForm.location" placeholder="e.g. Cape Town" />
              </div>
              <div class="field">
                <label>Salary</label>
                <input v-model="jobForm.salary" placeholder="e.g. R 240,000 – R 340,000 p/a" />
              </div>
            </div>
            <div class="form-row-2">
              <div class="field">
                <label>Field of Study *</label>
                <select v-model="jobForm.field" required>
                  <option value="" disabled>Select field...</option>
                  <option v-for="f in fieldOptions" :key="f" :value="f">{{ f }}</option>
                </select>
              </div>
              <div class="field">
                <label>Type</label>
                <select v-model="jobForm.type">
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="internship">Internship</option>
                  <option value="contract">Contract</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label>Description</label>
              <textarea v-model="jobForm.description" rows="4" placeholder="Describe the role and what they'll do..."></textarea>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary btn-small" type="submit" :disabled="savingJob">
                {{ savingJob ? 'Saving...' : editingJobId ? 'Save Changes' : 'Publish Job' }}
              </button>
              <button v-if="editingJobId" class="btn btn-ghost btn-small" type="button" @click="resetJobForm">Cancel</button>
            </div>
          </form>
        </div>

        <p v-if="loadingJobs" class="admin-note">Loading jobs...</p>
        <p v-else-if="jobs.length === 0" class="admin-note">No jobs yet. Add your first listing above.</p>

        <div v-else class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Company</th>
                <th>Field</th>
                <th>Type</th>
                <th>Status</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="j in jobs" :key="j.id">
                <td>{{ j.id }}</td>
                <td><strong>{{ j.title }}</strong></td>
                <td>{{ j.company }}</td>
                <td>{{ j.field }}</td>
                <td>{{ j.type }}</td>
                <td>
                  <span :class="['status-badge', j.active ? 'status-approved' : 'status-pending']">{{ j.active ? 'Live' : 'Hidden' }}</span>
                </td>
                <td class="col-actions">
                  <button class="btn btn-ghost btn-small" title="Edit" @click="startEditJob(j)">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn btn-accent btn-small" title="Delete" @click="removeJob(j)" :disabled="busyId === j.id">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Placements tab -->
      <div v-if="tab === 'placements'">
        <div class="banner-info">
          <strong>5% Commission Model:</strong> once a graduate is placed through ApplyDirect SA, 5% of their annual salary is billed monthly for up to 24 months from their employment start date. Commission stops automatically after 2 years.
        </div>

        <div class="stats-grid placement-stats">
          <div class="stat-card">
            <span class="stat-label">Placements</span>
            <span class="stat-value">{{ placements.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Collecting Now</span>
            <span class="stat-value">{{ placementStatusCount('active') }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Completed (2 yrs)</span>
            <span class="stat-value">{{ placementStatusCount('completed') }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Commission Earned</span>
            <span class="stat-value">R {{ placementTotal }}</span>
          </div>
        </div>

        <div class="panel-card">
          <h3 class="panel-title">{{ editingPlacementId ? 'Edit Placement' : 'Record New Placement' }}</h3>
          <form @submit.prevent="savePlacement" class="admin-form">
            <div class="form-row-2">
              <div class="field">
                <label>Student *</label>
                <select v-model="placementForm.studentId" required :disabled="!!editingPlacementId">
                  <option value="" disabled>Select student...</option>
                  <option v-for="s in students" :key="s.id" :value="s.id">{{ s.firstName }} {{ s.lastName }} — {{ s.email }}</option>
                </select>
              </div>
              <div class="field">
                <label>Job *</label>
                <select v-model="placementForm.jobId" required :disabled="!!editingPlacementId">
                  <option value="" disabled>Select job...</option>
                  <option v-for="j in jobs" :key="j.id" :value="j.id">{{ j.title }} @ {{ j.company }}</option>
                </select>
              </div>
            </div>
            <div class="form-row-2">
              <div class="field">
                <label>Annual Salary (R) *</label>
                <input type="number" min="1" step="0.01" v-model.number="placementForm.salary" placeholder="e.g. 300000" required />
              </div>
              <div class="field">
                <label>Employment Start Date *</label>
                <input type="date" v-model="placementForm.employmentStart" required />
              </div>
            </div>
            <p v-if="placementForm.salary > 0" class="admin-note placement-note">
              5% commission = <strong>R {{ placementMonthly(placementForm.salary) }}</strong> per month for up to 24 months (R {{ placementLifetime(placementForm.salary) }} total).
            </p>
            <div class="form-actions">
              <button class="btn btn-primary btn-small" type="submit" :disabled="savingPlacement">
                {{ savingPlacement ? 'Saving...' : editingPlacementId ? 'Save Changes' : 'Record Placement' }}
              </button>
              <button v-if="editingPlacementId" class="btn btn-ghost btn-small" type="button" @click="resetPlacementForm">Cancel</button>
            </div>
          </form>
        </div>

        <p v-if="loadingPlacements" class="admin-note">Loading placements...</p>
        <p v-else-if="placements.length === 0" class="admin-note">No placements yet. Record the first graduate placement above.</p>

        <div v-else class="table-wrap">
          <table class="admin-table placement-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Job</th>
                <th>Annual Salary</th>
                <th>Started</th>
                <th>Status</th>
                <th>Months</th>
                <th>5% / Month</th>
                <th>Commission</th>
                <th class="col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in placements" :key="p.id">
                <td>
                  <strong>{{ p.studentName }}</strong>
                  <span class="sub-cell">{{ p.studentEmail }}</span>
                </td>
                <td>
                  <strong>{{ p.jobTitle }}</strong>
                  <span class="sub-cell">{{ p.company }}</span>
                </td>
                <td>R {{ formatRands(p.salary) }}</td>
                <td>{{ p.employmentStart }}</td>
                <td>
                  <span :class="['status-badge', p.status === 'completed' ? 'status-pending' : 'status-approved']">{{ p.status }}</span>
                </td>
                <td>{{ p.monthsActive }} / 24</td>
                <td>R {{ formatRands(p.monthlyCommission) }}</td>
                <td>
                  <strong>R {{ formatRands(p.totalCommission) }}</strong>
                  <span v-if="p.status === 'active'" class="sub-cell">+ R {{ formatRands(p.monthlyCommission) }}/mo</span>
                </td>
                <td class="col-actions">
                  <button class="btn btn-ghost btn-small" title="Edit" @click="startEditPlacement(p)">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    Edit
                  </button>
                  <button class="btn btn-accent btn-small" title="Delete" @click="removePlacement(p)" :disabled="busyId === p.id">
                    <svg class="btn-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { adminAPI } from '../store/api.js'
import { getCurrentUser, logout } from '../store/auth.js'

function userBaseUrl() {
  const host = window.location.hostname || 'localhost'
  return `http://${host}:3004/login`
}

export default {
  name: 'AdminDashboard',
  data() {
    return {
      adminUser: getCurrentUser(),
      userUrl: userBaseUrl(),
      tab: 'students',
      users: [],
      packages: [],
      orders: [],
      adminForm: { firstName: '', lastName: '', email: '', password: '' },
      creatingAdmin: false,
      adminCreated: null,
      editingAdmin: null,
      savingAdminEdit: false,
      editAdminError: '',
      applications: [],
      loadingApplications: false,
      savingApplicationId: null,
      selectedApplication: null,
      msgUserId: '',
      msgPhone: '',
      msgText: '',
      msgBusy: false,
      msgError: '',
      featuresText: {},
      search: '',
      filter: 'all',
      loadingUsers: false,
      loadingPackages: false,
      loadingOrders: false,
      jobs: [],
      loadingJobs: false,
      savingJob: false,
      editingJobId: null,
      jobForm: { title: '', company: '', location: '', field: '', type: 'full-time', salary: '', description: '' },
      fieldOptions: [
        'Information Technology & Computer Science',
        'Engineering',
        'Business & Finance',
        'Marketing & Communications',
        'Health Sciences',
        'Law',
        'Education & Teaching',
        'Science & Mathematics',
        'Social Sciences & Humanities',
        'Agriculture & Environmental',
        'Other'
      ],
      busyId: null,
      message: '',
      placements: [],
      loadingPlacements: false,
      savingPlacement: false,
      editingPlacementId: null,
      placementForm: { studentId: '', jobId: '', salary: null, employmentStart: '' }
    }
  },
  computed: {
    adminName() {
      const u = this.adminUser
      return u ? (u.firstName || u.email) : 'Admin'
    },
    students() {
      return this.users.filter(u => u.role !== 'admin')
    },
    admins() {
      return this.users.filter(u => u.role === 'admin')
    },
    filteredStudents() {
      const q = this.search.trim().toLowerCase()
      return this.students.filter(u => {
        const matchesSearch = !q ||
          (u.firstName + ' ' + u.lastName).toLowerCase().includes(q) ||
          (u.email || '').toLowerCase().includes(q)
        const matchesFilter = this.filter === 'all' || u.status === this.filter
        return matchesSearch && matchesFilter
      })
    },
    totalRevenue() {
      return this.orders
        .filter(o => o.status === 'paid')
        .reduce((sum, o) => sum + Number(o.amount), 0)
        .toLocaleString('en-ZA')
    },
    placementTotal() {
      return this.placements
        .reduce((sum, p) => sum + Number(p.totalCommission || 0), 0)
        .toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
  },
  mounted() {
    this.loadUsers()
    this.loadPackages()
    this.loadOrders()
    this.loadJobs()
    this.loadPlacements()
    this.loadApplications()
  },
  methods: {
    sanitizeName(v) {
      // Letters only (incl. accented letters), spaces, hyphens, apostrophes and dots.
      return v.replace(/[^A-Za-z\u00C0-\u024F'\- .]/g, '').replace(/\s{2,}/g, ' ')
    },
    countStatus(status) {
      return this.students.filter(u => u.status === status).length
    },
    formatDate(date) {
      if (!date) return '—'
      return new Date(date).toLocaleDateString('en-ZA', {
        year: 'numeric', month: 'short', day: 'numeric'
      })
    },
    async loadUsers() {
      this.loadingUsers = true
      try {
        this.users = await adminAPI.getUsers()
      } catch (err) {
        this.showMessage(err.error || 'Failed to load users')
      } finally {
        this.loadingUsers = false
      }
    },
    async loadPackages() {
      this.loadingPackages = true
      try {
        this.packages = await adminAPI.getPackages()
        this.featuresText = {}
        this.packages.forEach(p => {
          this.featuresText[p.id] = Array.isArray(p.features) ? p.features.join('\n') : ''
        })
      } catch (err) {
        this.showMessage(err.error || 'Failed to load plans')
      } finally {
        this.loadingPackages = false
      }
    },
    async loadOrders() {
      this.loadingOrders = true
      try {
        this.orders = await adminAPI.getOrders()
      } catch (err) {
        this.showMessage(err.error || 'Failed to load orders')
      } finally {
        this.loadingOrders = false
      }
    },
    async setUserStatus(user, status) {
      this.busyId = user.id
      this.message = ''
      try {
        const data = await adminAPI.updateUserStatus(user.id, status)
        let text = `Student ${status}.`
        const notifications = data.notifications || []
        if (status === 'approved' && notifications.length > 0) {
          notifications.forEach(n => {
            if (n.channel === 'email') {
              text += n.delivered
                ? ' Email sent.'
                : n.sandbox ? ' Email sandbox (see backend log).' : ' Email failed.'
            }
            if (n.channel === 'whatsapp') {
              if (n.waLink) {
                text += ` WhatsApp ready: ${n.waLink}`
              } else if (n.delivered) {
                text += ' WhatsApp sent.'
              } else {
                text += ' WhatsApp sandbox.'
              }
            }
          })
        }
        this.showMessage(text)
        await this.loadUsers()
      } catch (err) {
        this.showMessage(err.error || 'Failed to update student')
      } finally {
        this.busyId = null
      }
    },
    async savePackage(p) {
      this.busyId = p.id
      this.message = ''
      try {
        const features = (this.featuresText[p.id] || '')
          .split('\n')
          .map(f => f.trim())
          .filter(f => f.length > 0)
        await adminAPI.updatePackage(p.id, {
          name: p.name,
          price: p.price,
          description: p.description,
          maxUniversities: p.maxUniversities,
          features,
          highlighted: p.highlighted
        })
        this.showMessage(`Plan "${p.name}" saved. It is now live on the Payment Plans page.`)
        await this.loadPackages()
      } catch (err) {
        this.showMessage(err.error || 'Failed to save plan')
      } finally {
        this.busyId = null
      }
    },
    onSelectStudent() {
      const u = this.users.find(x => x.id === this.msgUserId)
      this.msgPhone = u ? (u.phone || '') : ''
    },
    async openWhatsApp() {
      this.msgBusy = true
      this.msgError = ''
      this.message = ''
      try {
        const data = await adminAPI.sendWhatsApp({
          phone: this.msgPhone,
          message: this.msgText
        })
        window.open(data.waLink, '_blank')
      } catch (err) {
        this.msgError = err.error || 'Failed to open WhatsApp'
      } finally {
        this.msgBusy = false
      }
    },
    async createAdmin() {
      this.creatingAdmin = true
      this.message = ''
      this.adminCreated = null
      try {
        const data = await adminAPI.createUser({
          firstName: this.adminForm.firstName,
          lastName: this.adminForm.lastName,
          email: this.adminForm.email,
          password: this.adminForm.password,
          role: 'admin'
        })
        this.adminCreated = {
          email: this.adminForm.email,
          password: this.adminForm.password
        }
        this.adminForm = { firstName: '', lastName: '', email: '', password: '' }
        this.showMessage(`Admin "${data.user.firstName} ${data.user.lastName}" created.`)
        await this.loadUsers()
      } catch (err) {
        this.showMessage(err.error || 'Failed to create admin')
      } finally {
        this.creatingAdmin = false
      }
    },
    startEditAdmin(admin) {
      this.editingAdmin = {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        password: ''
      }
      this.editAdminError = ''
    },
    closeEditAdmin() {
      this.editingAdmin = null
      this.editAdminError = ''
    },
    async saveAdminEdit() {
      this.savingAdminEdit = true
      this.editAdminError = ''
      this.message = ''
      try {
        const payload = {
          firstName: this.editingAdmin.firstName,
          lastName: this.editingAdmin.lastName,
          email: this.editingAdmin.email
        }
        if (this.editingAdmin.password) {
          payload.password = this.editingAdmin.password
        }
        await adminAPI.updateUser(this.editingAdmin.id, payload)
        const name = `${this.editingAdmin.firstName} ${this.editingAdmin.lastName}`
        this.showMessage(`Login details updated for "${name}".`)
        this.closeEditAdmin()
        await this.loadUsers()
      } catch (err) {
        this.editAdminError = err.error || 'Failed to update admin'
      } finally {
        this.savingAdminEdit = false
      }
    },
    async loadApplications() {
      this.loadingApplications = true
      try {
        this.applications = await adminAPI.getApplications()
      } catch (err) {
        this.showMessage(err.error || 'Failed to load applications')
      } finally {
        this.loadingApplications = false
      }
    },
    async setApplicationStatus(app, status) {
      this.savingApplicationId = app.id
      this.message = ''
      try {
        await adminAPI.updateApplicationStatus(app.id, status)
        app.status = status
        this.showMessage(`Application for "${app.jobTitle}" marked as ${status}.`)
      } catch (err) {
        this.showMessage(err.error || 'Failed to update application')
      } finally {
        this.savingApplicationId = null
      }
    },
    appStatusClass(status) {
      const map = {
        pending: 'status-pending',
        shortlisted: 'status-approved',
        hired: 'status-approved',
        rejected: 'status-rejected'
      }
      return map[status] || 'status-pending'
    },
    showMessage(text) {
      this.message = text
      window.setTimeout(() => {
        if (this.message === text) this.message = ''
      }, 6000)
    },
    async loadJobs() {
      this.loadingJobs = true
      try {
        this.jobs = await adminAPI.getJobs()
      } catch (err) {
        this.showMessage(err.error || 'Failed to load jobs')
      } finally {
        this.loadingJobs = false
      }
    },
    resetJobForm() {
      this.jobForm = { title: '', company: '', location: '', field: '', type: 'full-time', salary: '', description: '' }
      this.editingJobId = null
    },
    startEditJob(job) {
      this.editingJobId = job.id
      this.jobForm = {
        title: job.title,
        company: job.company,
        location: job.location || '',
        field: job.field,
        type: job.type,
        salary: job.salary || '',
        description: job.description || ''
      }
    },
    async saveJob() {
      this.savingJob = true
      this.message = ''
      try {
        const payload = {
          title: this.jobForm.title.trim(),
          company: this.jobForm.company.trim(),
          location: this.jobForm.location.trim() || null,
          field: this.jobForm.field,
          type: this.jobForm.type,
          salary: this.jobForm.salary.trim() || null,
          description: this.jobForm.description.trim() || null
        }
        if (this.editingJobId) {
          await adminAPI.updateJob(this.editingJobId, payload)
          this.showMessage('Job updated. It is live on the Graduate Jobs page.')
        } else {
          await adminAPI.createJob(payload)
          this.showMessage('Job published. It is now live on the Graduate Jobs page.')
        }
        this.resetJobForm()
        await this.loadJobs()
      } catch (err) {
        this.showMessage(err.error || 'Failed to save job')
      } finally {
        this.savingJob = false
      }
    },
    async removeJob(job) {
      if (!confirm(`Delete "${job.title}" at ${job.company}? This cannot be undone.`)) return
      this.busyId = job.id
      this.message = ''
      try {
        await adminAPI.deleteJob(job.id)
        this.showMessage('Job deleted.')
        await this.loadJobs()
      } catch (err) {
        this.showMessage(err.error || 'Failed to delete job')
      } finally {
        this.busyId = null
      }
    },
    placementStatusCount(status) {
      return this.placements.filter(p => p.status === status).length
    },
    placementMonthly(salary) {
      const amount = (Number(salary) * 0.05) / 12
      return amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    placementLifetime(salary) {
      const amount = ((Number(salary) * 0.05) / 12) * 24
      return amount.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    formatRands(value) {
      return Number(value || 0).toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    async loadPlacements() {
      this.loadingPlacements = true
      try {
        this.placements = await adminAPI.getPlacements()
      } catch (err) {
        this.showMessage(err.error || 'Failed to load placements')
      } finally {
        this.loadingPlacements = false
      }
    },
    resetPlacementForm() {
      this.placementForm = { studentId: '', jobId: '', salary: null, employmentStart: '' }
      this.editingPlacementId = null
    },
    startEditPlacement(placement) {
      this.editingPlacementId = placement.id
      this.placementForm = {
        studentId: placement.studentId,
        jobId: placement.jobId,
        salary: Number(placement.salary),
        employmentStart: placement.employmentStart
      }
    },
    async savePlacement() {
      this.savingPlacement = true
      this.message = ''
      try {
        const payload = {
          studentId: Number(this.placementForm.studentId),
          jobId: Number(this.placementForm.jobId),
          salary: Number(this.placementForm.salary),
          employmentStart: this.placementForm.employmentStart
        }
        if (this.editingPlacementId) {
          await adminAPI.updatePlacement(this.editingPlacementId, {
            salary: payload.salary,
            employmentStart: payload.employmentStart
          })
          this.showMessage('Placement updated. Commission recalculated.')
        } else {
          await adminAPI.createPlacement(payload)
          this.showMessage('Placement recorded. 5% commission tracking started.')
        }
        this.resetPlacementForm()
        await this.loadPlacements()
      } catch (err) {
        this.showMessage(err.error || 'Failed to save placement')
      } finally {
        this.savingPlacement = false
      }
    },
    async removePlacement(placement) {
      if (!confirm(`Remove ${placement.studentName} from "${placement.jobTitle}"? This deletes their commission record.`)) return
      this.busyId = placement.id
      this.message = ''
      try {
        await adminAPI.deletePlacement(placement.id)
        this.showMessage('Placement deleted.')
        await this.loadPlacements()
      } catch (err) {
        this.showMessage(err.error || 'Failed to delete placement')
      } finally {
        this.busyId = null
      }
    },
    handleLogout() {
      logout()
      // Return to the main (student) login page, not the admin sign-in page.
      const host = window.location.hostname || 'localhost'
      window.location.href = `http://${host}:3004/login`
    }
  }
}
</script>

<style scoped>
.admin-nav {
  background: var(--primary-dark);
  color: white;
  border-bottom: 3px solid var(--flag-stripe);
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
}

.admin-nav-brand {
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
}

.admin-nav-brand span {
  color: var(--gold-light);
}

.admin-nav-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.admin-nav-user {
  font-size: 0.82rem;
  color: rgba(255, 255, 255, 0.85);
}

.admin-nav-btn {
  background: rgba(255, 255, 255, 0.12);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 6px 14px;
  border-radius: var(--radius);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
}

.admin-nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-top: 32px;
}

.stat-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: var(--text-muted);
}

.stat-value {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--primary-dark);
}

.stat-value.stat-pending,
.stat-pending { color: #B7791F; }
.stat-value.stat-approved,
.stat-approved { color: var(--success); }
.stat-value.stat-rejected,
.stat-rejected { color: var(--accent); }

.admin-tabs {
  display: flex;
  gap: 8px;
  margin: 24px 0;
  border-bottom: 2px solid var(--border);
}

.admin-tab {
  padding: 12px 20px;
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
}

.admin-tab.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
}

.admin-alert {
  background: var(--primary-50);
  color: var(--primary-dark);
  border: 1px solid var(--primary-100);
  margin-bottom: 20px;
  align-items: center;
}

.admin-note {
  color: var(--text-muted);
  font-size: 0.9rem;
  padding: 8px 0;
  margin: 0;
}

.panel-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
}

.panel-title {
  font-size: 1rem;
  margin: 0 0 14px;
  color: var(--text);
}

.banner-info {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  background: #f3f7fc;
  border: 1px solid rgba(45, 94, 161, 0.15);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  margin-bottom: 18px;
  color: #2d5ea1;
  font-size: 0.92rem;
  line-height: 1.5;
}

.placement-stats {
  margin-bottom: 18px;
}

.placement-note {
  color: var(--text-muted);
}

.sub-cell {
  display: block;
  font-size: 0.78rem;
  color: var(--text-muted);
  font-weight: 400;
}

.placement-table td {
  vertical-align: top;
  padding-top: 10px;
  padding-bottom: 10px;
}

.placement-table .status-badge {
  white-space: nowrap;
}

.admin-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.success-alert {
  background: #f0fff4;
  color: var(--success);
  border: 1px solid rgba(39, 103, 73, 0.12);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
}

.success-alert strong {
  font-weight: 700;
}

.field select {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text);
  background: var(--bg);
}

.field textarea {
  resize: vertical;
}

.msg-error {
  background: var(--accent-50);
  color: var(--accent);
  border: 1px solid rgba(197, 48, 48, 0.12);
  padding: 12px;
  border-radius: var(--radius);
  font-size: 0.85rem;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 10px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
}

.filter-chips {
  display: flex;
  gap: 8px;
}

.chip {
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--text-light);
  cursor: pointer;
  font-family: inherit;
  transition: var(--transition-fast);
}

.chip.active {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: 48px;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
}

.admin-table th,
.admin-table td {
  text-align: left;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
}

.admin-table thead th {
  background: var(--bg-subtle);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-light);
}

.admin-table tbody tr:last-child td {
  border-bottom: none;
}

.col-actions {
  white-space: nowrap;
}

.role-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: var(--radius);
  background: var(--accent-50);
  color: var(--accent);
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-approved,
.status-paid {
  background: var(--success-light);
  color: var(--success);
}

.status-pending {
  background: #FFF4D6;
  color: #B7791F;
}

.status-rejected,
.status-cancelled {
  background: var(--accent-50);
  color: var(--accent);
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.8rem;
  margin-right: 6px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-icon {
  flex-shrink: 0;
}

.btn-primary {
  background: var(--primary);
  color: white;
}

.btn-accent {
  background: var(--accent);
  color: white;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
}

.plans-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 48px;
}

.plan-edit-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
}

.plan-edit-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.plan-edit-head h3 {
  font-size: 1rem;
}

.check-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}

.field label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.field input,
.field textarea {
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  font-size: 0.9rem;
  font-family: inherit;
  color: var(--text);
}

.field textarea {
  resize: vertical;
}

.form-row-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 14px;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.form-actions {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}

/* Admin modals (edit admin login + application details) */
.admin-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
  padding: 20px;
}

.admin-modal {
  background: var(--bg);
  border-radius: var(--radius-md);
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  padding: 28px;
  position: relative;
  box-shadow: var(--shadow-xl);
}

.admin-modal-wide {
  max-width: 640px;
}

.admin-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  padding: 4px;
}

.admin-modal-close:hover {
  color: var(--text);
}

.field-hint {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 400;
}

.admin-error {
  color: var(--accent);
  font-size: 0.85rem;
  margin: 6px 0 12px;
}

.app-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 14px;
  margin-top: 4px;
}

.app-detail-text {
  font-size: 0.9rem;
  color: var(--text);
  margin: 0;
  line-height: 1.5;
}

.app-detail-block {
  background: var(--bg-subtle);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 14px 16px;
  white-space: pre-wrap;
}

@media (max-width: 640px) {
  .app-detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .admin-tabs { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .admin-tab { white-space: nowrap; }
}

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
  .form-row-3 { grid-template-columns: 1fr; }
  .form-row-2 { grid-template-columns: 1fr; }
  .admin-nav-inner { padding: 0 20px; }
  .admin-tabs { gap: 4px; margin: 16px 0; }
  .admin-tab { padding: 10px 14px; font-size: 0.85rem; }
  .panel-card { padding: 18px; }
  .toolbar { flex-direction: column; align-items: stretch; }
  .search-input { min-width: 0; }
  .filter-chips { flex-wrap: wrap; }
  .table-wrap { margin-bottom: 32px; }
  .plans-list, .plan-edit-card { padding: 16px; }
}

@media (max-width: 480px) {
  .admin-nav-inner { padding: 0 14px; }
  .admin-nav-user { display: none; }
  .stat-card { padding: 14px 16px; }
  .stat-value { font-size: 1.3rem; }
  .admin-tab { padding: 9px 10px; }
  .plans-list, .plan-edit-card { padding: 12px; }
}
</style>
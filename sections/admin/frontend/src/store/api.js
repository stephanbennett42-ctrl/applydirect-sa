/**
 * API Service Layer — Admin frontend
 * Centralised HTTP client for communicating with the admin backend.
 * Automatically attaches the admin JWT token from localStorage.
 */
// Relative path so the app works from any device:
// requests go to the same origin the page was served from and are proxied
// to the backend by Vite (works on localhost AND from phones/tablets on the LAN).
const API_BASE = '/api'

/**
 * Get the stored JWT token.
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('uniapply_admin_token')
}

/**
 * Set the JWT token in localStorage.
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem('uniapply_admin_token', token)
}

/**
 * Remove the JWT token (used on logout).
 */
export function clearToken() {
  localStorage.removeItem('uniapply_admin_token')
  localStorage.removeItem('uniapply_admin_user')
}

/**
 * Generic fetch wrapper that handles auth headers and JSON parsing.
 * @param {string} url — API endpoint path (e.g. '/admin/users')
 * @param {object} options — fetch options (method, body, etc.)
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiFetch(url, options = {}) {
  const token = getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers
  })

  // Stale / expired token? Drop it so the user lands on the login page
  // instead of getting stuck on a broken session.
  if (res.status === 401) {
    clearToken()
  }

  const data = await res.json()

  if (!res.ok) {
    throw { status: res.status, ...data }
  }

  return data
}

// ============================================
// Auth API
// ============================================

export const authAPI = {
  /** Log in with email and password. Returns { token, user } */
  login(email, password) {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  },

  /** Get the current authenticated user's profile */
  getMe() {
    return apiFetch('/auth/me')
  }
}

// ============================================
// Admin API (requires an admin JWT)
// ============================================

export const adminAPI = {
  /** List all users (pending first) */
  getUsers() {
    return apiFetch('/admin/users')
  },

  /** Approve or reject a student */
  updateUserStatus(id, status) {
    return apiFetch(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  },

  /** Edit an admin account's login details (firstName, lastName, email, password) */
  updateUser(id, data) {
    return apiFetch(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /** List all job applications with student + job details */
  getApplications() {
    return apiFetch('/admin/applications')
  },

  /** Update a job application's status (pending/shortlisted/hired/rejected) */
  updateApplicationStatus(id, status) {
    return apiFetch(`/admin/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    })
  },

  /** List all packages */
  getPackages() {
    return apiFetch('/admin/packages')
  },

  /** Update a package (price, features, etc.) */
  updatePackage(id, data) {
    return apiFetch(`/admin/packages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  /** List all orders with student + package details */
  getOrders() {
    return apiFetch('/admin/orders')
  },

  /** Create a new account (admin or student) directly */
  createUser(data) {
    return apiFetch('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /** Build a ready-to-send WhatsApp link for a user (or phone number) */
  sendWhatsApp(data) {
    return apiFetch('/admin/messages/whatsapp', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /** List all graduate jobs (including inactive) */
  getJobs() {
    return apiFetch('/admin/jobs')
  },

  /** Create a new graduate job listing */
  createJob(data) {
    return apiFetch('/admin/jobs', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /** Update a graduate job listing */
  updateJob(id, data) {
    return apiFetch(`/admin/jobs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  /** Delete a graduate job listing */
  deleteJob(id) {
    return apiFetch(`/admin/jobs/${id}`, {
      method: 'DELETE'
    })
  },

  /** List all placements with computed commission fields */
  getPlacements() {
    return apiFetch('/admin/placements')
  },

  /** Record a new placement: { studentId, jobId, salary, employmentStart } */
  createPlacement(data) {
    return apiFetch('/admin/placements', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /** Update a placement's salary or employment start date */
  updatePlacement(id, data) {
    return apiFetch(`/admin/placements/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
  },

  /** Delete a placement */
  deletePlacement(id) {
    return apiFetch(`/admin/placements/${id}`, {
      method: 'DELETE'
    })
  }
}
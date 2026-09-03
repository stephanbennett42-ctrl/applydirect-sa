/**
 * API Service Layer
 * Centralised HTTP client for communicating with the Express backend.
 * Automatically attaches the JWT token from localStorage.
 */
const API_BASE = 'http://localhost:3001/api'

/**
 * Get the stored JWT token.
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('uniapply_token')
}

/**
 * Set the JWT token in localStorage.
 * @param {string} token
 */
export function setToken(token) {
  localStorage.setItem('uniapply_token', token)
}

/**
 * Remove the JWT token (used on logout).
 */
export function clearToken() {
  localStorage.removeItem('uniapply_token')
  localStorage.removeItem('uniapply_currentUser')
}

/**
 * Generic fetch wrapper that handles auth headers and JSON parsing.
 * @param {string} url — API endpoint path (e.g. '/auth/login')
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
  /** Register a new student account */
  register(userData) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  },

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
// Packages API
// ============================================

export const packagesAPI = {
  /** Get all available packages */
  getAll() {
    return apiFetch('/packages')
  },

  /** Get a single package by ID */
  getById(id) {
    return apiFetch(`/packages/${id}`)
  }
}

// ============================================
// Orders API
// ============================================

export const ordersAPI = {
  /** Create a new order (select a package) */
  create(packageId) {
    return apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify({ packageId })
    })
  },

  /** Process simulated payment for an order */
  pay(orderId, cardData) {
    return apiFetch(`/orders/${orderId}/pay`, {
      method: 'POST',
      body: JSON.stringify(cardData)
    })
  },

  /** Get all orders for the current user */
  getAll() {
    return apiFetch('/orders')
  },

  /** Get a single order with payment details */
  getById(id) {
    return apiFetch(`/orders/${id}`)
  }
}

// ============================================
// Applications API (Student)
// ============================================

export const applicationsAPI = {
  /** Get current user's applications */
  getAll() {
    return apiFetch('/applications')
  },

  /** Submit a new university application */
  create(university, program) {
    return apiFetch('/applications', {
      method: 'POST',
      body: JSON.stringify({ university, program })
    })
  },

  /** Get a single application */
  getById(id) {
    return apiFetch(`/applications/${id}`)
  }
}

// ============================================
// Admin API
// ============================================

export const adminAPI = {
  /** Get dashboard statistics */
  getStats() {
    return apiFetch('/admin/stats')
  },

  /** List all users */
  getUsers(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/admin/users${qs ? '?' + qs : ''}`)
  },

  /** Approve a user */
  approveUser(id) {
    return apiFetch(`/admin/users/${id}/approve`, { method: 'PUT' })
  },

  /** Reject a user */
  rejectUser(id) {
    return apiFetch(`/admin/users/${id}/reject`, { method: 'PUT' })
  },

  /** Delete a user */
  deleteUser(id) {
    return apiFetch(`/admin/users/${id}`, { method: 'DELETE' })
  },

  /** List all applications */
  getApplications(params = {}) {
    const qs = new URLSearchParams(params).toString()
    return apiFetch(`/admin/applications${qs ? '?' + qs : ''}`)
  },

  /** Create an application */
  createApplication(data) {
    return apiFetch('/admin/applications', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  /** Update an application */
  updateApplication(id, data) {
    return apiFetch(`/admin/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  },

  /** Delete an application */
  deleteApplication(id) {
    return apiFetch(`/admin/applications/${id}`, { method: 'DELETE' })
  }
}

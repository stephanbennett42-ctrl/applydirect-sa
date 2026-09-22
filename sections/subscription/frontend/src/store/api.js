/**
 * API Service Layer — Subscription frontend
 * Centralised HTTP client for communicating with the subscription backend.
 * Automatically attaches the JWT token from localStorage.
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
  /** Create a new student account. Returns { message, user } */
  register(details) {
    return apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details)
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

  /** Start a real PayFast redirect for a pending order */
  payfastInit(orderId) {
    return apiFetch('/payfast/init', {
      method: 'POST',
      body: JSON.stringify({ orderId })
    })
  },

  /** Confirm a payment after PayFast redirects the user back (return URL) */
  payfastConfirm(payload) {
    return apiFetch('/payfast/confirm', {
      method: 'POST',
      body: JSON.stringify(payload)
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
// Graduate Jobs API (public)
// ============================================

export const jobsAPI = {
  /** Check the current user's premium access to the Graduate Jobs section (auth) */
  getAccess() {
    return apiFetch('/jobs/access')
  },

  /** List all active jobs, optional { field, type, q } filters (premium) */
  getAll(params = {}) {
    const qs = new URLSearchParams()
    if (params.field) qs.set('field', params.field)
    if (params.type) qs.set('type', params.type)
    if (params.q) qs.set('q', params.q)
    const query = qs.toString()
    return apiFetch('/jobs' + (query ? '?' + query : ''))
  },

  /** Get distinct fields with job counts */
  getFields() {
    return apiFetch('/jobs/fields')
  },

  /** Get a single job by ID */
  getById(id) {
    return apiFetch(`/jobs/${id}`)
  },

  /** Submit a job application (requires auth) */
  apply(id, details) {
    return apiFetch(`/jobs/${id}/apply`, {
      method: 'POST',
      body: JSON.stringify(details)
    })
  },

  /** Get the current user's job applications */
  getMyApplications() {
    return apiFetch('/jobs/applications')
  }
}
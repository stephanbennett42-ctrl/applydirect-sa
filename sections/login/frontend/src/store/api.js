/**
 * API Service Layer — Login frontend
 * Centralised HTTP client for communicating with the login backend.
 * Automatically attaches the JWT token from localStorage.
 */
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
  /** Create a student account without signing in automatically. */
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
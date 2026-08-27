const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  })

  let data = {}

  try {
    data = await response.json()
  } catch {
    data = {}
  }

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong. Please try again.'
    )
  }

  return data
}

export async function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  })
}

export async function register(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export async function forgotPassword(email) {
  return request('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  })
}

export async function logout() {
  return request('/auth/logout', {
    method: 'POST',
  })
}

export async function getCurrentUser() {
  return request('/auth/me', {
    method: 'GET',
  })
}

export function loginWithGoogle() {
  window.location.href = `${API_BASE_URL}/auth/google`
}
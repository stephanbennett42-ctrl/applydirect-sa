/**
 * Authentication Module (Admin frontend)
 * Backed by the Express/MySQL API.
 */
import { authAPI, setToken, clearToken } from './api.js'

/**
 * Attempt to log in an admin with email and password.
 * Calls the backend API, checks the role, and stores the JWT token.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export async function login(email, password) {
  try {
    const data = await authAPI.login(email, password)

    if (data.user.role !== 'admin') {
      return { success: false, error: 'This account is not an admin. Please use the student login.' }
    }

    setToken(data.token)
    localStorage.setItem('uniapply_admin_user', JSON.stringify(data.user))
    return { success: true, user: data.user }
  } catch (err) {
    return {
      success: false,
      error: err.error || 'Login failed',
      status: err.status || null
    }
  }
}

/**
 * Get the currently logged-in admin from localStorage.
 * @returns {object|null}
 */
export function getCurrentUser() {
  const stored = localStorage.getItem('uniapply_admin_user')
  return stored ? JSON.parse(stored) : null
}

/**
 * Log out the current admin by clearing stored auth data.
 */
export function logout() {
  clearToken()
}

/**
 * Check if an admin is currently logged in.
 * @returns {boolean}
 */
export function isAdmin() {
  const user = getCurrentUser()
  return user !== null && user.role === 'admin'
}
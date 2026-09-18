/**
 * Authentication Module (Subscription frontend)
 * Backed by the Express/MySQL API.
 */
import { authAPI, setToken, clearToken } from './api.js'

/**
 * Attempt to log in with email and password.
 * Calls the backend API and stores the JWT token.
 * @param {string} email
 * @param {string} password
 * @returns {{ success: boolean, user?: object, error?: string, status?: string }}
 */
export async function login(email, password) {
  try {
    const data = await authAPI.login(email, password)
    setToken(data.token)
    localStorage.setItem('uniapply_currentUser', JSON.stringify(data.user))
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
 * Get the currently logged-in user from localStorage.
 * @returns {object|null}
 */
export function getCurrentUser() {
  const stored = localStorage.getItem('uniapply_currentUser')
  return stored ? JSON.parse(stored) : null
}

/**
 * Log out the current user by clearing stored auth data.
 */
export function logout() {
  clearToken()
}

/**
 * Check if a user is currently logged in.
 * @returns {boolean}
 */
export function isLoggedIn() {
  return getCurrentUser() !== null
}
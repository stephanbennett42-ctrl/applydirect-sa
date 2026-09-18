/**
 * Authentication Middleware
 * Verifies JWT tokens from the Authorization header.
 * Attaches the decoded user info to req.user.
 */
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Load env vars so JWT_SECRET is always available, even when this file
// is imported before the server's dotenv.config() runs.
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || 'uniapply-secret-key-2026'

/**
 * Middleware: requireAuth
 * Checks for a valid JWT token in the Authorization header.
 * Rejects with 401 if missing or invalid.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' })
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Middleware: requireAdmin
 * Requires a valid token AND an admin role.
 * Rejects with 403 if the authenticated user is not an admin.
 */
export function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  })
}

export { JWT_SECRET }
/**
 * Authentication & Authorization Middleware
 * Location: backend/middleware/auth.js
 */
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const JWT_SECRET = process.env.JWT_SECRET || 'uniapply-secret-key-2026'

/**
 * Middleware: requireAuth
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
 */
export function requireAdmin(req, res, next) {
  return requireAuth(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' })
    }
    next()
  })
}
/**
 * Authentication Routes (Admin module)
 * POST /api/auth/login    — Log in an admin with email and password
 * GET  /api/auth/me       — Get current logged-in user (requires auth)
 */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { JWT_SECRET, requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * POST /api/auth/login
 * Authenticate a user with email and password.
 * Body: { email, password }
 * Returns a JWT token and user info on success.
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = rows[0]

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Admins are always approved, so no status gate is needed here.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        university: user.university,
        fieldOfStudy: user.field_of_study,
        status: user.status,
        role: user.role
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Server error during login' })
  }
})

/**
 * GET /api/auth/me
 * Get the currently authenticated user's profile.
 * Requires: Authorization: Bearer <token>
 */
router.get('/me', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, phone, university, field_of_study, status, role, registered_date FROM users WHERE id = ?',
      [req.user.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const u = rows[0]
    res.json({
      id: u.id,
      firstName: u.first_name,
      lastName: u.last_name,
      email: u.email,
      phone: u.phone,
      university: u.university,
      fieldOfStudy: u.field_of_study,
      status: u.status,
      role: u.role,
      registeredDate: u.registered_date
    })
  } catch (err) {
    console.error('Get user error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
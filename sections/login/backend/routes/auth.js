/**
 * Authentication Routes (Login module)
 * POST /api/auth/login — Log in with email and password
 * GET  /api/auth/me    — Get current logged-in user (requires auth)
 */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'
import { JWT_SECRET, requireAuth } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, university, password } = req.body

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, surname, email, and password are required' })
    }

    if (String(password).length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }

    const passwordHash = await bcrypt.hash(String(password), 10)
    await db.query(
      'INSERT INTO users (first_name, last_name, email, password, phone, university, status, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName.trim(), lastName.trim(), email.trim().toLowerCase(), passwordHash, phone?.trim() || null, university?.trim() || null, 'pending', 'student']
    )

    res.status(201).json({ message: 'Account created and submitted for admin approval', email: email.trim().toLowerCase() })
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'An account with that email already exists' })
    }

    console.error('Registration error:', err)
    res.status(500).json({ error: 'Server error during registration' })
  }
})

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

    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Administrators must use the admin login page.', status: 'admin_login_required' })
    }

    if (user.status === 'pending') {
      return res.status(403).json({ error: 'Your account is pending admin approval.', status: 'pending' })
    }

    if (user.status === 'rejected') {
      return res.status(403).json({ error: 'Your account has been rejected. Please contact support.', status: 'rejected' })
    }

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
      'SELECT id, first_name, last_name, email, phone, university, status, role, registered_date FROM users WHERE id = ?',
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
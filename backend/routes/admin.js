/**
 * Admin Routes
 * Location: backend/routes/admin.js
 */
import { Router } from 'express'
import bcrypt from 'bcryptjs'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendAcceptanceNotification, buildWhatsAppLink } from '../notifications.js'

const router = Router()

router.use(requireAdmin)

/**
 * GET /api/admin/users
 */
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, first_name, last_name, email, phone, university, field_of_study, status, role, registered_date
       FROM users
       ORDER BY (status = 'pending') DESC, registered_date DESC`
    )

    res.json(rows.map(u => ({
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
    })))
  } catch (err) {
    console.error('Get admin users error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * POST /api/admin/users
 */
router.post('/users', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body
    const role = req.body.role === 'admin' ? 'admin' : 'student'

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required' })
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email])
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const hashedPassword = await bcrypt.hash(String(password), 10)

    const [result] = await db.query(
      'INSERT INTO users (first_name, last_name, email, password, status, role) VALUES (?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, 'approved', role]
    )

    res.status(201).json({
      message: role === 'admin' ? 'Admin account created' : 'Student account created',
      user: {
        id: result.insertId,
        firstName,
        lastName,
        email,
        status: 'approved',
        role
      }
    })
  } catch (err) {
    console.error('Create admin user error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * POST /api/admin/messages/whatsapp
 */
router.post('/messages/whatsapp', async (req, res) => {
  try {
    const { userId, phone, message } = req.body

    let number = phone
    if (userId) {
      const [rows] = await db.query('SELECT phone FROM users WHERE id = ?', [userId])
      if (rows.length === 0) {
        return res.status(404).json({ error: 'User not found' })
      }
      number = rows[0].phone
    }

    if (!number || !message || !String(message).trim()) {
      return res.status(400).json({ error: 'Phone number and message are required' })
    }

    const waLink = buildWhatsAppLink(number, String(message).trim())
    res.json({ message: 'WhatsApp link ready', waLink })
  } catch (err) {
    console.error('Build WhatsApp message error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * PUT /api/admin/users/:id
 */
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const { firstName, lastName, email, password } = req.body

    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, role FROM users WHERE id = ?',
      [userId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = rows[0]
    if (user.role !== 'admin') {
      return res.status(400).json({ error: 'This action is for admin accounts only' })
    }

    if (firstName === undefined && lastName === undefined && email === undefined && password === undefined) {
      return res.status(400).json({ error: 'Nothing to update' })
    }

    if (email !== undefined && email !== user.email) {
      const [dup] = await db.query('SELECT id FROM users WHERE email = ? AND id <> ?', [email, userId])
      if (dup.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' })
      }
    }

    if (password !== undefined && String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' })
    }

    const sets = []
    const params = []
    if (firstName !== undefined) {
      sets.push('first_name = ?')
      params.push(String(firstName).trim())
    }
    if (lastName !== undefined) {
      sets.push('last_name = ?')
      params.push(String(lastName).trim())
    }
    if (email !== undefined) {
      sets.push('email = ?')
      params.push(email)
    }
    if (password !== undefined) {
      sets.push('password = ?')
      params.push(await bcrypt.hash(String(password), 10))
    }
    params.push(userId)

    await db.query(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`, params)

    const [updated] = await db.query(
      'SELECT id, first_name, last_name, email, phone, university, field_of_study, status, role FROM users WHERE id = ?',
      [userId]
    )
    const u = updated[0]

    res.json({
      message: 'Admin login details updated',
      user: {
        id: u.id,
        firstName: u.first_name,
        lastName: u.last_name,
        email: u.email,
        phone: u.phone,
        university: u.university,
        fieldOfStudy: u.field_of_study,
        status: u.status,
        role: u.role
      }
    })
  } catch (err) {
    console.error('Update admin details error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/admin/applications
 */
router.get('/applications', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.job_id, a.full_name, a.email, a.phone, a.university, a.field_of_study,
              a.cover_letter, a.experience, a.status, a.created_at,
              u.id AS student_id, u.first_name, u.last_name,
              j.title, j.company, j.location, j.type, j.salary
       FROM job_applications a
       JOIN users u ON a.student_id = u.id
       JOIN jobs j ON a.job_id = j.id
       ORDER BY (a.status = 'pending') DESC, a.created_at DESC`
    )

    res.json(rows.map(a => ({
      id: a.id,
      jobId: a.job_id,
      studentId: a.student_id,
      fullName: a.full_name,
      email: a.email,
      phone: a.phone,
      university: a.university,
      fieldOfStudy: a.field_of_study,
      coverLetter: a.cover_letter,
      experience: a.experience,
      status: a.status,
      appliedDate: a.created_at,
      jobTitle: a.title,
      company: a.company,
      location: a.location,
      jobType: a.type,
      salary: a.salary
    })))
  } catch (err) {
    console.error('Get applications error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * PATCH /api/admin/applications/:id
 */
router.patch('/applications/:id', async (req, res) => {
  try {
    const appId = req.params.id
    const { status } = req.body

    if (!['pending', 'shortlisted', 'hired', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be pending, shortlisted, hired or rejected' })
    }

    const [rows] = await db.query('SELECT id FROM job_applications WHERE id = ?', [appId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' })
    }

    await db.query('UPDATE job_applications SET status = ? WHERE id = ?', [status, appId])

    res.json({ message: `Application marked as ${status}`, status })
  } catch (err) {
    console.error('Update application status error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * PATCH /api/admin/users/:id
 */
router.patch('/users/:id', async (req, res) => {
  try {
    const { status } = req.body
    const userId = req.params.id

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Status must be "approved" or "rejected"' })
    }

    const [rows] = await db.query(
      'SELECT id, first_name, last_name, email, phone, university, field_of_study, status, role FROM users WHERE id = ?',
      [userId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' })
    }

    const user = rows[0]

    if (user.role === 'admin' && status !== 'approved') {
      return res.status(400).json({ error: 'Admin accounts cannot be rejected' })
    }

    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId])

    const notifications = []
    if (status === 'approved' && user.status !== 'approved') {
      const result = await sendAcceptanceNotification(user)
      if (Array.isArray(result)) {
        notifications.push(...result)
      } else if (result) {
        notifications.push(result)
      }
    }

    res.json({
      message: `User ${status}`,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        phone: user.phone,
        university: user.university,
        fieldOfStudy: user.field_of_study,
        status,
        role: user.role
      },
      notifications
    })
  } catch (err) {
    console.error('Update user status error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/admin/orders
 */
router.get('/orders', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT o.id, o.user_id, o.package_id, o.amount, o.status, o.payment_method, o.created_at,
              u.first_name, u.last_name, u.email, p.name AS package_name
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN packages p ON o.package_id = p.id
       ORDER BY o.created_at DESC`
    )

    res.json(rows.map(o => ({
      id: o.id,
      userId: o.user_id,
      studentName: `${o.first_name} ${o.last_name}`,
      studentEmail: o.email,
      packageName: o.package_name,
      amount: Number(o.amount),
      status: o.status,
      paymentMethod: o.payment_method,
      createdAt: o.created_at
    })))
  } catch (err) {
    console.error('Get admin orders error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/admin/packages
 */
router.get('/packages', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages ORDER BY price ASC')

    res.json(rows.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      description: p.description,
      maxUniversities: p.max_universities,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
      highlighted: !!p.highlighted
    })))
  } catch (err) {
    console.error('Get admin packages error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * PATCH /api/admin/packages/:id
 */
router.patch('/packages/:id', async (req, res) => {
  try {
    const packageId = req.params.id
    const { name, price, description, maxUniversities, features, highlighted } = req.body

    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [packageId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const p = rows[0]
    const next = {
      name: name !== undefined ? name : p.name,
      price: price !== undefined ? price : p.price,
      description: description !== undefined ? description : p.description,
      maxUniversities: maxUniversities !== undefined ? maxUniversities : p.max_universities,
      features: features !== undefined ? features : p.features,
      highlighted: highlighted !== undefined ? highlighted : !!p.highlighted
    }

    if (next.name === undefined || next.name === '') {
      return res.status(400).json({ error: 'Name cannot be empty' })
    }
    if (next.price === undefined || Number.isNaN(Number(next.price)) || Number(next.price) < 0) {
      return res.status(400).json({ error: 'Price must be a valid non-negative number' })
    }

    const featuresJson = Array.isArray(next.features)
      ? JSON.stringify(next.features)
      : next.features

    await db.query(
      `UPDATE packages
       SET name = ?, price = ?, description = ?, max_universities = ?, features = ?, highlighted = ?
       WHERE id = ?`,
      [next.name, next.price, next.description, next.maxUniversities, featuresJson, next.highlighted, packageId]
    )

    const [updated] = await db.query('SELECT * FROM packages WHERE id = ?', [packageId])
    const up = updated[0]

    res.json({
      message: 'Package updated',
      package: {
        id: up.id,
        name: up.name,
        price: Number(up.price),
        description: up.description,
        maxUniversities: up.max_universities,
        features: typeof up.features === 'string' ? JSON.parse(up.features) : up.features,
        highlighted: !!up.highlighted
      }
    })
  } catch (err) {
    console.error('Update package error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
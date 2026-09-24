import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import db from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Import Route Handlers (All using ES Module imports)
import portfolioRoutes from './routes/profile.js'
import contactRoutes from './routes/contact.js'
import authRoutes from './routes/auth.js'
import jobsRoutes from './routes/jobs.js'
import ordersRoutes from './routes/orders.js'
import packagesRoutes from './routes/packages.js'
import payfastRoutes from './routes/payfast.js'
import adminRoutes from './routes/admin.js'
import placementRoutes from './routes/placements.js'

// Load environment variables
dotenv.config()

const app = express()

// Global Middleware
app.use(cors())
app.use(express.json())


// =====================================================
// INSTITUTIONS API
// =====================================================

app.get('/api/institutions', async (req, res) => {
  try {
    const { province, status } = req.query

    let sql = 'SELECT * FROM institutions'
    const params = []
    const conditions = []

    if (province) {
      conditions.push('province = ?')
      params.push(province)
    }

    if (status) {
      conditions.push('application_status = ?')
      params.push(status)
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }

    sql += ' ORDER BY name ASC'

    const [rows] = await db.query(sql, params)

    res.json({
      success: true,
      count: rows.length,
      data: rows
    })
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error retrieving institutions'
    })
  }
})

app.get('/api/institutions/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM institutions WHERE institution_id = ?',
      [req.params.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Institution not found'
      })
    }

    res.json({
      success: true,
      data: rows[0]
    })
  } catch (error) {
    console.error('Database query error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error retrieving institution'
    })
  }
})


// =====================================================
// REMINDERS API
// =====================================================

app.post('/api/reminders', async (req, res) => {
  const { name, phone_number, phone, institution_id } = req.body
  const userPhone = phone || phone_number

  if (!userPhone || !institution_id) {
    return res.status(400).json({
      success: false,
      message: 'Phone number and institution ID are required.'
    })
  }

  try {
    await db.query(
      `INSERT INTO users (first_name, phone)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE
       first_name = VALUES(first_name)`,
      [name || 'Valued Student', userPhone]
    )

    const [[user]] = await db.query(
      'SELECT id FROM users WHERE phone = ?',
      [userPhone]
    )

    await db.query(
      `INSERT INTO institution_reminders (user_id, institution_id)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE notify_on_open = TRUE`,
      [user.id, institution_id]
    )

    res.status(201).json({
      success: true,
      message: 'Reminder set successfully!'
    })
  } catch (error) {
    console.error('Reminder subscription error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to set reminder.'
    })
  }
})


// =====================================================
// MOUNT ALL MODULE ROUTES
// =====================================================

app.use('/api/portfolio', portfolioRoutes)

app.use(
  '/api/contact',
  (req, res, next) => {
    console.log('CONTACT REQUEST:', req.method, req.originalUrl)
    next()
  },
  contactRoutes
)

// Public & User Endpoints
app.use('/api/auth', authRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/packages', packagesRoutes)
app.use('/api/payfast', payfastRoutes)

// Admin Endpoints
app.use('/api/admin', adminRoutes)
app.use('/api/placements', placementRoutes)


// =====================================================
// STATIC SPA (production build of the frontend)
// Serves frontend/dist if it exists, with a SPA fallback so
// client-side routes (/institutions, /jobs, /payment ...) work.
// =====================================================

const distDir = path.join(__dirname, '..', 'frontend', 'dist')

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) return next()
    res.sendFile(path.join(distDir, 'index.html'))
  })
  console.log(`Serving built frontend from ${distDir}`)
}


// =====================================================
// ROOT / SERVER TEST
// =====================================================

app.get('/', (req, res) => {
  res.json({
    message: 'ApplyDirect-SA Unified Backend is running',
    status: 'OK'
  })
})


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
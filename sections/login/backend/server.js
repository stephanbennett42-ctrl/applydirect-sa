/**
 * UniApply — Login Server Entry Point
 * Express.js backend serving the REST API for the login frontend.
 * Connects to MySQL via XAMPP and shares the uniapply users table.
 */
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import authRoutes from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3006

// ============================================
// Middleware
// ============================================
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3007',
  credentials: true
}))
app.use(express.json())

// Request logging (simple)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`)
  next()
})

// ============================================
// API Routes
// ============================================
app.use('/api/auth', authRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', module: 'login', timestamp: new Date().toISOString() })
})

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
  console.log(`UniApply Login API running on http://localhost:${PORT}`)
  console.log(`Connected to MySQL database: ${process.env.DB_NAME || 'uniapply'}`)
})
/**
 * Package Routes
 * GET /api/packages       — List all available packages (public)
 * GET /api/packages/:id   — Get a single package by ID (public)
 */
import { Router } from 'express'
import db from '../db.js'

const router = Router()

/**
 * GET /api/packages
 * Returns all available service packages.
 * Public endpoint — no auth required.
 */
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages ORDER BY price ASC')

    // Parse the features JSON string into an array for each package
    const packages = rows.map(p => ({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      description: p.description,
      maxUniversities: p.max_universities,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
      highlighted: !!p.highlighted
    }))

    res.json(packages)
  } catch (err) {
    console.error('Get packages error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/packages/:id
 * Returns a single package by ID.
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [req.params.id])

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' })
    }

    const p = rows[0]
    res.json({
      id: p.id,
      name: p.name,
      price: Number(p.price),
      description: p.description,
      maxUniversities: p.max_universities,
      features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
      highlighted: !!p.highlighted
    })
  } catch (err) {
    console.error('Get package error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

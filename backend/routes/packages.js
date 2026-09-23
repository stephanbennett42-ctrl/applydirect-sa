/**
 * Packages Routes
 * Location: backend/routes/packages.js
 */
import { Router } from 'express'
import db from '../db.js'

const router = Router()

function mapPackage(p) {
  return {
    id: p.id,
    name: p.name,
    price: Number(p.price),
    description: p.description,
    maxUniversities: p.max_universities,
    features: typeof p.features === 'string' ? JSON.parse(p.features) : p.features,
    highlighted: !!p.highlighted,
  }
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages ORDER BY price ASC')
    res.json(rows.map(mapPackage))
  } catch (err) {
    console.error('Get packages error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packages WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Package not found' })
    }
    res.json(mapPackage(rows[0]))
  } catch (err) {
    console.error('Get package error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
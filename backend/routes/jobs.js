/**
 * Admin Graduate Jobs Routes
 * Location: backend/routes/jobs.js
 */
import { Router } from 'express'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAdmin)

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM jobs ORDER BY active DESC, created_at DESC'
    )

    res.json(rows.map(r => ({
      id: r.id,
      title: r.title,
      company: r.company,
      location: r.location,
      field: r.field,
      type: r.type,
      salary: r.salary,
      description: r.description,
      active: !!r.active,
      createdAt: r.created_at
    })))
  } catch (err) {
    console.error('Admin get jobs error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, company, location, field, type, salary, description } = req.body

    if (!title || !company || !field) {
      return res.status(400).json({ error: 'Title, company, and field are required' })
    }

    const validTypes = ['full-time', 'part-time', 'internship', 'contract']
    const jobType = validTypes.includes(type) ? type : 'full-time'

    const [result] = await db.query(
      'INSERT INTO jobs (title, company, location, field, type, salary, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, company, location || null, field, jobType, salary || null, description || null]
    )

    res.status(201).json({
      message: 'Job created',
      job: {
        id: result.insertId,
        title,
        company,
        location: location || null,
        field,
        type: jobType,
        salary: salary || null,
        description: description || null,
        active: true
      }
    })
  } catch (err) {
    console.error('Admin create job error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const jobId = req.params.id

    const [rows] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const existing = rows[0]
    const { title, company, location, field, type, salary, description, active } = req.body

    const validTypes = ['full-time', 'part-time', 'internship', 'contract']

    await db.query(
      `UPDATE jobs
       SET title = ?, company = ?, location = ?, field = ?, type = ?, salary = ?, description = ?, active = ?
       WHERE id = ?`,
      [
        title !== undefined ? title : existing.title,
        company !== undefined ? company : existing.company,
        location !== undefined ? location : existing.location,
        field !== undefined ? field : existing.field,
        type !== undefined && validTypes.includes(type) ? type : existing.type,
        salary !== undefined ? salary : existing.salary,
        description !== undefined ? description : existing.description,
        active !== undefined ? !!active : !!existing.active,
        jobId
      ]
    )

    const [updated] = await db.query('SELECT * FROM jobs WHERE id = ?', [jobId])
    const r = updated[0]

    res.json({
      message: 'Job updated',
      job: {
        id: r.id,
        title: r.title,
        company: r.company,
        location: r.location,
        field: r.field,
        type: r.type,
        salary: r.salary,
        description: r.description,
        active: !!r.active
      }
    })
  } catch (err) {
    console.error('Admin update job error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM jobs WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' })
    }

    await db.query('DELETE FROM jobs WHERE id = ?', [req.params.id])
    res.json({ message: 'Job deleted' })
  } catch (err) {
    console.error('Admin delete job error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
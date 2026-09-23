/**
 * Admin Placements Routes
 * Location: backend/routes/placements.js
 */
import { Router } from 'express'
import db from '../db.js'
import { requireAdmin } from '../middleware/auth.js'

const router = Router()
router.use(requireAdmin)

const COMMISSION_RATE = 0.05
const MAX_MONTHS = 24

function monthsBetween(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth())
}

function enrichPlacement(row) {
  const monthsActive = Math.min(monthsBetween(row.employment_start, new Date()), MAX_MONTHS)
  const monthlyCommission = (row.salary * COMMISSION_RATE) / 12
  const totalCommission = monthlyCommission * Math.max(monthsActive, 0)
  return {
    id: row.id,
    studentId: row.student_id,
    studentName: row.student_name,
    studentEmail: row.student_email,
    jobId: row.job_id,
    jobTitle: row.job_title,
    company: row.company,
    salary: row.salary,
    employmentStart: row.employment_start,
    monthsActive: Math.max(monthsActive, 0),
    monthlyCommission: Math.round(monthlyCommission * 100) / 100,
    totalCommission: Math.round(totalCommission * 100) / 100,
    status: monthsActive >= MAX_MONTHS ? 'completed' : 'active',
    createdAt: row.created_at
  }
}

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT p.*,
             CONCAT(u.first_name, ' ', u.last_name) AS student_name, u.email AS student_email,
             j.title AS job_title, j.company
      FROM placements p
      JOIN users u ON p.student_id = u.id
      JOIN jobs j ON p.job_id = j.id
      ORDER BY p.employment_start DESC
    `)

    res.json(rows.map(enrichPlacement))
  } catch (err) {
    console.error('Admin get placements error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { studentId, jobId, salary, employmentStart } = req.body

    if (!studentId || !jobId || !salary || !employmentStart) {
      return res.status(400).json({ error: 'studentId, jobId, salary, and employmentStart are required' })
    }

    const numSalary = Number(salary)
    if (isNaN(numSalary) || numSalary <= 0) {
      return res.status(400).json({ error: 'Salary must be a positive number' })
    }

    const [students] = await db.query('SELECT id, first_name, last_name, email FROM users WHERE id = ?', [studentId])
    if (students.length === 0) {
      return res.status(404).json({ error: 'Student not found' })
    }

    const [jobs] = await db.query('SELECT id, title, company FROM jobs WHERE id = ?', [jobId])
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const [result] = await db.query(
      'INSERT INTO placements (student_id, job_id, salary, employment_start) VALUES (?, ?, ?, ?)',
      [studentId, jobId, numSalary, employmentStart]
    )

    res.status(201).json({
      message: 'Placement recorded',
      placement: enrichPlacement({
        id: result.insertId,
        student_id: studentId,
        student_name: `${students[0].first_name} ${students[0].last_name}`,
        student_email: students[0].email,
        job_id: jobId,
        job_title: jobs[0].title,
        company: jobs[0].company,
        salary: numSalary,
        employment_start: employmentStart,
        created_at: new Date()
      })
    })
  } catch (err) {
    console.error('Admin create placement error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/:id', async (req, res) => {
  try {
    const placementId = req.params.id
    const [existing] = await db.query('SELECT * FROM placements WHERE id = ?', [placementId])
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Placement not found' })
    }

    const cur = existing[0]
    const { salary, employmentStart } = req.body

    await db.query(
      'UPDATE placements SET salary = ?, employment_start = ? WHERE id = ?',
      [
        salary !== undefined ? Number(salary) : cur.salary,
        employmentStart || cur.employment_start,
        placementId
      ]
    )

    const [rows] = await db.query(`
      SELECT p.*,
             CONCAT(u.first_name, ' ', u.last_name) AS student_name, u.email AS student_email,
             j.title AS job_title, j.company
      FROM placements p
      JOIN users u ON p.student_id = u.id
      JOIN jobs j ON p.job_id = j.id
      WHERE p.id = ?
    `, [placementId])

    res.json({ message: 'Placement updated', placement: enrichPlacement(rows[0]) })
  } catch (err) {
    console.error('Admin update placement error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id FROM placements WHERE id = ?', [req.params.id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Placement not found' })
    }

    await db.query('DELETE FROM placements WHERE id = ?', [req.params.id])
    res.json({ message: 'Placement deleted' })
  } catch (err) {
    console.error('Admin delete placement error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
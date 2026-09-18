/**
 * Graduate Jobs Routes (Subscription module)
 * GET /api/jobs            — List active jobs (public), optional ?field=, ?type=, ?q=
 * GET /api/jobs/fields     — List distinct fields with job counts
 * GET /api/jobs/applications — Current user's job applications (auth)
 * POST /api/jobs/:id/apply — Apply to a job (auth)
 * GET /api/jobs/:id        — Get a single active job
 */
import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

/**
 * GET /api/jobs/fields
 * Returns an array of { field, count } for all active jobs.
 * Must be defined before /:id to avoid catching 'fields' as an id.
 */
router.get('/fields', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT field, COUNT(*) AS count FROM jobs WHERE active = TRUE GROUP BY field ORDER BY field'
    )
    res.json(rows.map(r => ({ field: r.field, count: r.count })))
  } catch (err) {
    console.error('Get job fields error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/jobs
 * List active jobs. Query params: field, type, q (search title/company/description).
 */
router.get('/', async (req, res) => {
  try {
    const conditions = ['active = TRUE']
    const params = []

    if (req.query.field) {
      conditions.push('field = ?')
      params.push(req.query.field)
    }

    if (req.query.type) {
      conditions.push('type = ?')
      params.push(req.query.type)
    }

    if (req.query.q) {
      conditions.push('(title LIKE ? OR company LIKE ? OR description LIKE ? OR location LIKE ?)')
      const term = `%${req.query.q}%`
      params.push(term, term, term, term)
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''
    const [rows] = await db.query(
      `SELECT id, title, company, location, field, type, salary, description, created_at
       FROM jobs ${where}
       ORDER BY created_at DESC`,
      params
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
      postedDate: r.created_at
    })))
  } catch (err) {
    console.error('Get jobs error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/jobs/applications
 * Returns the current user's job applications with job details.
 * Must be defined before /:id to avoid catching 'applications' as an id.
 */
router.get('/applications', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id, a.job_id, a.full_name, a.email, a.phone, a.university, a.field_of_study,
              a.cover_letter, a.experience, a.status, a.created_at,
              j.title, j.company, j.location, j.field AS job_field, j.type, j.salary
       FROM job_applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.student_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    )

    res.json(rows.map(a => ({
      id: a.id,
      jobId: a.job_id,
      fullName: a.full_name,
      email: a.email,
      phone: a.phone,
      university: a.university,
      fieldOfStudy: a.field_of_study,
      coverLetter: a.cover_letter,
      experience: a.experience,
      status: a.status,
      appliedDate: a.created_at,
      job: {
        id: a.job_id,
        title: a.title,
        company: a.company,
        location: a.location,
        field: a.job_field,
        type: a.type,
        salary: a.salary
      }
    })))
  } catch (err) {
    console.error('Get my applications error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * POST /api/jobs/:id/apply
 * Submit a job application for the current user.
 * Body: { fullName, email, phone, university, fieldOfStudy, coverLetter, experience }
 * fullName, email and coverLetter are required.
 */
router.post('/:id/apply', requireAuth, async (req, res) => {
  try {
    const jobId = req.params.id
    const {
      fullName,
      email,
      phone,
      university,
      fieldOfStudy,
      coverLetter,
      experience
    } = req.body

    if (!fullName || !email || !coverLetter || !String(coverLetter).trim()) {
      return res.status(400).json({
        error: 'Your full name, email and a cover letter are required'
      })
    }

    const [jobRows] = await db.query('SELECT id FROM jobs WHERE id = ? AND active = TRUE', [jobId])
    if (jobRows.length === 0) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const [dup] = await db.query(
      'SELECT id FROM job_applications WHERE job_id = ? AND student_id = ?',
      [jobId, req.user.id]
    )
    if (dup.length > 0) {
      return res.status(409).json({ error: 'You have already applied for this job' })
    }

    const [result] = await db.query(
      `INSERT INTO job_applications
        (job_id, student_id, full_name, email, phone, university, field_of_study, cover_letter, experience)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId,
        req.user.id,
        fullName,
        email,
        phone || null,
        university || null,
        fieldOfStudy || null,
        String(coverLetter).trim(),
        experience || null
      ]
    )

    res.status(201).json({
      message: 'Application submitted successfully',
      application: {
        id: result.insertId,
        jobId,
        fullName,
        email,
        status: 'pending'
      }
    })
  } catch (err) {
    console.error('Apply to job error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

/**
 * GET /api/jobs/:id
 * Returns a single active job.
 */
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM jobs WHERE id = ? AND active = TRUE',
      [req.params.id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' })
    }

    const r = rows[0]
    res.json({
      id: r.id,
      title: r.title,
      company: r.company,
      location: r.location,
      field: r.field,
      type: r.type,
      salary: r.salary,
      description: r.description,
      postedDate: r.created_at
    })
  } catch (err) {
    console.error('Get job error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router

/**
 * Portfolio Profile Routes
 * Location: backend/routes/profile.js
 */
import { Router } from 'express'
import db from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

// GET /api/profile/:id - Get portfolio by user/profile ID
router.get('/:profile_id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM portfolios WHERE id = ? OR user_id = ?', [req.params.profile_id, req.params.profile_id])
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' })
    }
    res.json(rows[0])
  } catch (err) {
    console.error('Get profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/profile - Create portfolio
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, bio, skills, githubUrl, linkedinUrl } = req.body
    
    const [result] = await db.query(
      'INSERT INTO portfolios (user_id, title, bio, skills, github_url, linkedin_url) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title || '', bio || '', skills || '', githubUrl || '', linkedinUrl || '']
    )

    res.status(201).json({
      message: 'Profile created successfully',
      profileId: result.insertId
    })
  } catch (err) {
    console.error('Create profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/profile/:id - Update portfolio
router.put('/:profile_id', requireAuth, async (req, res) => {
  try {
    const { title, bio, skills, githubUrl, linkedinUrl } = req.body
    
    await db.query(
      'UPDATE portfolios SET title = ?, bio = ?, skills = ?, github_url = ?, linkedin_url = ? WHERE id = ? AND user_id = ?',
      [title, bio, skills, githubUrl, linkedinUrl, req.params.profile_id, req.user.id]
    )

    res.json({ message: 'Profile updated successfully' })
  } catch (err) {
    console.error('Update profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/profile/:id - Delete portfolio
router.delete('/:profile_id', requireAuth, async (req, res) => {
  try {
    await db.query('DELETE FROM portfolios WHERE id = ? AND user_id = ?', [req.params.profile_id, req.user.id])
    res.json({ message: 'Profile deleted successfully' })
  } catch (err) {
    console.error('Delete profile error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
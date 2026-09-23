/**
 * Contact Routes
 * Location: backend/routes/contact.js
 */
import { Router } from 'express'
import * as contact from '../controllers/contact.js'

const router = Router()

router.post('/', contact.sendMessage)
router.get('/', contact.getMessages)
router.put('/:id', contact.updateMessage)
router.delete('/:id', contact.deleteMessage)

export default router
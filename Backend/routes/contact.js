const express = require('express');

const router = express.Router();

const contact = require('../controllers/contact');

console.log('CONTACT ROUTES LOADED');

// Contact form
router.post('/', contact.sendMessage);
 
// Get all messages
router.get('/', contact.getMessages);

// Update message status
router.put('/:id', contact.updateMessage);

// Delete contact message
router.delete('/:id', contact.deleteMessage);

module.exports = router;
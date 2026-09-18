const express = require('express');

const router = express.Router();

const contact = require('../controllers/contact');

// These routes are mounted under the contact API path by the main server.
console.log('CONTACT ROUTES LOADED');

// Create a new message submitted through the contact form.
router.post('/', contact.sendMessage);
 
// Return all contact messages for administrative use.
router.get('/', contact.getMessages);

// Update one message by its database ID, such as marking it as resolved.
router.put('/:id', contact.updateMessage);

// Delete one contact message by its database ID.
router.delete('/:id', contact.deleteMessage);

module.exports = router;
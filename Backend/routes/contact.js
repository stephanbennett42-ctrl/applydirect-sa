const express = require('express');

const router = express.Router();

const contact = require('../controllers/contact');

console.log('CONTACT ROUTES LOADED');

// Test route
router.get('/', (req, res) => {
    res.json({
        message: 'Contact route is working'
    });
});

// Contact form
router.post('/', contact.sendMessage);

module.exports = router;
const express = require('express');

const {
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require('../controllers/profile');

const router = express.Router();

// Return one portfolio profile using its profile ID.
router.get('/:profile_id', getPortfolio);

// Create a new portfolio profile.
router.post('/', createPortfolio);

// Update an existing portfolio profile using its profile ID.
router.put('/:profile_id', updatePortfolio);

// Delete an existing portfolio profile using its profile ID.
router.delete('/:profile_id', deletePortfolio);

module.exports = router;
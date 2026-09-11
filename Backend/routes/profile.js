const express = require('express');

const {
    getPortfolio,
    createPortfolio,
    updatePortfolio,
    deletePortfolio
} = require('../controllers/profile');

const router = express.Router();

// READ
router.get('/:profile_id', getPortfolio);

// CREATE
router.post('/', createPortfolio);

// UPDATE
router.put('/:profile_id', updatePortfolio);

// DELETE
router.delete('/:profile_id', deletePortfolio);

module.exports = router;
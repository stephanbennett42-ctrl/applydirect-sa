const express = require('express');

const {
    getPortfolio
} = require('../controllers/profile');

const router = express.Router();

router.get('/:profile_id', getPortfolio);

module.exports = router;
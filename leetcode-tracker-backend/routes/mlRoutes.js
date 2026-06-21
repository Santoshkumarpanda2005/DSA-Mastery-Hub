const express = require('express');
const router = express.Router();
const mlController = require('../controllers/mlController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/analytics', authMiddleware, mlController.getAnalytics);

module.exports = router;

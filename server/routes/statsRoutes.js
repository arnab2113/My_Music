const express = require('express');
const router = express.Router();
const { getUserStats, getAdminAnalytics } = require('../controllers/statsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/user', protect, getUserStats);
router.get('/admin', protect, admin, getAdminAnalytics);

module.exports = router;

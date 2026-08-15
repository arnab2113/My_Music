const express = require('express');
const router = express.Router();
const { getThemes, createTheme } = require('../controllers/themeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getThemes);
router.post('/', protect, admin, createTheme);

module.exports = router;

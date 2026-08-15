const express = require('express');
const router = express.Router();
const { addHistory, getHistory } = require('../controllers/historyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getHistory);
router.post('/', protect, addHistory);

module.exports = router;

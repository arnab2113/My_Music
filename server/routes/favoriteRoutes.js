const express = require('express');
const router = express.Router();
const { toggleFavorite, addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getFavorites);
router.post('/toggle', protect, toggleFavorite);
router.post('/:songId', protect, addFavorite);
router.delete('/:songId', protect, removeFavorite);

module.exports = router;

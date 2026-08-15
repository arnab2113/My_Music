const express = require('express');
const router = express.Router();
const { getSongs, getSongById, incrementPlayCount, createSong, updateSong, deleteSong, clearAllSongs } = require('../controllers/songController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getSongs);
router.delete('/clear/all', protect, admin, clearAllSongs);
router.get('/:id', getSongById);
router.post('/:id/play', incrementPlayCount);
router.post('/', protect, admin, createSong);
router.put('/:id', protect, admin, updateSong);
router.delete('/:id', protect, admin, deleteSong);

module.exports = router;

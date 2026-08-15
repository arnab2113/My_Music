const express = require('express');
const router = express.Router();
const { getArtists, getArtistById, createArtist, updateArtist, deleteArtist } = require('../controllers/artistController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getArtists);
router.get('/:id', getArtistById);
router.post('/', protect, admin, createArtist);
router.put('/:id', protect, admin, updateArtist);
router.delete('/:id', protect, admin, deleteArtist);

module.exports = router;

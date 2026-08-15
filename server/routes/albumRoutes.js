const express = require('express');
const router = express.Router();
const { getAlbums, getAlbumById, createAlbum, updateAlbum, deleteAlbum } = require('../controllers/albumController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getAlbums);
router.get('/:id', getAlbumById);
router.post('/', protect, admin, createAlbum);
router.put('/:id', protect, admin, updateAlbum);
router.delete('/:id', protect, admin, deleteAlbum);

module.exports = router;

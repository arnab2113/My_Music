const express = require('express');
const router = express.Router();
const {
  getUserPlaylists,
  getPlaylistById,
  createPlaylist,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUserPlaylists);
router.get('/:id', protect, getPlaylistById);
router.post('/', protect, createPlaylist);
router.put('/:id', protect, updatePlaylist);
router.delete('/:id', protect, deletePlaylist);

// Standard REST & Client support
router.post('/:id/songs', protect, addSongToPlaylist);
router.delete('/:id/songs/:songId', protect, removeSongFromPlaylist);
router.post('/:id/add', protect, addSongToPlaylist);
router.post('/:id/remove', protect, removeSongFromPlaylist);

module.exports = router;

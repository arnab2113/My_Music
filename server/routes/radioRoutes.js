const express = require('express');
const router = express.Router();
const { getStations, getStationBySlug, createStation, updateStation, deleteStation } = require('../controllers/radioController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getStations);
router.get('/:slug', getStationBySlug);
router.post('/', protect, admin, createStation);
router.put('/:id', protect, admin, updateStation);
router.delete('/:id', protect, admin, deleteStation);

module.exports = router;

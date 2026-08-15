const express = require('express');
const router = express.Router();
const { getAmbientSounds } = require('../controllers/ambienceController');

router.get('/', getAmbientSounds);

module.exports = router;

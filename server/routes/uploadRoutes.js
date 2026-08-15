const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc Upload audio or image file
// @route POST /api/upload
router.post('/', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an audio or image file' });
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename
  });
});

module.exports = router;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadsDir);
  },
  filename(req, file, cb) {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${file.fieldname}-${Date.now()}-${sanitizedName}`);
  }
});

function checkFileType(file, cb) {
  const allowedExtensions = /jpeg|jpg|png|webp|svg|mp3|wav|ogg|aac|flac|m4a/;
  const allowedMimeTypes = /image\/(jpeg|png|webp|svg\+xml)|audio\/(mpeg|wav|ogg|aac|flac|mp4|x-m4a|m4a)/;

  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedMimeTypes.test(file.mimetype) || allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type! Only audio (MP3, WAV, OGG, M4A, FLAC) and image (JPEG, PNG, WEBP, SVG) files are allowed.'));
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB max limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;

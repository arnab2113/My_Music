const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    cover: { type: String, default: '' },
    releaseYear: { type: Number, default: 1996 },
    description: { type: String, default: '' },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }]
  },
  { timestamps: true }
);

albumSchema.index({ title: 'text', releaseYear: 1 });

module.exports = mongoose.model('Album', albumSchema);

const mongoose = require('mongoose');

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    artistName: { type: String, default: '' },
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' },
    albumName: { type: String, default: 'Single' },
    duration: { type: Number, required: true, default: 180 }, // in seconds
    audioUrl: { type: String, required: true },
    coverUrl: { type: String, default: '' },
    lyrics: { type: String, default: '' },
    genre: { type: String, required: true, default: '90s Classics' },
    language: { type: String, required: true, default: 'Hindi' },
    releaseYear: { type: Number, default: 1995 },
    playsCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true }
  },
  { timestamps: true }
);

songSchema.index({ title: 'text', genre: 1, language: 1, releaseYear: 1 }, { language_override: 'none' });

module.exports = mongoose.model('Song', songSchema);

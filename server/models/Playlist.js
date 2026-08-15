const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    cover: { type: String, default: '' },
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

playlistSchema.index({ user: 1, name: 1 });

module.exports = mongoose.model('Playlist', playlistSchema);

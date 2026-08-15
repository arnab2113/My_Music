const mongoose = require('mongoose');

const radioStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    language: { type: String, required: true, default: 'Hindi' },
    genre: { type: String, required: true, default: '90s Classics' },
    icon: { type: String, default: 'Radio' },
    cover: { type: String, default: '' },
    background: { type: String, default: '' },
    songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    currentSongIndex: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    listenerCount: { type: Number, default: 0 },
    defaultTheme: { type: String, default: 'vintage-radio' },
    defaultAmbience: { type: String, default: 'vinyl' }
  },
  { timestamps: true }
);

radioStationSchema.index({ slug: 1, language: 1, genre: 1 });

module.exports = mongoose.model('RadioStation', radioStationSchema);

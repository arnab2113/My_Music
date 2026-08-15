const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    bio: { type: String, default: '' },
    image: { type: String, default: '' },
    genre: { type: String, default: '90s Retro' },
    socialLinks: {
      spotify: { type: String, default: '' },
      youtube: { type: String, default: '' }
    }
  },
  { timestamps: true }
);

artistSchema.index({ name: 'text' });

module.exports = mongoose.model('Artist', artistSchema);

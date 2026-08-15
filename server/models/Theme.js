const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema(
  {
    themeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    colors: {
      background: { type: String, default: '#0a0a0c' },
      surface: { type: String, default: '#121216' },
      surfaceElevated: { type: String, default: '#1a1a22' },
      textPrimary: { type: String, default: '#f3f4f6' },
      textSecondary: { type: String, default: '#9ca3af' },
      accent: { type: String, default: '#f59e0b' },
      accentGlow: { type: String, default: 'rgba(245, 158, 11, 0.4)' },
      border: { type: String, default: 'rgba(255, 255, 255, 0.08)' }
    },
    particles: { type: String, enum: ['dust', 'stars', 'rain', 'fireflies', 'none'], default: 'dust' },
    ambience: { type: String, default: 'rain' },
    visualizerStyle: { type: String, enum: ['bars', 'waveform', 'circle', 'spectrum', 'particles'], default: 'bars' },
    backgroundImage: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Theme', themeSchema);

const mongoose = require('mongoose');

const ambientSoundSchema = new mongoose.Schema(
  {
    soundId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'Volume2' },
    audioUrl: { type: String, required: true },
    defaultVolume: { type: Number, default: 0.4 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('AmbientSound', ambientSoundSchema);

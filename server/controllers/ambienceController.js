const AmbientSound = require('../models/AmbientSound');

exports.getAmbientSounds = async (req, res) => {
  try {
    const sounds = await AmbientSound.find({});
    res.json(sounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

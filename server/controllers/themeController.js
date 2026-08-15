const Theme = require('../models/Theme');

exports.getThemes = async (req, res) => {
  try {
    const themes = await Theme.find({});
    res.json(themes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTheme = async (req, res) => {
  try {
    const theme = new Theme(req.body);
    const saved = await theme.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

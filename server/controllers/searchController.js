const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const RadioStation = require('../models/RadioStation');

exports.searchAll = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q.trim()) {
      return res.json({ songs: [], artists: [], albums: [], stations: [] });
    }

    const regex = new RegExp(q, 'i');

    const [songs, artists, albums, stations] = await Promise.all([
      Song.find({ $or: [{ title: regex }, { genre: regex }, { language: regex }] }).populate('artist', 'name').limit(10),
      Artist.find({ name: regex }).limit(6),
      Album.find({ title: regex }).populate('artist', 'name').limit(6),
      RadioStation.find({ $or: [{ name: regex }, { genre: regex }, { language: regex }] }).limit(6)
    ]);

    res.json({ songs, artists, albums, stations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

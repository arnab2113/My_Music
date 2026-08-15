const Artist = require('../models/Artist');
const Song = require('../models/Song');

exports.getArtists = async (req, res) => {
  try {
    const artists = await Artist.find({}).sort({ name: 1 });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    const songs = await Song.find({ artist: artist._id });
    res.json({ artist, songs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createArtist = async (req, res) => {
  try {
    const artist = new Artist(req.body);
    const saved = await artist.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    res.json(artist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) return res.status(404).json({ message: 'Artist not found' });
    await artist.deleteOne();
    res.json({ message: 'Artist removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const Album = require('../models/Album');
const Song = require('../models/Song');

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({}).populate('artist', 'name image').sort({ releaseYear: -1 });
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist').populate('songs');
    if (!album) return res.status(404).json({ message: 'Album not found' });
    const songs = await Song.find({ album: album._id }).populate('artist', 'name');
    res.json({ album, songs: songs.length ? songs : album.songs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAlbum = async (req, res) => {
  try {
    const album = new Album(req.body);
    const saved = await album.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    await album.deleteOne();
    res.json({ message: 'Album removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

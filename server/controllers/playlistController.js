const Playlist = require('../models/Playlist');

exports.getUserPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user._id })
      .populate({
        path: 'songs',
        populate: { path: 'artist', select: 'name' }
      })
      .sort({ updatedAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found' });
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPlaylist = async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Playlist name is required' });
    }
    const playlist = new Playlist({
      name: name.trim(),
      description: description || '',
      isPublic: isPublic !== undefined ? isPublic : true,
      user: req.user._id,
      songs: []
    });
    const saved = await playlist.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addSongToPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized' });

    const songId = req.body.songId || req.params.songId;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    if (!playlist.songs.map((s) => s.toString()).includes(songId.toString())) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    const updated = await Playlist.findById(playlist._id).populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeSongFromPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized' });

    const songId = req.body.songId || req.params.songId;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    playlist.songs = playlist.songs.filter((s) => s.toString() !== songId.toString());
    await playlist.save();

    const updated = await Playlist.findById(playlist._id).populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized' });

    if (req.body.name) playlist.name = req.body.name.trim();
    if (req.body.description !== undefined) playlist.description = req.body.description;
    if (req.body.isPublic !== undefined) playlist.isPublic = req.body.isPublic;

    const updated = await playlist.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!playlist) return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

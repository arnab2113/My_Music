const User = require('../models/User');

exports.toggleFavorite = async (req, res) => {
  try {
    const songId = req.body.songId || req.params.songId;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFav = user.favorites.map((id) => id.toString()).includes(songId.toString());
    if (isFav) {
      user.favorites = user.favorites.filter((id) => id.toString() !== songId.toString());
    } else {
      user.favorites.push(songId);
    }

    await user.save();
    const updatedUser = await User.findById(user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'artist', select: 'name' },
        { path: 'album', select: 'title cover' }
      ]
    });

    res.json({
      isFavorite: !isFav,
      favorites: updatedUser.favorites
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const songId = req.params.songId || req.body.songId;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.favorites.map((id) => id.toString()).includes(songId.toString())) {
      user.favorites.push(songId);
      await user.save();
    }

    const updatedUser = await User.findById(user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'artist', select: 'name' },
        { path: 'album', select: 'title cover' }
      ]
    });

    res.json({ message: 'Added to favorites', favorites: updatedUser.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const songId = req.params.songId || req.body.songId;
    if (!songId) {
      return res.status(400).json({ message: 'Song ID is required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.favorites = user.favorites.filter((id) => id.toString() !== songId.toString());
    await user.save();

    const updatedUser = await User.findById(user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'artist', select: 'name' },
        { path: 'album', select: 'title cover' }
      ]
    });

    res.json({ message: 'Removed from favorites', favorites: updatedUser.favorites });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'artist', select: 'name' },
        { path: 'album', select: 'title cover' }
      ]
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

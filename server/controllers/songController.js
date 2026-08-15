const Song = require('../models/Song');
const RadioStation = require('../models/RadioStation');

// @desc Get all songs with pagination & filters
// @route GET /api/songs
exports.getSongs = async (req, res) => {
  try {
    const { genre, language, artist, album, era, search } = req.query;
    let query = { isPublished: true };

    if (genre) query.genre = { $regex: genre, $options: 'i' };
    if (language) query.language = { $regex: language, $options: 'i' };
    if (artist) query.artist = artist;
    if (album) query.album = album;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
        { albumName: { $regex: search, $options: 'i' } }
      ];
    }
    if (era) {
      if (era === '80s') query.releaseYear = { $gte: 1980, $lte: 1989 };
      if (era === '90s') query.releaseYear = { $gte: 1990, $lte: 1999 };
      if (era === '2000s') query.releaseYear = { $gte: 2000, $lte: 2009 };
    }

    const songs = await Song.find(query)
      .populate('artist', 'name image')
      .populate('album', 'title cover')
      .sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single song
// @route GET /api/songs/:id
exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id).populate('artist').populate('album');
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Increment song play count
// @route POST /api/songs/:id/play
exports.incrementPlayCount = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, { $inc: { playsCount: 1 } }, { new: true });
    if (!song) return res.status(404).json({ message: 'Song not found' });
    res.json({ playsCount: song.playsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Create new song and assign to Radio Station / Language Section
// @route POST /api/songs
exports.createSong = async (req, res) => {
  try {
    const { title, artist, artistName, album, albumName, duration, audioUrl, coverUrl, lyrics, genre, language, releaseYear, stationId } = req.body;

    if (!title || !artistName) {
      return res.status(400).json({ message: 'Song Title and Artist Name are required' });
    }

    const finalAudioUrl = audioUrl && audioUrl.trim()
      ? audioUrl.trim()
      : 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3';

    // Auto-detect Language if genre is chosen
    let autoLanguage = language || 'Hindi';
    if (genre && genre.includes('Bengali')) autoLanguage = 'Bengali';
    if (genre && genre.includes('Bhojpuri')) autoLanguage = 'Bhojpuri';
    if (genre && (genre.includes('Instrumental') || genre.includes('Lo-Fi'))) autoLanguage = 'Instrumental';

    const song = new Song({
      title: title.trim(),
      artist: artist || undefined,
      artistName: artistName.trim(),
      album: album || undefined,
      albumName: albumName || 'Single',
      duration: Number(duration) || 240,
      audioUrl: finalAudioUrl,
      coverUrl: coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80',
      lyrics: lyrics || '',
      genre: genre || 'Hindi 90s Classics',
      language: autoLanguage,
      releaseYear: Number(releaseYear) || 2024
    });

    const createdSong = await song.save();

    // Automatically link to target Radio Station / Section
    try {
      if (stationId) {
        await RadioStation.findByIdAndUpdate(stationId, { $addToSet: { songs: createdSong._id } });
      }
      // Auto link to stations matching language, genre, or mixed-radio
      await RadioStation.updateMany(
        { $or: [{ language: autoLanguage }, { genre: { $regex: genre || '', $options: 'i' } }, { slug: 'mixed-radio' }] },
        { $addToSet: { songs: createdSong._id } }
      );
    } catch (stErr) {
      console.warn('Radio Station auto-link warning:', stErr.message);
    }

    res.status(201).json(createdSong);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create song' });
  }
};

// @desc Admin: Update song
// @route PUT /api/songs/:id
exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });

    Object.assign(song, req.body);
    const updatedSong = await song.save();
    res.json(updatedSong);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Delete song
// @route DELETE /api/songs/:id
exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) return res.status(404).json({ message: 'Song not found' });
    await song.deleteOne();
    // Remove reference from RadioStations
    await RadioStation.updateMany({ songs: req.params.id }, { $pull: { songs: req.params.id } });
    res.json({ message: 'Song removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Admin: Clear all songs archive (leave clean canvas for custom songs)
// @route DELETE /api/songs/clear/all
exports.clearAllSongs = async (req, res) => {
  try {
    await Song.deleteMany({});
    await RadioStation.updateMany({}, { $set: { songs: [] } });
    res.json({ message: 'All demo songs cleared successfully. Ready for custom songs!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

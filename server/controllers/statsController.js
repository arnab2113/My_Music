const ListeningHistory = require('../models/ListeningHistory');
const Song = require('../models/Song');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const RadioStation = require('../models/RadioStation');

// User listening statistics
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const history = await ListeningHistory.find({ user: userId }).populate({
      path: 'song',
      populate: { path: 'artist', select: 'name' }
    });

    const totalPlays = history.length;
    const totalDurationSeconds = history.reduce((acc, h) => acc + (h.listenedDuration || 60), 0);
    const totalHours = (totalDurationSeconds / 3600).toFixed(1);

    // Genres calculation
    const genreCounts = {};
    const artistCounts = {};
    history.forEach((h) => {
      if (h.song) {
        const g = h.song.genre || '90s Classics';
        genreCounts[g] = (genreCounts[g] || 0) + 1;
        const a = h.song.artistName || (h.song.artist && h.song.artist.name) || 'Various';
        artistCounts[a] = (artistCounts[a] || 0) + 1;
      }
    });

    const favoriteGenre = Object.keys(genreCounts).sort((a, b) => genreCounts[b] - genreCounts[a])[0] || 'Hindi 90s';
    const favoriteArtist = Object.keys(artistCounts).sort((a, b) => artistCounts[b] - artistCounts[a])[0] || 'Kumar Sanu';

    res.json({
      totalPlays,
      totalHours,
      favoriteGenre,
      favoriteArtist,
      favoriteEra: '90s',
      genreBreakdown: genreCounts,
      artistBreakdown: artistCounts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin overview analytics
exports.getAdminAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalSongs, totalArtists, totalAlbums, totalStations, totalPlaysAgg] = await Promise.all([
      User.countDocuments(),
      Song.countDocuments(),
      Artist.countDocuments(),
      Album.countDocuments(),
      RadioStation.countDocuments(),
      Song.aggregate([{ $group: { _id: null, total: { $sum: '$playsCount' } } }])
    ]);

    const totalPlays = totalPlaysAgg[0] ? totalPlaysAgg[0].total : 0;
    const topSongs = await Song.find().sort({ playsCount: -1 }).limit(5).populate('artist', 'name');
    const stations = await RadioStation.find().select('name listenerCount genre language');

    res.json({
      totalUsers,
      totalSongs,
      totalArtists,
      totalAlbums,
      totalStations,
      totalPlays,
      topSongs,
      stations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

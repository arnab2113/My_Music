const ListeningHistory = require('../models/ListeningHistory');

exports.addHistory = async (req, res) => {
  try {
    const { songId, stationId, duration } = req.body;
    if (!songId) return res.status(400).json({ message: 'Song ID is required' });

    // Avoid duplicate history within 2 minutes for the same user & song
    const recent = await ListeningHistory.findOne({
      user: req.user._id,
      song: songId,
      playedAt: { $gte: new Date(Date.now() - 2 * 60 * 1000) }
    });

    if (recent) {
      recent.listenedDuration += Number(duration) || 0;
      await recent.save();
      return res.json(recent);
    }

    const history = new ListeningHistory({
      user: req.user._id,
      song: songId,
      station: stationId || null,
      listenedDuration: Number(duration) || 30
    });

    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await ListeningHistory.find({ user: req.user._id })
      .populate({
        path: 'song',
        populate: { path: 'artist', select: 'name' }
      })
      .sort({ playedAt: -1 })
      .limit(30);

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

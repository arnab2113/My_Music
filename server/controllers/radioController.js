const RadioStation = require('../models/RadioStation');
const Song = require('../models/Song');
const { normalizeSongs } = require('../utils/urlHelper');

exports.getStations = async (req, res) => {
  try {
    const stations = await RadioStation.find({ isActive: true }).populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });

    const enrichedStations = await Promise.all(
      stations.map(async (st) => {
        let validSongs = [];

        if (st.slug === 'mixed-radio') {
          validSongs = await Song.find({ isPublished: true }).populate('artist', 'name').sort({ createdAt: -1 });
        } else {
          // Strictly match station language!
          const matchQuery = { isPublished: true };
          if (st.language && st.language !== 'Mixed') {
            matchQuery.language = { $regex: `^${st.language}$`, $options: 'i' };
          } else if (st.genre) {
            matchQuery.genre = { $regex: st.genre, $options: 'i' };
          }
          validSongs = await Song.find(matchQuery).populate('artist', 'name').sort({ createdAt: -1 });
        }

        const stObj = st.toObject();
        stObj.songs = normalizeSongs(validSongs, req);
        return stObj;
      })
    );

    res.json(enrichedStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStationBySlug = async (req, res) => {
  try {
    const station = await RadioStation.findOne({ slug: req.params.slug, isActive: true }).populate({
      path: 'songs',
      populate: { path: 'artist', select: 'name' }
    });
    if (!station) return res.status(404).json({ message: 'Radio station not found' });

    let validSongs = [];
    if (station.slug === 'mixed-radio') {
      validSongs = await Song.find({ isPublished: true }).populate('artist', 'name').sort({ createdAt: -1 });
    } else {
      const matchQuery = { isPublished: true };
      if (station.language && station.language !== 'Mixed') {
        matchQuery.language = { $regex: `^${station.language}$`, $options: 'i' };
      } else if (station.genre) {
        matchQuery.genre = { $regex: station.genre, $options: 'i' };
      }
      validSongs = await Song.find(matchQuery).populate('artist', 'name').sort({ createdAt: -1 });
    }

    const stObj = station.toObject();
    stObj.songs = normalizeSongs(validSongs, req);
    res.json(stObj);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStation = async (req, res) => {
  try {
    const station = new RadioStation(req.body);
    const saved = await station.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStation = async (req, res) => {
  try {
    const station = await RadioStation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!station) return res.status(404).json({ message: 'Radio station not found' });
    res.json(station);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStation = async (req, res) => {
  try {
    const station = await RadioStation.findById(req.params.id);
    if (!station) return res.status(404).json({ message: 'Radio station not found' });
    await station.deleteOne();
    res.json({ message: 'Radio station removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

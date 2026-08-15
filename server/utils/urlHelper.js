/**
 * Helper to dynamically format audio and cover image URLs so they work
 * across both local development (localhost) and production deployments (Render/Vercel).
 */
const formatMediaUrl = (url, req) => {
  if (!url || typeof url !== 'string') return url;

  // If it's already an external HTTPS URL (e.g. Pixabay, Unsplash, YouTube, Cloudinary), keep as is
  if (url.startsWith('https://') || url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return url;
  }

  // Extract relative uploads path
  let relativePath = url;
  if (url.includes('/uploads/')) {
    relativePath = '/uploads/' + url.split('/uploads/')[1];
  }

  if (relativePath.startsWith('/uploads/')) {
    if (req) {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.get('host');
      return `${protocol}://${host}${relativePath}`;
    }
  }

  return url;
};

const normalizeSong = (songDoc, req) => {
  if (!songDoc) return songDoc;
  const song = songDoc.toObject ? songDoc.toObject() : { ...songDoc };

  if (song.audioUrl) {
    song.audioUrl = formatMediaUrl(song.audioUrl, req);
  }
  if (song.coverUrl) {
    song.coverUrl = formatMediaUrl(song.coverUrl, req);
  }
  return song;
};

const normalizeSongs = (songs, req) => {
  if (!Array.isArray(songs)) return songs;
  return songs.map((s) => normalizeSong(s, req));
};

module.exports = {
  formatMediaUrl,
  normalizeSong,
  normalizeSongs
};

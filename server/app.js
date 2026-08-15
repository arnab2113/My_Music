const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const songRoutes = require('./routes/songRoutes');
const artistRoutes = require('./routes/artistRoutes');
const albumRoutes = require('./routes/albumRoutes');
const radioRoutes = require('./routes/radioRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const themeRoutes = require('./routes/themeRoutes');
const ambienceRoutes = require('./routes/ambienceRoutes');
const searchRoutes = require('./routes/searchRoutes');
const historyRoutes = require('./routes/historyRoutes');
const statsRoutes = require('./routes/statsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Trust reverse proxies (Render, Vercel, Heroku, Nginx) for HTTPS protocol detection
app.set('trust proxy', 1);

// Security Helmet (configured for audio streaming cross-origin)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  })
);

// Enable CORS
app.use(
  cors({
    origin: '*',
    credentials: true
  })
);

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500, // Limit each IP to 500 requests per window
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Nostalgia FM API server is operational' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/radio', radioRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/ambience', ambienceRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// Production Static Serving for Single-Service Render Deployment
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/dist');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

module.exports = app;

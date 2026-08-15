const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const { Server } = require('socket.io');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = require('./app');
const connectDB = require('./config/db');
const initRadioSocket = require('./sockets/radioSocket');
const Song = require('./models/Song');

const PORT = process.env.PORT || 5000;

async function startServer() {
  // 1. Connect to MongoDB (Primary or Fallback Memory Server)
  await connectDB();

  // 2. Auto Seed only if database is truly fresh (no songs AND no stations)
  try {
    const songCount = await Song.countDocuments();
    const RadioStation = require('./models/RadioStation');
    const stationCount = await RadioStation.countDocuments();
    if (songCount === 0 && stationCount === 0) {
      console.log('[DB] Fresh empty database detected. Running automatic initial seed...');
      const seedAuto = require('./utils/seedAuto');
      await seedAuto();
    } else if (songCount === 0 && stationCount > 0) {
      console.log(`[DB] ${stationCount} stations exist but 0 songs — user cleared songs intentionally. Skipping seed.`);
    }
  } catch (err) {
    console.error('[DB] Auto-seed check error:', err.message);
  }

  // 3. Create HTTP Server & Socket.io
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  initRadioSocket(io);

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n[Server Error] Port ${PORT} is already in use by another running server instance.`);
      console.error(`To free port ${PORT}, run:  npx kill-port ${PORT}\n`);
    } else {
      console.error('[Server Error]', err.message);
    }
  });

  // 4. Start Listening
  server.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`  NOSTALGIA FM Server Running on http://localhost:${PORT}`);
    console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=======================================================`);
  });
}

startServer();

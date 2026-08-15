const mongoose = require('mongoose');
const dns = require('dns');

// Fix SRV record DNS resolution on Windows ISP routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('[DB] Custom DNS set warning:', dnsErr.message);
}

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/nostalgia_fm';
  try {
    console.log(`[DB] Attempting connection to primary MongoDB at: ${primaryUri.replace(/:([^@]+)@/, ':****@')}`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[DB] Successfully connected to primary MongoDB: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Could not connect to primary MongoDB (${err.message}). Initializing fallback MongoDB Memory Server...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '4.4.29'
        }
      });
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log(`[DB] Connected to fallback MongoDB Memory Server at: ${mongoUri}`);
    } catch (fallbackErr) {
      console.error(`[DB] MongoDB Memory Server initialization failed:`, fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

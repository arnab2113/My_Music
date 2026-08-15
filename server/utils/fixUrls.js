const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Song = require('../models/Song');

const fixUrlsInDatabase = async () => {
  try {
    await connectDB();
    console.log('[FixUrls] Database connected. Scanning songs...');

    const songs = await Song.find({});
    console.log(`[FixUrls] Total songs found in database: ${songs.length}`);

    const backendUrl = 'https://my-music-server-8qik.onrender.com';
    let updatedCount = 0;

    for (const song of songs) {
      let changed = false;

      if (song.audioUrl && song.audioUrl.includes('localhost')) {
        const parts = song.audioUrl.split('/uploads/');
        if (parts[1]) {
          song.audioUrl = `${backendUrl}/uploads/${parts[1]}`;
          changed = true;
        }
      }

      if (song.coverUrl && song.coverUrl.includes('localhost')) {
        const parts = song.coverUrl.split('/uploads/');
        if (parts[1]) {
          song.coverUrl = `${backendUrl}/uploads/${parts[1]}`;
          changed = true;
        }
      }

      if (changed) {
        song.markModified('audioUrl');
        song.markModified('coverUrl');
        await song.save();
        updatedCount++;
        console.log(`Updated [${song.title}]: ${song.audioUrl}`);
      }
    }

    console.log(`[FixUrls] Successfully updated ${updatedCount} songs in MongoDB!`);
    process.exit(0);
  } catch (err) {
    console.error('[FixUrls] Error:', err);
    process.exit(1);
  }
};

fixUrlsInDatabase();

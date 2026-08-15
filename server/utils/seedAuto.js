const mongoose = require('mongoose');
const User = require('../models/User');
const Song = require('../models/Song');
const Artist = require('../models/Artist');
const Album = require('../models/Album');
const RadioStation = require('../models/RadioStation');
const Theme = require('../models/Theme');
const AmbientSound = require('../models/AmbientSound');
const Playlist = require('../models/Playlist');
const bcrypt = require('bcryptjs');

const sampleAudioStreams = [
  'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=chill-abstract-intention-12099.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=sweet-love-121561.mp3',
  'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841029c368.mp3?filename=acoustic-guitars-ambient-10852.mp3',
  'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c89b7b99c8.mp3?filename=rainy-day-126296.mp3',
  'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955627.mp3?filename=soft-rain-ambient-111154.mp3',
  'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c36c641151.mp3?filename=coffee-shop-chatter-124978.mp3',
  'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92db1.mp3?filename=forest-night-birds-117869.mp3'
];

module.exports = async function seedAuto() {
  try {
    // SAFETY GUARD: Never wipe a cloud/production database!
    // Only allow destructive seed on localhost or in-memory test databases.
    const currentHost = mongoose.connection.host || '';
    const isCloudDB = currentHost.includes('mongodb.net') || currentHost.includes('atlas');
    const isLocalOrMemory = currentHost.includes('localhost') || currentHost.includes('127.0.0.1') || currentHost.includes('mongodb-memory');

    if (isCloudDB) {
      // On cloud DB, only INSERT if collections are empty — never delete existing data
      const existingSongs = await Song.countDocuments();
      if (existingSongs > 0) {
        console.log(`[Seed] Cloud database already has ${existingSongs} songs. Skipping destructive seed to protect user data.`);
        return;
      }
      console.log('[Seed] Cloud database is empty. Running non-destructive initial seed...');
    } else {
      // On local/test databases, safe to clear and re-seed
      console.log('[Seed] Clearing existing collections for auto-seed (local/test database)...');
      await Promise.all([
        User.deleteMany({}),
        Song.deleteMany({}),
        Artist.deleteMany({}),
        Album.deleteMany({}),
        RadioStation.deleteMany({}),
        Theme.deleteMany({}),
        AmbientSound.deleteMany({}),
        Playlist.deleteMany({})
      ]);
    }

    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Admin@123456', salt);
    const userPassword = await bcrypt.hash('User@123456', salt);

    const adminUser = await User.create({
      _id: new mongoose.Types.ObjectId('60d5ecb8b5c9c22340e4e5f1'),
      name: 'Nostalgia Admin',
      email: 'admin@nostalgiafm.com',
      password: adminPassword,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      preferredTheme: 'midnight-cafe',
      preferredAccent: '#f59e0b'
    });

    const demoUser = await User.create({
      _id: new mongoose.Types.ObjectId('60d5ecb8b5c9c22340e4e5f2'),
      name: 'Retro Listener',
      email: 'user@nostalgiafm.com',
      password: userPassword,
      role: 'USER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      preferredTheme: 'rainy-window',
      preferredAccent: '#06b6d4'
    });

    const artistsData = [
      { name: 'Kumar Sanu', bio: 'The King of 90s Bollywood Melodies.', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', genre: 'Hindi 90s' },
      { name: 'Alka Yagnik', bio: 'Legendary Indian playback singer.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80', genre: 'Hindi 90s' },
      { name: 'Udit Narayan', bio: 'Golden voice of 90s Hindi cinema.', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80', genre: 'Hindi 90s' },
      { name: 'Hemanta Mukherjee', bio: 'Iconic maestro of Bengali modern classics.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80', genre: 'Bengali Classics' },
      { name: 'Manna Dey', bio: 'Bengali Adhunik legend.', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80', genre: 'Bengali Classics' },
      { name: 'Khesari Lal Yadav', bio: 'High energy Bhojpuri folk superstar.', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', genre: 'Bhojpuri Hits' },
      { name: 'RD Burman', bio: 'Pancham Da - Revolutionary music director of Indian retro cinema.', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', genre: '80s Retro' },
      { name: 'A.R. Rahman', bio: 'Pioneer of modern Indian soundscapes.', image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80', genre: 'Romantic Nights' }
    ];
    const createdArtists = await Artist.insertMany(artistsData);

    const albumsData = [
      { title: 'Aashiqui Golden Hits', artist: createdArtists[0]._id, releaseYear: 1990, cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80', description: 'The album that defined 90s romance.' },
      { title: 'Dilwale Dulhania Le Jayenge', artist: createdArtists[2]._id, releaseYear: 1995, cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80', description: 'Timeless Bollywood romantic anthems.' },
      { title: 'Sonar Bangla Golden Melodies', artist: createdArtists[3]._id, releaseYear: 1985, cover: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=format&fit=crop&w=600&q=80', description: 'Soulful Bengali classics.' },
      { title: 'Bhojpuri Dhamaka 90s', artist: createdArtists[5]._id, releaseYear: 1998, cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80', description: 'Energetic traditional Bhojpuri beats.' },
      { title: 'Retro Nights Pancham Beats', artist: createdArtists[6]._id, releaseYear: 1982, cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80', description: 'Funky brass and 80s vinyl warmth.' },
      { title: 'Bombay Dreamscapes', artist: createdArtists[7]._id, releaseYear: 1995, cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80', description: 'Ambient orchestral sounds and romantic melodies.' }
    ];
    const createdAlbums = await Album.insertMany(albumsData);

    const songsRawData = [
      { title: 'Ek Ladki Ko Dekha Toh Aisa Laga', artist: createdArtists[0]._id, artistName: 'Kumar Sanu', album: createdAlbums[0]._id, albumName: 'Aashiqui Golden Hits', duration: 275, audioUrl: sampleAudioStreams[0], coverUrl: createdAlbums[0].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1994, playsCount: 1250 },
      { title: 'Dheere Dheere Se Meri Zindagi', artist: createdArtists[0]._id, artistName: 'Kumar Sanu', album: createdAlbums[0]._id, albumName: 'Aashiqui Golden Hits', duration: 330, audioUrl: sampleAudioStreams[1], coverUrl: createdAlbums[0].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1990, playsCount: 2100 },
      { title: 'Tujhe Dekha Toh Yeh Jaana Sanam', artist: createdArtists[2]._id, artistName: 'Udit Narayan', album: createdAlbums[1]._id, albumName: 'Dilwale Dulhania Le Jayenge', duration: 305, audioUrl: sampleAudioStreams[2], coverUrl: createdAlbums[1].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1995, playsCount: 3400 },
      { title: 'Chura Ke Dil Mera', artist: createdArtists[0]._id, artistName: 'Kumar Sanu & Alka Yagnik', album: createdAlbums[0]._id, albumName: 'Aashiqui Golden Hits', duration: 290, audioUrl: sampleAudioStreams[3], coverUrl: createdAlbums[0].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1994, playsCount: 1890 },
      { title: 'Pehla Nasha Pehla Khumar', artist: createdArtists[2]._id, artistName: 'Udit Narayan', album: createdAlbums[1]._id, albumName: 'Dilwale Dulhania Le Jayenge', duration: 280, audioUrl: sampleAudioStreams[4], coverUrl: createdAlbums[1].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1992, playsCount: 2750 },
      { title: 'Mera Dil Bhi Kitna Pagal Hai', artist: createdArtists[0]._id, artistName: 'Kumar Sanu & Alka Yagnik', album: createdAlbums[0]._id, albumName: 'Aashiqui Golden Hits', duration: 310, audioUrl: sampleAudioStreams[0], coverUrl: createdAlbums[0].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1991, playsCount: 1600 },
      { title: 'Bahut Pyar Karte Hain', artist: createdArtists[1]._id, artistName: 'Alka Yagnik', album: createdAlbums[0]._id, albumName: 'Aashiqui Golden Hits', duration: 260, audioUrl: sampleAudioStreams[1], coverUrl: createdAlbums[0].cover, genre: 'Hindi 90s Classics', language: 'Hindi', releaseYear: 1991, playsCount: 1420 },

      { title: 'Ei Path Jodi Na Sesh Hoy', artist: createdArtists[3]._id, artistName: 'Hemanta Mukherjee', album: createdAlbums[2]._id, albumName: 'Sonar Bangla Golden Melodies', duration: 240, audioUrl: sampleAudioStreams[2], coverUrl: createdAlbums[2].cover, genre: 'Bengali 90s Classics', language: 'Bengali', releaseYear: 1985, playsCount: 980 },
      { title: 'Ami Je Jalsaghare', artist: createdArtists[4]._id, artistName: 'Manna Dey', album: createdAlbums[2]._id, albumName: 'Sonar Bangla Golden Melodies', duration: 310, audioUrl: sampleAudioStreams[3], coverUrl: createdAlbums[2].cover, genre: 'Bengali 90s Classics', language: 'Bengali', releaseYear: 1988, playsCount: 1120 },
      { title: 'Coffee Houser Sei Addata', artist: createdArtists[4]._id, artistName: 'Manna Dey', album: createdAlbums[2]._id, albumName: 'Sonar Bangla Golden Melodies', duration: 340, audioUrl: sampleAudioStreams[4], coverUrl: createdAlbums[2].cover, genre: 'Bengali 90s Classics', language: 'Bengali', releaseYear: 1983, playsCount: 3100 },
      { title: 'O Nodi Re Ekti Kotha Sudhai', artist: createdArtists[3]._id, artistName: 'Hemanta Mukherjee', album: createdAlbums[2]._id, albumName: 'Sonar Bangla Golden Melodies', duration: 255, audioUrl: sampleAudioStreams[0], coverUrl: createdAlbums[2].cover, genre: 'Bengali 90s Classics', language: 'Bengali', releaseYear: 1986, playsCount: 870 },

      { title: 'Lollypop Lagelu 90s Mix', artist: createdArtists[5]._id, artistName: 'Khesari Lal Yadav', album: createdAlbums[3]._id, albumName: 'Bhojpuri Dhamaka 90s', duration: 230, audioUrl: sampleAudioStreams[1], coverUrl: createdAlbums[3].cover, genre: 'Bhojpuri Top Hits', language: 'Bhojpuri', releaseYear: 1998, playsCount: 4200 },
      { title: 'Raja Raja Kareja Mein Samaja', artist: createdArtists[5]._id, artistName: 'Khesari Lal Yadav', album: createdAlbums[3]._id, albumName: 'Bhojpuri Dhamaka 90s', duration: 245, audioUrl: sampleAudioStreams[2], coverUrl: createdAlbums[3].cover, genre: 'Bhojpuri Top Hits', language: 'Bhojpuri', releaseYear: 1999, playsCount: 2300 },
      { title: 'Piyawa Se Pehle 90s Retro', artist: createdArtists[5]._id, artistName: 'Khesari Lal Yadav', album: createdAlbums[3]._id, albumName: 'Bhojpuri Dhamaka 90s', duration: 260, audioUrl: sampleAudioStreams[3], coverUrl: createdAlbums[3].cover, genre: 'Bhojpuri Top Hits', language: 'Bhojpuri', releaseYear: 1997, playsCount: 1950 },

      { title: 'Dum Maro Dum Brass Mix', artist: createdArtists[6]._id, artistName: 'RD Burman', album: createdAlbums[4]._id, albumName: 'Retro Nights Pancham Beats', duration: 220, audioUrl: sampleAudioStreams[4], coverUrl: createdAlbums[4].cover, genre: '80s Retro', language: 'Hindi', releaseYear: 1982, playsCount: 1540 },
      { title: 'Mehbooba Mehbooba Vinyl Groove', artist: createdArtists[6]._id, artistName: 'RD Burman', album: createdAlbums[4]._id, albumName: 'Retro Nights Pancham Beats', duration: 250, audioUrl: sampleAudioStreams[0], coverUrl: createdAlbums[4].cover, genre: '80s Retro', language: 'Hindi', releaseYear: 1980, playsCount: 2200 },
      { title: 'Yeh Shaam Mastani Synthwave', artist: createdArtists[6]._id, artistName: 'RD Burman', album: createdAlbums[4]._id, albumName: 'Retro Nights Pancham Beats', duration: 275, audioUrl: sampleAudioStreams[1], coverUrl: createdAlbums[4].cover, genre: '80s Retro', language: 'Hindi', releaseYear: 1984, playsCount: 1780 },

      { title: 'Tu Hi Re Orchestra Serenade', artist: createdArtists[7]._id, artistName: 'A.R. Rahman', album: createdAlbums[5]._id, albumName: 'Bombay Dreamscapes', duration: 390, audioUrl: sampleAudioStreams[2], coverUrl: createdAlbums[5].cover, genre: 'Romantic Nights', language: 'Hindi', releaseYear: 1995, playsCount: 3100 },
      { title: 'Kehna Hi Kya Midnight Mix', artist: createdArtists[7]._id, artistName: 'A.R. Rahman', album: createdAlbums[5]._id, albumName: 'Bombay Dreamscapes', duration: 320, audioUrl: sampleAudioStreams[3], coverUrl: createdAlbums[5].cover, genre: 'Romantic Nights', language: 'Hindi', releaseYear: 1995, playsCount: 2400 },
      { title: 'Roja Janeman Ambient Rain', artist: createdArtists[7]._id, artistName: 'A.R. Rahman', album: createdAlbums[5]._id, albumName: 'Bombay Dreamscapes', duration: 300, audioUrl: sampleAudioStreams[4], coverUrl: createdAlbums[5].cover, genre: 'Romantic Nights', language: 'Hindi', releaseYear: 1992, playsCount: 2900 },
      { title: 'Late Night Midnight Lo-Fi Beats', artist: createdArtists[7]._id, artistName: 'Nostalgia Ensemble', album: createdAlbums[5]._id, albumName: 'Bombay Dreamscapes', duration: 210, audioUrl: sampleAudioStreams[5], coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', genre: 'Soft Instrumentals', language: 'Instrumental', releaseYear: 2024, playsCount: 1100 },
      { title: 'Midnight Cafe Santoor Raga', artist: createdArtists[3]._id, artistName: 'Nostalgia Ensemble', album: createdAlbums[2]._id, albumName: 'Sonar Bangla Golden Melodies', duration: 280, audioUrl: sampleAudioStreams[6], coverUrl: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=600&q=80', genre: 'Soft Instrumentals', language: 'Instrumental', releaseYear: 2024, playsCount: 950 }
    ];

    const createdSongs = await Song.insertMany(songsRawData);
    console.log(`[Seed] Auto-created ${createdSongs.length} Songs.`);

    for (const song of createdSongs) {
      if (song.album) {
        await Album.findByIdAndUpdate(song.album, { $addToSet: { songs: song._id } });
      }
    }

    const getStationSongIds = (genreOrLang) => {
      return createdSongs
        .filter((s) => s.genre.includes(genreOrLang) || s.language.includes(genreOrLang))
        .map((s) => s._id);
    };

    const stationsData = [
      {
        name: 'Hindi 90s Classics',
        slug: 'hindi-90s-classics',
        description: 'Bollywood Golden Era Melodies & Iconic Duets',
        language: 'Hindi',
        genre: '90s Classics',
        icon: 'Music',
        cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Hindi 90s'),
        listenerCount: 142,
        defaultTheme: 'midnight-cafe',
        defaultAmbience: 'vinyl'
      },
      {
        name: 'Bengali 90s Classics',
        slug: 'bengali-90s-classics',
        description: 'Adhunik & Rabindra Sangeet Fusion',
        language: 'Bengali',
        genre: 'Bengali Classics',
        icon: 'Feather',
        cover: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Bengali'),
        listenerCount: 89,
        defaultTheme: 'rainy-window',
        defaultAmbience: 'rain'
      },
      {
        name: 'Bhojpuri Top Hits',
        slug: 'bhojpuri-top-hits',
        description: 'Folk & Filmi Fusion High Energy Tracks',
        language: 'Bhojpuri',
        genre: 'Bhojpuri Hits',
        icon: 'Sparkles',
        cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Bhojpuri'),
        listenerCount: 67,
        defaultTheme: 'sunset-drive',
        defaultAmbience: 'city'
      },
      {
        name: 'Mixed Radio',
        slug: 'mixed-radio',
        description: 'Hindi • Bengali • Bhojpuri Cross-Decade Journey',
        language: 'Mixed',
        genre: 'Eclectic',
        icon: 'Radio',
        cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
        songs: createdSongs.map((s) => s._id),
        listenerCount: 215,
        defaultTheme: 'vintage-radio',
        defaultAmbience: 'fireplace'
      },
      {
        name: '80s Retro Nights',
        slug: '80s-retro-nights',
        description: 'Disco Brass, Synthwaves & Analog Warmth',
        language: 'Hindi',
        genre: '80s Retro',
        icon: 'Disc',
        cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('80s Retro'),
        listenerCount: 94,
        defaultTheme: 'neon-tokyo',
        defaultAmbience: 'cafe'
      },
      {
        name: 'Romantic Nights',
        slug: 'romantic-nights',
        description: 'Deep Midnight Serenades & Orchestral Harmonies',
        language: 'Hindi',
        genre: 'Romantic',
        icon: 'Heart',
        cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Romantic'),
        listenerCount: 178,
        defaultTheme: 'cosmic-night',
        defaultAmbience: 'ocean'
      },
      {
        name: 'Late Night Radio',
        slug: 'late-night-radio',
        description: 'Atmospheric Lo-Fi & Gentle Rain Echoes',
        language: 'Instrumental',
        genre: 'Lo-Fi Ambient',
        icon: 'Moon',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Instrumental'),
        listenerCount: 112,
        defaultTheme: 'dark-cinema',
        defaultAmbience: 'rain'
      },
      {
        name: 'Soft Instrumentals',
        slug: 'soft-instrumentals',
        description: 'Santoor, Sitar & Piano Symphony',
        language: 'Instrumental',
        genre: 'Classical Instrumental',
        icon: 'Wind',
        cover: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?auto=format&fit=crop&w=600&q=80',
        songs: getStationSongIds('Soft Instrumentals'),
        listenerCount: 56,
        defaultTheme: 'forest-midnight',
        defaultAmbience: 'forest'
      }
    ];

    await RadioStation.insertMany(stationsData);

    const themesData = [
      {
        themeId: 'midnight-cafe',
        name: 'Midnight Café',
        description: 'Warm amber glow, dark coffee shop ambiance with subtle dust motes.',
        colors: {
          background: '#0c0a09',
          surface: '#1c1917',
          surfaceElevated: '#27272a',
          textPrimary: '#fef3c7',
          textSecondary: '#a1a1aa',
          accent: '#f59e0b',
          accentGlow: 'rgba(245, 158, 11, 0.4)',
          border: 'rgba(245, 158, 11, 0.15)'
        },
        particles: 'dust',
        ambience: 'cafe',
        visualizerStyle: 'bars'
      },
      {
        themeId: 'rainy-window',
        name: 'Rainy Window',
        description: 'Deep navy charcoal atmosphere with cascading rain droplets.',
        colors: {
          background: '#090d16',
          surface: '#111827',
          surfaceElevated: '#1f2937',
          textPrimary: '#e0f2fe',
          textSecondary: '#94a3b8',
          accent: '#06b6d4',
          accentGlow: 'rgba(6, 182, 212, 0.4)',
          border: 'rgba(6, 182, 212, 0.15)'
        },
        particles: 'rain',
        ambience: 'rain',
        visualizerStyle: 'waveform'
      },
      {
        themeId: 'neon-tokyo',
        name: 'Neon Tokyo',
        description: 'Cyber retro magenta and cyan neon glow.',
        colors: {
          background: '#090514',
          surface: '#150d2a',
          surfaceElevated: '#241445',
          textPrimary: '#f472b6',
          textSecondary: '#a78bfa',
          accent: '#ec4899',
          accentGlow: 'rgba(236, 72, 153, 0.5)',
          border: 'rgba(236, 72, 153, 0.2)'
        },
        particles: 'fireflies',
        ambience: 'city',
        visualizerStyle: 'spectrum'
      },
      {
        themeId: 'vintage-radio',
        name: 'Vintage Radio',
        description: 'Authentic 90s brass dial radio aesthetic with warm vinyl grooves.',
        colors: {
          background: '#120d09',
          surface: '#221912',
          surfaceElevated: '#33261c',
          textPrimary: '#fde68a',
          textSecondary: '#d97706',
          accent: '#d97706',
          accentGlow: 'rgba(217, 119, 6, 0.4)',
          border: 'rgba(217, 119, 6, 0.2)'
        },
        particles: 'dust',
        ambience: 'vinyl',
        visualizerStyle: 'circle'
      },
      {
        themeId: 'sunset-drive',
        name: 'Sunset Drive',
        description: 'Warm crimson and terracotta golden hour vibes.',
        colors: {
          background: '#140807',
          surface: '#27110e',
          surfaceElevated: '#3b1c18',
          textPrimary: '#ffedd5',
          textSecondary: '#fb923c',
          accent: '#f97316',
          accentGlow: 'rgba(249, 115, 22, 0.4)',
          border: 'rgba(249, 115, 22, 0.2)'
        },
        particles: 'fireflies',
        ambience: 'fireplace',
        visualizerStyle: 'bars'
      },
      {
        themeId: 'cosmic-night',
        name: 'Cosmic Night',
        description: 'Deep violet space nebula with sparkling stars.',
        colors: {
          background: '#070514',
          surface: '#110c28',
          surfaceElevated: '#1c153d',
          textPrimary: '#e0e7ff',
          textSecondary: '#818cf8',
          accent: '#6366f1',
          accentGlow: 'rgba(99, 102, 241, 0.4)',
          border: 'rgba(99, 102, 241, 0.2)'
        },
        particles: 'stars',
        ambience: 'ocean',
        visualizerStyle: 'particles'
      },
      {
        themeId: 'dark-cinema',
        name: 'Dark Cinema',
        description: 'Ultra dark luxury theater mood with gold light accents.',
        colors: {
          background: '#050505',
          surface: '#121212',
          surfaceElevated: '#1e1e1e',
          textPrimary: '#f5f5f5',
          textSecondary: '#737373',
          accent: '#eab308',
          accentGlow: 'rgba(234, 179, 8, 0.4)',
          border: 'rgba(255, 255, 255, 0.1)'
        },
        particles: 'dust',
        ambience: 'vinyl',
        visualizerStyle: 'waveform'
      },
      {
        themeId: 'forest-midnight',
        name: 'Forest Midnight',
        description: 'Serene dark emerald canopy with glowing fireflies.',
        colors: {
          background: '#040d09',
          surface: '#0a1d15',
          surfaceElevated: '#122c21',
          textPrimary: '#dcfce7',
          textSecondary: '#4ade80',
          accent: '#10b981',
          accentGlow: 'rgba(16, 185, 129, 0.4)',
          border: 'rgba(16, 185, 129, 0.2)'
        },
        particles: 'fireflies',
        ambience: 'forest',
        visualizerStyle: 'spectrum'
      },
      {
        themeId: 'ocean-night',
        name: 'Ocean Night',
        description: 'Deep abyss teal waves with soothing sea soundscapes.',
        colors: {
          background: '#030f14',
          surface: '#081e28',
          surfaceElevated: '#0f2d3d',
          textPrimary: '#ccfbf1',
          textSecondary: '#2dd4bf',
          accent: '#14b8a6',
          accentGlow: 'rgba(20, 184, 166, 0.4)',
          border: 'rgba(20, 184, 166, 0.2)'
        },
        particles: 'rain',
        ambience: 'ocean',
        visualizerStyle: 'waveform'
      },
      {
        themeId: '90s-nostalgia',
        name: '90s Nostalgia',
        description: 'Classic warm cassette tape brown with gold dial typography.',
        colors: {
          background: '#120b06',
          surface: '#20140c',
          surfaceElevated: '#311f14',
          textPrimary: '#fef3c7',
          textSecondary: '#b45309',
          accent: '#f59e0b',
          accentGlow: 'rgba(245, 158, 11, 0.4)',
          border: 'rgba(245, 158, 11, 0.25)'
        },
        particles: 'dust',
        ambience: 'vinyl',
        visualizerStyle: 'circle'
      }
    ];
    await Theme.insertMany(themesData);

    const ambientSoundsData = [
      { soundId: 'rain', name: 'Gentle Rain', icon: 'CloudRain', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_db65955627.mp3?filename=soft-rain-ambient-111154.mp3', defaultVolume: 0.4 },
      { soundId: 'cafe', name: 'Midnight Café', icon: 'Coffee', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c36c641151.mp3?filename=coffee-shop-chatter-124978.mp3', defaultVolume: 0.3 },
      { soundId: 'fireplace', name: 'Warm Fireplace', icon: 'Flame', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=fireplace-crackling-12099.mp3', defaultVolume: 0.35 },
      { soundId: 'vinyl', name: 'Vinyl Crackle', icon: 'Disc', audioUrl: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_841029c368.mp3?filename=vinyl-hiss-10852.mp3', defaultVolume: 0.25 },
      { soundId: 'ocean', name: 'Ocean Waves', icon: 'Waves', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c89b7b99c8.mp3?filename=ocean-waves-126296.mp3', defaultVolume: 0.4 },
      { soundId: 'forest', name: 'Midnight Forest', icon: 'Trees', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/02/audio_884fe92db1.mp3?filename=forest-night-birds-117869.mp3', defaultVolume: 0.3 },
      { soundId: 'city', name: 'Night City Traffic', icon: 'Building', audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=city-night-ambiance-121561.mp3', defaultVolume: 0.25 }
    ];
    await AmbientSound.insertMany(ambientSoundsData);

    await Playlist.create({
      name: '90s Midnight Melodies',
      description: 'Handcrafted nostalgic 90s Bollywood tracks.',
      user: demoUser._id,
      songs: [createdSongs[0]._id, createdSongs[1]._id, createdSongs[2]._id],
      isPublic: true
    });

    console.log('[Seed] Auto database seeding completed successfully!');
  } catch (error) {
    console.error('[Seed] Auto seeding error:', error);
  }
};

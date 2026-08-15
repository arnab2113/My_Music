# NOSTALGIA FM — Music Never Gets Old

![NOSTALGIA FM Banner](https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80)

**NOSTALGIA FM** is an immersive full-stack MERN music & live radio platform inspired by a 90s vintage radio aesthetic (warm street lamp atmosphere, vinyl turntable rotation, canvas particle engine, persistent global radio player, slide-out theme panel, and hide-UI mode).

---

## 🌟 Key Features

- 📻 **Live Radio Station Synchronization**: Synchronized station streams & real-time listener counts powered by Socket.io.
- 🎨 **Theme Engine (10 Presets)**: Midnight Café, Rainy Window, Neon Tokyo, Vintage Radio, Sunset Drive, Cosmic Night, Dark Cinema, Forest Midnight, Ocean Night, 90s Nostalgia with customizable accent glow and particle canvas.
- 🌧️ **Ambient Sound Mixer**: Independent ambient audio faders (Gentle Rain, Café Chatter, Warm Fireplace, Vinyl Crackle, Ocean Waves, Forest Birds, City Traffic).
- 💿 **Vinyl Record Turntable**: Interactive GSAP rotation, vinyl grooves reflection, tonearm animation, and artwork center label.
- 🎵 **Persistent Global Audio Player**: Audio playback continues seamlessly as you navigate across routes.
- 🎶 **Web Audio Spectrum Visualizer**: Real frequency spectrum visualizer canvas supporting Bars, Waveform, Circle, and Spectrum modes.
- 🔍 **Real-Time Archive Search**: Instant debounced backend search across songs, 90s artists, albums, genres, and stations.
- 🔐 **JWT Auth & Roles**: User & Admin authentication with bcrypt password hashing.
- 🛡️ **Admin Dashboard**: Full CRUD management console for Songs, Radio Stations, Artists, Albums, and Platform Analytics.
- 📊 **Listening Statistics**: Personalized listening metrics (total plays, hours listened, favorite genre & era).
- 🎹 **Keyboard Shortcuts**: Keyboard controls (`SPACE`, `Arrows`, `M`, `L`, `F`, `T`, `UI`, `?`).
- 📲 **PWA Ready**: Web App Manifest & Service Worker included.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit, Howler.js / Web Audio API, GSAP, Socket.io-client, Lucide Icons, Axios, Recharts.
- **Backend**: Node.js, Express.js, MongoDB (with automatic `mongodb-memory-server` fallback), Mongoose, Socket.io, JWT, bcryptjs, Helmet, CORS, Express Rate Limit, Multer.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

In the root directory, run:

```bash
npm run install-all
```

### 2. Seed Database

To seed initial sample tracks, radio stations, 10 themes, ambient audio loops, and admin/user credentials:

```bash
npm run seed
```

### 3. Start Development Servers

Start both backend API server (`http://localhost:5000`) and Vite frontend dev server (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

---

## 🔑 Default Accounts (Seeded)

- **Admin Account**:
  - Email: `admin@nostalgiafm.com`
  - Password: `Admin@123456`
  - Access: Full Admin Dashboard (`/admin`), Song/Station CRUD

- **Demo User Account**:
  - Email: `user@nostalgiafm.com`
  - Password: `User@123456`

---

## 📡 API Routes Overview

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/songs` - Fetch songs list
- `GET /api/radio` - Fetch live radio stations
- `GET /api/themes` - Fetch 10 theme tokens
- `GET /api/search?q=` - Search songs, artists, albums, stations
- `GET /api/playlists` - Fetch user playlists
- `GET /api/favorites` - Fetch user favorited tracks
- `GET /api/stats/user` - Personal listening statistics
- `GET /api/stats/admin` - Platform administration analytics

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Compass, Play, LayoutGrid, List, Heart } from 'lucide-react';
import api from '../services/api';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { setFavoritesState, toggleAuthModal } from '../store/authSlice';
import { addToast } from '../store/uiSlice';
import SongListView from '../components/SongListView';

const CATEGORIES = [
  { id: 'All', label: 'All Songs' },
  { id: 'Bengali', label: 'Bengali 90s' },
  { id: 'Bhojpuri', label: 'Bhojpuri Hits' },
  { id: 'Hindi', label: 'Hindi 90s' },
  { id: '80s', label: '80s Retro' },
  { id: 'Romantic', label: 'Romantic' },
  { id: 'Instrumental', label: 'Instrumental & Lo-Fi' }
];

export default function ExplorePage() {
  const dispatch = useDispatch();
  const { isAuthenticated, favorites } = useSelector((state) => state.auth);

  const [songs, setSongs] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState('list'); // Default to Gaana List View matching Image 1
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/songs')
      .then((res) => {
        setSongs(res.data);
      })
      .catch((err) => console.error('Explore load error:', err))
      .finally(() => setLoading(false));
  }, []);

  const matchesCategory = (song, catId) => {
    if (catId === 'All') return true;

    const genre = (song.genre || '').toLowerCase();
    const lang = (song.language || '').toLowerCase();

    // Language-based categories — match ONLY by the `language` field from DB
    if (catId === 'Bengali') return lang === 'bengali';
    if (catId === 'Bhojpuri') return lang === 'bhojpuri';
    if (catId === 'Instrumental') return lang === 'instrumental';

    // Hindi: must have language=Hindi AND must NOT be 80s/Romantic (those have their own tabs)
    if (catId === 'Hindi') {
      return lang === 'hindi' && !genre.includes('80s') && !genre.includes('retro') && !genre.includes('romantic');
    }

    // Genre-based categories — match by genre keywords
    if (catId === '80s') return genre.includes('80s') || genre.includes('retro');
    if (catId === 'Romantic') return genre.includes('romantic') || genre.includes('love');

    // Fallback for any future categories
    return lang.includes(catId.toLowerCase()) || genre.includes(catId.toLowerCase());
  };

  const filteredSongs = songs.filter((song) => matchesCategory(song, activeCategory));

  const handlePlaySong = (song, idx) => {
    dispatch(setQueue({ songs: filteredSongs, startIndex: idx }));
    dispatch(setIsPlaying(true));
  };

  const handleToggleFavorite = async (songId) => {
    if (!isAuthenticated) {
      dispatch(toggleAuthModal('login'));
      return;
    }
    try {
      const res = await api.post('/favorites/toggle', { songId });
      dispatch(setFavoritesState(res.data.favorites));
      dispatch(
        addToast({
          message: res.data.isFavorite ? 'Added to Favorites!' : 'Removed from Favorites',
          type: 'success'
        })
      );
    } catch (err) {
      console.error('Favorite toggle failed:', err);
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between border-b border-borderCustom/60 pb-4">
        <div className="flex items-center space-x-3">
          <Compass className="w-7 h-7 md:w-8 md:h-8 text-accent animate-spin-slow shrink-0" />
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-textPrimary">Explore Nostalgic Library</h1>
            <p className="text-xs md:text-sm text-textSecondary font-sans">
              Discover timeless tracks categorized by eras, genres, and languages.
            </p>
          </div>
        </div>

        {/* View Mode Toggle (Grid / Gaana List View) */}
        <div className="flex items-center space-x-1 bg-black/40 p-1 rounded-xl border border-borderCustom">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-accent text-black font-bold' : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Gaana Track List View"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'grid' ? 'bg-accent text-black font-bold' : 'text-textSecondary hover:text-textPrimary'
            }`}
            title="Cover Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Responsive Filter Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-3 pt-1 scrollbar-none max-w-full -mx-4 px-4 md:mx-0 md:px-0">
        {CATEGORIES.map((cat) => {
          const count = songs.filter((s) => matchesCategory(s, cat.id)).length;
          const isSelected = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 shrink-0 ${
                isSelected
                  ? 'bg-accent text-black shadow-lg shadow-accentGlow font-bold scale-105'
                  : 'bg-black/40 text-textSecondary border border-borderCustom hover:text-textPrimary hover:border-accent/50'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-textSecondary'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Loading state */}
      {loading && <p className="text-center font-mono text-accent text-sm animate-pulse py-12">Loading Nostalgia Archive...</p>}

      {/* Songs View */}
      {!loading && (
        <>
          {filteredSongs.length === 0 ? (
            <div className="text-center py-16 space-y-2 glass-panel rounded-2xl p-8">
              <p className="font-serif font-bold text-lg text-textPrimary">No tracks found for "{CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}"</p>
              <p className="text-xs text-textSecondary font-sans">Try selecting "All Songs" or another genre category.</p>
            </div>
          ) : viewMode === 'list' ? (
            /* Gaana-Style List View (Image 1 Request) */
            <SongListView
              songs={filteredSongs}
              onPlaySong={handlePlaySong}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredSongs.map((song, idx) => (
                <div
                  key={song._id}
                  onClick={() => handlePlaySong(song, idx)}
                  className="group p-4 rounded-2xl glass-card cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accentGlow"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                    <img
                      src={song.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80'}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute bottom-3 right-3 p-3 rounded-full bg-accent text-black font-bold opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all shadow-lg shadow-accentGlow">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-accent px-2 py-0.5 rounded bg-black/50 border border-borderCustom inline-block font-bold">
                    {song.language} • {song.releaseYear}
                  </span>
                  <h3 className="font-serif font-bold text-base text-textPrimary truncate mt-1.5 group-hover:text-accent transition-colors">
                    {song.title}
                  </h3>
                  <p className="text-xs text-textSecondary truncate font-sans mt-0.5">{song.artistName}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

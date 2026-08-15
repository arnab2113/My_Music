import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Play, Heart, Disc, Radio, Sparkles, TrendingUp, Music } from 'lucide-react';
import CinematicHero from '../components/CinematicHero';
import StationCard from '../components/StationCard';
import SongListView from '../components/SongListView';
import api from '../services/api';
import { setStations, setActiveStation } from '../store/radioSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';
import { setFavoritesState, toggleAuthModal } from '../store/authSlice';
import { addToast } from '../store/uiSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { stations } = useSelector((state) => state.radio);
  const { currentSong, isPlaying } = useSelector((state) => state.player);
  const { isHideUI } = useSelector((state) => state.ui);
  const { isAuthenticated, favorites } = useSelector((state) => state.auth);

  const [trendingSongs, setTrendingSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stRes, songRes] = await Promise.all([api.get('/radio'), api.get('/songs')]);
        dispatch(setStations(stRes.data));
        setTrendingSongs(songRes.data);
      } catch (err) {
        console.error('Home data load failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  const handlePlayStation = (station) => {
    dispatch(setActiveStation(station));

    // Backend already returns correctly filtered songs per station language.
    // Just check that songs exist and have audioUrl — no double-filtering!
    const validSongs = (station.songs || []).filter(
      (s) => s && typeof s === 'object' && s.audioUrl
    );

    if (validSongs.length > 0) {
      dispatch(setQueue({ songs: validSongs, startIndex: 0 }));
      dispatch(setIsPlaying(true));
    }
  };

  const handlePlaySong = (song, index) => {
    // Filter queue to songs matching the exact language of the clicked song
    // so playing a Bengali song continuously auto-plays the next Bengali song!
    const matchingLangSongs = trendingSongs.filter(
      (s) => (s.language || '').toLowerCase() === (song.language || '').toLowerCase()
    );
    const queueToPlay = matchingLangSongs.length > 0 ? matchingLangSongs : trendingSongs;
    const songIndex = queueToPlay.findIndex((s) => s._id === song._id);

    dispatch(setQueue({ songs: queueToPlay, startIndex: songIndex >= 0 ? songIndex : 0 }));
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
    <div className="min-h-screen pb-32">
      {/* Hero Atmosphere */}
      <CinematicHero stations={stations} />

      {!isHideUI && (
        <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 mt-8">
          {/* Trending Songs Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-borderCustom/60 pb-3">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <h2 className="font-serif font-bold text-2xl text-textPrimary tracking-wide">Trending Nostalgic Classics</h2>
              </div>
              <span className="text-xs font-mono text-textSecondary uppercase">Continuous Auto-Play Queue</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {trendingSongs.map((song, idx) => (
                <div
                  key={song._id}
                  onClick={() => handlePlaySong(song, idx)}
                  className="group p-3.5 rounded-2xl glass-card cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-xl hover:shadow-accentGlow"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                    <img
                      src={song.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80'}
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button className="absolute bottom-3 right-3 p-3 rounded-full bg-accent text-black font-bold shadow-lg shadow-accentGlow opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-75 transition-all">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-accent px-2 py-0.5 rounded bg-black/50 border border-borderCustom inline-block font-bold">
                    {song.language}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-textPrimary truncate mt-1 group-hover:text-accent transition-colors">
                    {song.title}
                  </h4>
                  <p className="text-xs text-textSecondary truncate mt-0.5 font-sans">{song.artistName}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

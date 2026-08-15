import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Search, Play, Music, Radio } from 'lucide-react';
import api from '../services/api';
import { setQueue, setIsPlaying } from '../store/playerSlice';

export default function SearchPage() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ songs: [], artists: [], albums: [], stations: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ songs: [], artists: [], albums: [], stations: [] });
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handlePlaySong = (song, idx) => {
    dispatch(setQueue({ songs: results.songs, startIndex: idx }));
    dispatch(setIsPlaying(true));
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      {/* Search Input Box */}
      <div className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-accent" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search songs, artists, albums, or stations..."
          className="w-full pl-11 md:pl-14 pr-4 py-3.5 md:py-4 rounded-2xl glass-panel text-sm md:text-lg text-textPrimary placeholder:text-textSecondary/60 border border-borderCustom focus:border-accent focus:outline-none transition-all shadow-2xl"
          autoFocus
        />
      </div>

      {loading && <p className="text-center font-mono text-accent text-xs md:text-sm animate-pulse">Searching Nostalgia FM Archive...</p>}

      {/* Results */}
      {query && !loading && (
        <div className="space-y-8">
          {/* Songs Results */}
          {results.songs.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif font-bold text-lg md:text-xl text-textPrimary flex items-center gap-2">
                <Music className="w-5 h-5 text-accent" /> Songs ({results.songs.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.songs.map((song, idx) => (
                  <div
                    key={song._id}
                    onClick={() => handlePlaySong(song, idx)}
                    className="p-3 rounded-xl glass-card flex items-center justify-between cursor-pointer hover:border-accent"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <img src={song.coverUrl} alt={song.title} className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-serif font-bold text-sm text-textPrimary truncate">{song.title}</h4>
                        <p className="text-xs text-textSecondary truncate">{song.artistName}</p>
                      </div>
                    </div>
                    <button className="p-2.5 rounded-full bg-accent text-black font-bold shrink-0 ml-2">
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Stations Results */}
          {results.stations.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-serif font-bold text-lg md:text-xl text-textPrimary flex items-center gap-2">
                <Radio className="w-5 h-5 text-accent" /> Radio Stations ({results.stations.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.stations.map((st) => (
                  <div key={st._id} className="p-4 rounded-xl glass-card">
                    <h3 className="font-serif font-bold text-base text-textPrimary">{st.name}</h3>
                    <p className="text-xs text-textSecondary mt-1 line-clamp-2">{st.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {results.songs.length === 0 && results.stations.length === 0 && (
            <div className="text-center py-12 space-y-2">
              <p className="font-serif font-bold text-lg text-textPrimary">No Archive Matches Found</p>
              <p className="text-xs text-textSecondary font-sans">Try searching for "Kumar Sanu", "Bengali", "Aashiqui", or "90s"</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

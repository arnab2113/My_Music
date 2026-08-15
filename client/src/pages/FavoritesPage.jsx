import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, Play } from 'lucide-react';
import api from '../services/api';
import { setFavoritesState, toggleAuthModal } from '../store/authSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const { isAuthenticated, favorites } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/favorites').then((res) => dispatch(setFavoritesState(res.data)));
    }
  }, [isAuthenticated, dispatch]);

  const handlePlayAll = () => {
    if (favorites.length > 0) {
      dispatch(setQueue({ songs: favorites, startIndex: 0 }));
      dispatch(setIsPlaying(true));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-36 text-center space-y-4 px-4">
        <Heart className="w-14 h-14 md:w-16 md:h-16 text-red-500 mx-auto animate-pulse" />
        <h2 className="font-serif font-bold text-xl md:text-2xl text-textPrimary">Sign In to Save Favorite Songs</h2>
        <button
          onClick={() => dispatch(toggleAuthModal('login'))}
          className="px-6 py-2.5 rounded-full bg-accent text-black font-bold shadow-lg shadow-accentGlow text-xs md:text-sm"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      <div className="flex items-center justify-between border-b border-borderCustom/60 pb-4">
        <div className="flex items-center space-x-3">
          <Heart className="w-7 h-7 md:w-8 md:h-8 text-red-500 fill-current animate-bounce shrink-0" />
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-textPrimary">Your Favorite Tracks</h1>
            <p className="text-xs md:text-sm text-textSecondary font-sans">{favorites.length} saved nostalgic songs.</p>
          </div>
        </div>
        {favorites.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-accent text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-accentGlow shrink-0"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" /> <span className="hidden sm:inline">Play All Favorites</span><span className="sm:hidden">Play All</span>
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 space-y-2 glass-panel rounded-2xl p-8">
          <p className="font-serif font-bold text-lg text-textPrimary">No favorites yet.</p>
          <p className="text-xs text-textSecondary font-sans">Start saving songs you love by tapping the heart icon on any player.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {favorites.map((song, idx) => (
            <div
              key={song._id}
              onClick={() => {
                dispatch(setQueue({ songs: favorites, startIndex: idx }));
                dispatch(setIsPlaying(true));
              }}
              className="group p-4 rounded-2xl glass-card cursor-pointer transition-all duration-300 hover:border-accent"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-neutral-900">
                <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button className="absolute bottom-3 right-3 p-3 rounded-full bg-accent text-black font-bold shadow-lg">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </button>
              </div>
              <h3 className="font-serif font-bold text-base text-textPrimary truncate">{song.title}</h3>
              <p className="text-xs text-textSecondary truncate font-sans">{song.artistName}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Play, Heart } from 'lucide-react';

export default function SongListView({ songs = [], onPlaySong, favorites = [], onToggleFavorite }) {
  const formatDuration = (secs) => {
    if (!secs || isNaN(secs)) return '03:45';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isFav = (songId) => {
    if (!favorites) return false;
    return favorites.some((f) => (typeof f === 'string' ? f === songId : f._id === songId));
  };

  return (
    <div className="w-full space-y-1.5">
      {/* Table Header (Gaana Style) */}
      <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] md:text-xs font-mono uppercase text-textSecondary border-b border-borderCustom/60 select-none">
        <div className="col-span-1 text-center">S.No.</div>
        <div className="col-span-7 sm:col-span-6 md:col-span-5">Track</div>
        <div className="hidden sm:block sm:col-span-3 md:col-span-4">Album</div>
        <div className="col-span-4 sm:col-span-2 md:col-span-2 text-right">Duration</div>
      </div>

      {/* Table Body Rows */}
      {songs.map((song, idx) => {
        const favorite = isFav(song._id);

        return (
          <div
            key={song._id || idx}
            onClick={() => onPlaySong(song, idx)}
            className="grid grid-cols-12 gap-2 px-3 py-2.5 rounded-xl glass-card items-center cursor-pointer transition-all duration-300 hover:border-accent hover:bg-white/5 group"
          >
            {/* Track Index / Play icon */}
            <div className="col-span-1 text-center font-mono text-xs text-textSecondary group-hover:text-accent flex items-center justify-center">
              <span className="group-hover:hidden font-semibold">{idx + 1}</span>
              <Play className="w-3.5 h-3.5 fill-current text-accent hidden group-hover:block ml-0.5" />
            </div>

            {/* Track Info (Cover + Title + Artist) */}
            <div className="col-span-7 sm:col-span-6 md:col-span-5 flex items-center space-x-3 min-w-0">
              <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-lg overflow-hidden shrink-0 bg-neutral-900 border border-borderCustom">
                <img
                  src={song.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80'}
                  alt={song.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Play className="w-4 h-4 text-accent fill-current" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-xs md:text-sm text-textPrimary group-hover:text-accent transition-colors truncate">
                  {song.title}
                </h4>
                <p className="text-[11px] text-textSecondary font-sans truncate">{song.artistName || 'Artist'}</p>
              </div>
            </div>

            {/* Album Title */}
            <div className="hidden sm:block sm:col-span-3 md:col-span-4 text-xs text-textSecondary font-sans truncate">
              {song.albumName || song.album?.title || 'Single'}
            </div>

            {/* Favorite & Duration */}
            <div className="col-span-4 sm:col-span-2 md:col-span-2 flex items-center justify-end space-x-2.5 text-xs font-mono text-textSecondary">
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(song._id);
                  }}
                  className={`p-1 rounded-full transition-transform active:scale-125 ${
                    favorite ? 'text-red-500 fill-current' : 'text-textSecondary hover:text-textPrimary'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-current' : ''}`} />
                </button>
              )}
              <span>{formatDuration(song.duration)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

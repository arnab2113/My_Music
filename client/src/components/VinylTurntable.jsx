import React from 'react';
import { Disc } from 'lucide-react';

export default function VinylTurntable({ coverUrl, isPlaying, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-32 h-32 md:w-40 md:h-40',
    lg: 'w-56 h-56 md:w-72 md:h-72'
  };

  const armSize = {
    sm: 'w-10 h-10 -top-2 -right-2',
    md: 'w-24 h-24 -top-4 -right-4',
    lg: 'w-40 h-40 -top-6 -right-6'
  };

  return (
    <div className="relative inline-flex items-center justify-center select-none group">
      {/* Vinyl Disc Container */}
      <div
        className={`relative rounded-full vinyl-record border-4 border-neutral-900 flex items-center justify-center shadow-2xl transition-transform duration-500 animate-spin-vinyl ${
          !isPlaying ? 'paused-spin' : ''
        } ${sizeClasses[size] || sizeClasses.md}`}
      >
        {/* Grooves Texture Overlay */}
        <div className="absolute inset-0 rounded-full vinyl-grooves pointer-events-none opacity-40" />

        {/* Center Artwork Label */}
        <div className="relative w-1/3 h-1/3 rounded-full overflow-hidden border-2 border-amber-500/60 shadow-inner flex items-center justify-center bg-black">
          {coverUrl ? (
            <img src={coverUrl} alt="Vinyl Center Label" className="w-full h-full object-cover" />
          ) : (
            <Disc className="w-1/2 h-1/2 text-accent" />
          )}
          {/* Spindle hole */}
          <div className="absolute w-2 h-2 rounded-full bg-neutral-900 border border-neutral-700" />
        </div>
      </div>
    </div>
  );
}

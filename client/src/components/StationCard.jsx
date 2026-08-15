import React from 'react';
import { Play, Radio, Users, Sparkles } from 'lucide-react';

export default function StationCard({ station, onPlay, isActive }) {
  return (
    <div
      onClick={() => onPlay(station)}
      className={`group relative p-5 rounded-2xl glass-card cursor-pointer transition-all duration-300 ${
        isActive ? 'border-accent shadow-2xl shadow-accentGlow bg-black/60' : 'hover:border-accent/60'
      }`}
    >
      {/* Background artwork blur */}
      {station.cover && (
        <div
          className="absolute inset-0 rounded-2xl bg-cover bg-center opacity-10 group-hover:opacity-20 transition-opacity"
          style={{ backgroundImage: `url(${station.cover})` }}
        />
      )}

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-md bg-black/60 text-accent border border-borderCustom">
            {station.language}
          </span>
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{station.listenerCount || 42} LISTENING</span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-base md:text-lg text-textPrimary group-hover:text-accent transition-colors">
            {station.name}
          </h3>
          <p className="text-xs text-textSecondary line-clamp-2 font-sans">
            {station.description}
          </p>
        </div>

        {/* Bottom Play bar */}
        <div className="flex items-center justify-between pt-2 border-t border-borderCustom/50">
          <span className="text-[11px] text-textSecondary font-mono uppercase">
            {station.genre}
          </span>
          <button className="p-2.5 rounded-full bg-accent text-black font-bold group-hover:scale-110 transition-transform shadow-md shadow-accentGlow">
            <Play className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}

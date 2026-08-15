import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Radio, Play, Users, Disc } from 'lucide-react';
import api from '../services/api';
import { setStations, setActiveStation } from '../store/radioSlice';
import { setQueue, setIsPlaying } from '../store/playerSlice';

export default function RadioPage() {
  const dispatch = useDispatch();
  const { stations } = useSelector((state) => state.radio);

  useEffect(() => {
    api.get('/radio').then((res) => dispatch(setStations(res.data)));
  }, [dispatch]);

  const handlePlayStation = async (st) => {
    dispatch(setActiveStation(st));
    let validSongs = (st.songs || []).filter((s) => s && typeof s === 'object' && s.audioUrl);

    if (validSongs.length === 0) {
      try {
        const res = await api.get(`/songs?language=${encodeURIComponent(st.language || '')}`);
        validSongs = res.data.filter((s) => s && s.audioUrl);
      } catch (err) {
        console.warn('RadioPage fallback station song fetch failed:', err);
      }
    }

    if (validSongs.length > 0) {
      dispatch(setQueue({ songs: validSongs, startIndex: 0 }));
      dispatch(setIsPlaying(true));
    }
  };

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-44 md:pb-32 max-w-7xl mx-auto px-4 md:px-8 space-y-6 md:space-y-8">
      <div className="border-b border-borderCustom/60 pb-4">
        <div className="flex items-center space-x-3">
          <Radio className="w-7 h-7 md:w-8 md:h-8 text-accent animate-pulse shrink-0" />
          <div>
            <h1 className="font-serif font-extrabold text-2xl md:text-3xl text-textPrimary">Radio Stations</h1>
            <p className="text-xs md:text-sm text-textSecondary font-sans">
              Continuous nostalgic radio broadcasts synchronized across listeners.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stations.map((st) => (
          <div
            key={st._id}
            onClick={() => handlePlayStation(st)}
            className="group relative p-5 md:p-6 rounded-2xl glass-card cursor-pointer transition-all duration-300 hover:border-accent hover:shadow-2xl hover:shadow-accentGlow flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] md:text-xs uppercase font-mono tracking-widest px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/40">
                  {st.language} • {st.genre}
                </span>
                <div className="flex items-center space-x-1 text-[11px] md:text-xs font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>{st.listenerCount || 84} LISTENING</span>
                </div>
              </div>

              <h2 className="font-serif font-bold text-lg md:text-xl text-textPrimary group-hover:text-accent transition-colors">
                {st.name}
              </h2>
              <p className="text-xs text-textSecondary font-sans mt-2 line-clamp-2">{st.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-borderCustom/50">
              <span className="text-[11px] md:text-xs font-mono text-textSecondary">
                {st.songs?.length || 0} Tracks in Rotation
              </span>
              <button className="p-2.5 md:p-3 rounded-full bg-accent text-black font-bold group-hover:scale-110 transition-transform shadow-md shadow-accentGlow">
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

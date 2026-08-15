import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Minimize2, ChevronDown, Play, Pause, SkipBack, SkipForward, Heart, Volume2, Shuffle, Repeat, Radio } from 'lucide-react';
import {
  toggleFullscreen,
  setIsPlaying,
  playNext,
  playPrevious,
  toggleShuffle,
  toggleRepeat,
  setTimeUpdate,
  setVolume
} from '../store/playerSlice';
import { audioEngine } from '../services/audioEngine';
import VinylTurntable from './VinylTurntable';
import AudioVisualizer from './AudioVisualizer';

export default function FullscreenPlayer() {
  const dispatch = useDispatch();
  const { currentSong, isPlaying, currentTime, duration, isFullscreen, isShuffle, isRepeat, volume, currentStation } = useSelector(
    (state) => state.player
  );
  const { currentTheme } = useSelector((state) => state.theme);

  if (!isFullscreen || !currentSong) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      audioEngine.pause();
      dispatch(setIsPlaying(false));
    } else {
      audioEngine.play();
      dispatch(setIsPlaying(true));
    }
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioEngine.seek(time);
    dispatch(setTimeUpdate({ currentTime: time, duration }));
  };

  const formatTime = (s) => {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex flex-col justify-end md:justify-between p-0 md:p-12 overflow-hidden select-none animate-in fade-in duration-300">
      {/* Background Album Art Blur */}
      {currentSong.coverUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 blur-3xl scale-125 transition-all duration-700 pointer-events-none"
          style={{ backgroundImage: `url(${currentSong.coverUrl})` }}
        />
      )}

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM SHEET PLAYER (Exact Match to Image 2) */}
      {/* ========================================================================= */}
      <div className="md:hidden relative z-10 w-full bg-[#120d0b]/95 border-t border-amber-500/25 rounded-t-[36px] p-6 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[92vh] overflow-y-auto">
        {/* Top Drag Indicator Handle */}
        <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto -mt-2 mb-1 cursor-pointer" onClick={() => dispatch(toggleFullscreen())} />

        {/* Top Bar Header & Chevron Down Close */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-widest text-accent">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>NOSTALGIA PLAYER</span>
          </div>
          <button
            onClick={() => dispatch(toggleFullscreen())}
            className="p-2 rounded-full text-textSecondary hover:text-accent hover:bg-white/10 transition-all"
            title="Close Player"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Center Rotating Circular Album Artwork Disc (Matching Image 2) */}
        <div className="flex justify-center py-2">
          <div className="relative w-60 h-60 rounded-full p-2.5 bg-gradient-to-tr from-amber-600/30 via-amber-400/20 to-purple-600/30 shadow-2xl shadow-accentGlow/50">
            <div
              className={`w-full h-full rounded-full overflow-hidden border-4 border-amber-500/50 shadow-2xl transition-all duration-700 ${
                isPlaying ? 'animate-spin-slow' : ''
              }`}
              style={{
                animationPlayState: isPlaying ? 'running' : 'paused'
              }}
            >
              <img
                src={currentSong.coverUrl || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=600&q=80'}
                alt={currentSong.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Center Vinyl Center Ring */}
            <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-stone-900 border-2 border-amber-500/60 shadow-md flex items-center justify-center pointer-events-none">
              <div className="w-3 h-3 rounded-full bg-black" />
            </div>
          </div>
        </div>

        {/* Track Details (Station Badge, Song Title, Artist Name) */}
        <div className="text-center space-y-1.5 px-2">
          <span className="text-[11px] font-mono tracking-widest text-accent uppercase inline-flex items-center justify-center gap-1.5 font-bold px-3 py-0.5 rounded-full bg-accent/10 border border-accent/30">
            <Radio className="w-3.5 h-3.5" />
            {currentStation ? currentStation.name : (currentSong.genre || 'MIXED RADIO')}
          </span>
          <h2 className="font-serif font-extrabold text-lg text-textPrimary leading-snug line-clamp-2">
            {currentSong.title}
          </h2>
          <p className="text-xs text-textSecondary font-sans font-medium truncate">
            {currentSong.artistName || 'Unknown Artist'}
          </p>
        </div>

        {/* Retro Radio Frequency Tuning Bar (Matching Image 2 dial) */}
        <div className="px-4 py-2 rounded-xl bg-black/50 border border-amber-500/20 text-center font-mono text-[10px] text-amber-200/80 flex items-center justify-between shadow-inner">
          <span>88 MHz</span>
          <span>96</span>
          <span className="text-accent font-bold">104</span>
          <span className="px-2 py-0.5 rounded bg-accent/20 text-accent font-bold border border-accent/40">108 MHz</span>
        </div>

        {/* Progress Timeline Seek Slider */}
        <div className="space-y-1 px-1">
          <div className="flex justify-between text-[11px] font-mono text-textSecondary">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime || 0}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/15 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {/* Primary Playback Transport Controls */}
        <div className="flex items-center justify-center space-x-6 pt-1">
          <button
            onClick={() => dispatch(playPrevious())}
            className="p-3.5 rounded-full bg-white/5 border border-borderCustom text-textPrimary hover:text-accent hover:bg-white/10 active:scale-90 transition-all"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-4 rounded-full bg-accent text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-accentGlow"
          >
            {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => dispatch(playNext())}
            className="p-3.5 rounded-full bg-white/5 border border-borderCustom text-textPrimary hover:text-accent hover:bg-white/10 active:scale-90 transition-all"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* Dual Volume Control Sliders */}
        <div className="flex items-center justify-center space-x-3 pt-2">
          <Volume2 className="w-4 h-4 text-textSecondary shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => {
              dispatch(setVolume(Number(e.target.value)));
              audioEngine.setVolume(Number(e.target.value));
            }}
            className="w-44 h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DESKTOP CINEMATIC FULLSCREEN PLAYER */}
      {/* ========================================================================= */}
      <div className="hidden md:flex flex-col justify-between w-full h-full">
        {/* Top Header Controls */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-accent">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>FULLSCREEN CINEMATIC PLAYER</span>
          </div>
          <button
            onClick={() => dispatch(toggleFullscreen())}
            className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Center Vinyl & Metadata */}
        <div className="relative z-10 my-auto flex flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          <div className="shrink-0">
            <VinylTurntable coverUrl={currentSong.coverUrl} isPlaying={isPlaying} size="lg" />
          </div>

          <div className="text-left space-y-4 max-w-lg">
            <span className="text-xs font-mono tracking-widest text-accent uppercase px-3 py-1 rounded-full bg-accent/10 border border-accent/30">
              {currentSong.genre || '90s Classics'} • {currentSong.language}
            </span>
            <h1 className="font-serif font-extrabold text-4xl md:text-5xl text-textPrimary leading-tight">
              {currentSong.title}
            </h1>
            <p className="text-lg md:text-xl text-textSecondary font-sans font-medium">
              {currentSong.artistName}
            </p>

            {/* Real Web Audio Visualizer Bar */}
            <div className="h-12 w-full pt-4">
              <AudioVisualizer isPlaying={isPlaying} mode="spectrum" height={48} accentColor={currentTheme?.colors?.accent || '#f59e0b'} />
            </div>
          </div>
        </div>

        {/* Bottom Transport Controls & Seek */}
        <div className="relative z-10 max-w-3xl w-full mx-auto space-y-6">
          {/* Seek slider */}
          <div className="space-y-1">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={handleSeek}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-xs font-mono text-textSecondary">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-8">
            <button onClick={() => dispatch(toggleShuffle())} className={isShuffle ? 'text-accent' : 'text-textSecondary'}>
              <Shuffle className="w-5 h-5" />
            </button>

            <button onClick={() => dispatch(playPrevious())} className="text-textSecondary hover:text-white transition-colors">
              <SkipBack className="w-8 h-8" />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-5 rounded-full bg-accent text-black font-bold hover:scale-110 active:scale-95 transition-all shadow-xl shadow-accentGlow"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>

            <button onClick={() => dispatch(playNext())} className="text-textSecondary hover:text-white transition-colors">
              <SkipForward className="w-8 h-8" />
            </button>

            <button onClick={() => dispatch(toggleRepeat())} className={isRepeat ? 'text-accent' : 'text-textSecondary'}>
              <Repeat className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

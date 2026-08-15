import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Maximize2,
  FileText
} from 'lucide-react';
import {
  setIsPlaying,
  setTimeUpdate,
  setVolume,
  toggleMute,
  playNext,
  playPrevious,
  toggleShuffle,
  toggleRepeat,
  toggleFullscreen,
  toggleLyrics
} from '../store/playerSlice';
import { audioEngine } from '../services/audioEngine';
import VinylTurntable from './VinylTurntable';
import AudioVisualizer from './AudioVisualizer';
import api from '../services/api';
import { setFavoritesState, toggleAuthModal } from '../store/authSlice';
import { addToast } from '../store/uiSlice';

export default function PersistentPlayer() {
  const dispatch = useDispatch();
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffle,
    isRepeat,
    currentStation
  } = useSelector((state) => state.player);

  const { isAuthenticated, favorites } = useSelector((state) => state.auth);
  const { isHideUI } = useSelector((state) => state.ui);

  const [isLiked, setIsLiked] = useState(false);

  // Sync song loading & auto-play to audioEngine
  useEffect(() => {
    if (currentSong && currentSong.audioUrl) {
      audioEngine.loadSong(currentSong.audioUrl);
      if (isPlaying) {
        audioEngine.play();
      }
    }
  }, [currentSong?._id, currentSong?.audioUrl]);

  // Real-Time Play Count Increment when new song starts
  useEffect(() => {
    if (currentSong && currentSong._id) {
      api.post(`/songs/${currentSong._id}/play`).catch(() => {});
    }
  }, [currentSong?._id]);

  // Real-Time Listening Time Tracker (records 5s playback chunks to MongoDB every 5s while listening)
  useEffect(() => {
    if (!isPlaying || !currentSong || !isAuthenticated) return;
    const interval = setInterval(() => {
      api.post('/history', { songId: currentSong._id, duration: 5 }).catch(() => {});
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying, currentSong?._id, isAuthenticated]);

  // Sync volume & mute to audioEngine
  useEffect(() => {
    audioEngine.setVolume(isMuted ? 0 : volume);
  }, [volume, isMuted]);

  // Wire audioEngine callbacks for continuous auto-play when song ends
  useEffect(() => {
    audioEngine.onTimeUpdateCallback = ({ currentTime, duration }) => {
      dispatch(setTimeUpdate({ currentTime, duration }));
    };

    audioEngine.onEndedCallback = () => {
      if (isRepeat) {
        audioEngine.seek(0);
        audioEngine.play();
      } else {
        dispatch(playNext());
        setTimeout(() => {
          audioEngine.play();
          dispatch(setIsPlaying(true));
        }, 150);
      }
    };
  }, [dispatch, isRepeat]);

  // Sync favorite state
  useEffect(() => {
    if (currentSong && favorites) {
      const liked = favorites.some((f) => (typeof f === 'string' ? f === currentSong._id : f._id === currentSong._id));
      setIsLiked(liked);
    }
  }, [currentSong, favorites]);

  if (!currentSong || isHideUI) return null;

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
    const seekTime = Number(e.target.value);
    audioEngine.seek(seekTime);
    dispatch(setTimeUpdate({ currentTime: seekTime, duration }));
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      dispatch(toggleAuthModal('login'));
      return;
    }
    try {
      const res = await api.post('/favorites/toggle', { songId: currentSong._id });
      dispatch(setFavoritesState(res.data.favorites));
      setIsLiked(res.data.isFavorite);
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

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[96%] max-w-5xl z-50 transition-all duration-500">
      <div className="glass-panel p-2.5 md:px-6 md:py-3.5 rounded-2xl border border-borderCustom/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-2 md:gap-3 bg-black/90 backdrop-blur-xl">
        {/* Left: Vinyl Disc & Track Info */}
        <div className="flex items-center justify-between space-x-3 w-full md:w-1/3 min-w-0">
          <div className="flex items-center space-x-3 min-w-0 flex-1 cursor-pointer" onClick={() => dispatch(toggleFullscreen())}>
            <div className="shrink-0">
              <VinylTurntable coverUrl={currentSong.coverUrl} isPlaying={isPlaying} size="sm" />
            </div>
            <div className="min-w-0 flex-1">
              {currentStation && (
                <span className="text-[9px] uppercase font-mono tracking-widest text-accent flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                  <span className="truncate">{currentStation.name}</span>
                </span>
              )}
              <h4 className="font-serif font-bold text-xs md:text-sm text-textPrimary truncate">{currentSong.title}</h4>
              <p className="text-[11px] md:text-xs text-textSecondary truncate font-sans">{currentSong.artistName || 'Unknown Artist'}</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 shrink-0">
            <button
              onClick={handleToggleFavorite}
              className={`p-1.5 rounded-full transition-transform active:scale-125 ${
                isLiked ? 'text-red-500 fill-current' : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => dispatch(toggleFullscreen())}
              className="md:hidden p-1.5 rounded-full text-textSecondary hover:text-accent"
              title="Fullscreen Player"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Controls & Seek Bar */}
        <div className="flex flex-col items-center w-full md:w-2/5 space-y-1">
          {/* Controls */}
          <div className="flex items-center space-x-3 md:space-x-4">
            <button
              onClick={() => dispatch(toggleShuffle())}
              className={`p-1 rounded-full text-xs transition-colors ${
                isShuffle ? 'text-accent' : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => dispatch(playPrevious())}
              className="p-1 rounded-full text-textSecondary hover:text-textPrimary transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              className="p-2.5 md:p-3 rounded-full bg-accent text-black hover:scale-105 active:scale-95 transition-all shadow-md shadow-accentGlow"
            >
              {isPlaying ? <Pause className="w-4 h-4 md:w-5 md:h-5 fill-current" /> : <Play className="w-4 h-4 md:w-5 md:h-5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={() => dispatch(playNext())}
              className="p-1 rounded-full text-textSecondary hover:text-textPrimary transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(toggleRepeat())}
              className={`p-1 rounded-full text-xs transition-colors ${
                isRepeat ? 'text-accent' : 'text-textSecondary hover:text-textPrimary'
              }`}
              title="Repeat"
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Seek Bar */}
          <div className="flex items-center space-x-2 w-full text-[10px] md:text-[11px] font-mono text-textSecondary px-1">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              onChange={handleSeek}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume, Visualizer & Screen Modals */}
        <div className="hidden md:flex items-center justify-end space-x-3 w-1/3">
          {/* Mini Visualizer */}
          <div className="w-20 h-6">
            <AudioVisualizer isPlaying={isPlaying} mode="bars" height={24} />
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-1.5">
            <button onClick={() => dispatch(toggleMute())} className="text-textSecondary hover:text-textPrimary">
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
              className="w-16 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Lyrics Toggle */}
          <button
            onClick={() => dispatch(toggleLyrics())}
            className="p-1.5 rounded-full text-textSecondary hover:text-accent transition-colors"
            title="Lyrics"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Fullscreen Player Toggle */}
          <button
            onClick={() => dispatch(toggleFullscreen())}
            className="p-1.5 rounded-full text-textSecondary hover:text-accent transition-colors"
            title="Fullscreen Player (F)"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

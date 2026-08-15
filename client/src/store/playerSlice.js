import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.8,
  isMuted: false,
  queue: [],
  queueIndex: 0,
  isShuffle: false,
  isRepeat: false,
  currentStation: null,
  isFullscreen: false,
  isLyricsOpen: false
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong(state, action) {
      state.currentSong = action.payload;
    },
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
    },
    setTimeUpdate(state, action) {
      state.currentTime = action.payload.currentTime;
      if (action.payload.duration) {
        state.duration = action.payload.duration;
      }
    },
    setVolume(state, action) {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
    },
    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },
    setQueue(state, action) {
      state.queue = action.payload.songs || [];
      state.queueIndex = action.payload.startIndex || 0;
      if (state.queue.length > 0) {
        state.currentSong = state.queue[state.queueIndex];
        state.isPlaying = true;
      }
    },
    playNext(state) {
      if (state.queue.length === 0) return;
      if (state.isShuffle) {
        state.queueIndex = Math.floor(Math.random() * state.queue.length);
      } else {
        state.queueIndex = (state.queueIndex + 1) % state.queue.length;
      }
      state.currentSong = state.queue[state.queueIndex];
      state.isPlaying = true;
    },
    playPrevious(state) {
      if (state.queue.length === 0) return;
      state.queueIndex = (state.queueIndex - 1 + state.queue.length) % state.queue.length;
      state.currentSong = state.queue[state.queueIndex];
      state.isPlaying = true;
    },
    toggleShuffle(state) {
      state.isShuffle = !state.isShuffle;
    },
    toggleRepeat(state) {
      state.isRepeat = !state.isRepeat;
    },
    setCurrentStation(state, action) {
      state.currentStation = action.payload;
    },
    toggleFullscreen(state) {
      state.isFullscreen = !state.isFullscreen;
    },
    toggleLyrics(state) {
      state.isLyricsOpen = !state.isLyricsOpen;
    }
  }
});

export const {
  setCurrentSong,
  setIsPlaying,
  setTimeUpdate,
  setVolume,
  toggleMute,
  setQueue,
  playNext,
  playPrevious,
  toggleShuffle,
  toggleRepeat,
  setCurrentStation,
  toggleFullscreen,
  toggleLyrics
} = playerSlice.actions;

export default playerSlice.reducer;

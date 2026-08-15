import { configureStore } from '@reduxjs/toolkit';
import playerReducer from './playerSlice';
import themeReducer from './themeSlice';
import radioReducer from './radioSlice';
import ambienceReducer from './ambienceSlice';
import authReducer from './authSlice';
import playlistReducer from './playlistSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    theme: themeReducer,
    radio: radioReducer,
    ambience: ambienceReducer,
    auth: authReducer,
    playlist: playlistReducer,
    ui: uiReducer
  }
});

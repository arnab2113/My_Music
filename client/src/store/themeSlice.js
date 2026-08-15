import { createSlice } from '@reduxjs/toolkit';
import { THEMES, applyThemeTokens } from '../themes/themeSystem';

const savedThemeId = localStorage.getItem('nostalgia_theme') || 'midnight-cafe';
const savedAccent = localStorage.getItem('nostalgia_accent') || null;

const initialState = {
  currentThemeId: savedThemeId,
  currentTheme: THEMES.find((t) => t.id === savedThemeId) || THEMES[0],
  customAccent: savedAccent,
  particleMode: THEMES.find((t) => t.id === savedThemeId)?.particles || 'dust',
  isThemeDrawerOpen: false
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      const themeId = action.payload;
      const theme = applyThemeTokens(themeId, state.customAccent);
      state.currentThemeId = themeId;
      state.currentTheme = theme;
      state.particleMode = theme.particles;
      localStorage.setItem('nostalgia_theme', themeId);
    },
    setCustomAccent(state, action) {
      const accent = action.payload;
      state.customAccent = accent;
      applyThemeTokens(state.currentThemeId, accent);
      localStorage.setItem('nostalgia_accent', accent);
    },
    setParticleMode(state, action) {
      state.particleMode = action.payload;
    },
    toggleThemeDrawer(state) {
      state.isThemeDrawerOpen = !state.isThemeDrawerOpen;
    }
  }
});

export const { setTheme, setCustomAccent, setParticleMode, toggleThemeDrawer } = themeSlice.actions;
export default themeSlice.reducer;

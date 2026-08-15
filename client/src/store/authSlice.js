import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('nostalgia_user') || 'null');

const initialState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
  favorites: savedUser?.favorites || [],
  isAuthModalOpen: false,
  authModalMode: 'login'
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      if (action.payload) {
        localStorage.setItem('nostalgia_user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('nostalgia_user');
      }
    },
    setFavoritesState(state, action) {
      state.favorites = action.payload;
    },
    toggleAuthModal(state, action) {
      state.isAuthModalOpen = !state.isAuthModalOpen;
      if (action.payload) {
        state.authModalMode = action.payload;
      }
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.favorites = [];
      localStorage.removeItem('nostalgia_user');
    }
  }
});

export const { setUser, setFavoritesState, toggleAuthModal, logout } = authSlice.actions;
export default authSlice.reducer;

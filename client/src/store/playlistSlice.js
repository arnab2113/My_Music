import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  playlists: [],
  currentPlaylist: null
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylists(state, action) {
      state.playlists = action.payload;
    },
    setCurrentPlaylist(state, action) {
      state.currentPlaylist = action.payload;
    }
  }
});

export const { setPlaylists, setCurrentPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;

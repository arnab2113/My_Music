import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAmbienceModalOpen: false,
  volumes: {
    rain: 0,
    cafe: 0,
    fireplace: 0,
    vinyl: 0,
    ocean: 0,
    forest: 0,
    city: 0
  }
};

const ambienceSlice = createSlice({
  name: 'ambience',
  initialState,
  reducers: {
    toggleAmbienceModal(state) {
      state.isAmbienceModalOpen = !state.isAmbienceModalOpen;
    },
    setAmbienceVolumeState(state, action) {
      const { soundId, volume } = action.payload;
      state.volumes[soundId] = volume;
    }
  }
});

export const { toggleAmbienceModal, setAmbienceVolumeState } = ambienceSlice.actions;
export default ambienceSlice.reducer;

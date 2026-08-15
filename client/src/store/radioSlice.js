import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stations: [],
  activeStation: null,
  listenerCounts: {},
  totalListeners: 428
};

const radioSlice = createSlice({
  name: 'radio',
  initialState,
  reducers: {
    setStations(state, action) {
      state.stations = action.payload;
    },
    setActiveStation(state, action) {
      state.activeStation = action.payload;
    },
    updateListenerCount(state, action) {
      const { stationSlug, count } = action.payload;
      state.listenerCounts[stationSlug] = count;
      state.totalListeners = Object.values(state.listenerCounts).reduce((a, b) => a + b, 350);
    }
  }
});

export const { setStations, setActiveStation, updateListenerCount } = radioSlice.actions;
export default radioSlice.reducer;

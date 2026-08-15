import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isHideUI: false,
  isKeyboardHelpOpen: false,
  toasts: []
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleHideUI(state) {
      state.isHideUI = !state.isHideUI;
    },
    setHideUI(state, action) {
      state.isHideUI = action.payload;
    },
    toggleKeyboardHelp(state) {
      state.isKeyboardHelpOpen = !state.isKeyboardHelpOpen;
    },
    addToast(state, action) {
      state.toasts.push({
        id: Date.now(),
        message: action.payload.message,
        type: action.payload.type || 'info'
      });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    }
  }
});

export const { toggleHideUI, setHideUI, toggleKeyboardHelp, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;

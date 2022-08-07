import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",
  isDarkMode: false,
  userAddress: undefined,
  approvedArray: [false, true, false, false, false],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDarkMode: (state, action) => {
      state.theme = action.payload.theme;
      state.isDarkMode = action.payload.isDarkMode
    },
    updateUserAddress: (state, action) => {
      state.userAddress = action.payload.userAddress
    },
    updateApprovedArray: (state, action) => {
      state.approvedArray = action.payload.approvedArray
    }
  },
});

export default appSlice.reducer;

export const {toggleDarkMode, updateUserAddress, updateApprovedArray } = appSlice.actions;

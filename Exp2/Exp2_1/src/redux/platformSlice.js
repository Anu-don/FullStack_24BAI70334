import { createSlice } from "@reduxjs/toolkit";

const platformSlice = createSlice({
  name: "platform",

  initialState: {
    platformName: "Twitter",
  },

  reducers: {
    setPlatform: (state, action) => {
      state.platformName = action.payload;
    },
  },
});

export const { setPlatform } = platformSlice.actions;

export default platformSlice.reducer;

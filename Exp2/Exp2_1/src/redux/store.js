import { configureStore } from "@reduxjs/toolkit";

import postReducer from "./postSlice";
import platformReducer from "./platformSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
    platform: platformReducer,
  },
});
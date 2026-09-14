import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [
      { id: 1, title: "React", likes: 12 },
      { id: 2, title: "Redux Toolkit", likes: 25 },
      { id: 3, title: "JavaScript", likes: 8 },
      { id: 4, title: "Node.js", likes: 30 },
    ],
  },

  reducers: {
    addLike: (state, action) => {
      const post = state.posts.find(p => p.id === action.payload);

      if (post) {
        post.likes++;
      }
    },
  },
});

export const { addLike } = postSlice.actions;

export default postSlice.reducer;
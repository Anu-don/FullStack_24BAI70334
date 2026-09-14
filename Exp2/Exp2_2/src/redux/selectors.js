import { createSelector } from "reselect";

const selectPosts = state => state.posts.posts;

export const popularPosts = createSelector(
    [selectPosts],
    posts => posts.filter(post => post.likes >= 20)
);
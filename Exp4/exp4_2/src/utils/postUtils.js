// All functions here are pure: they take the current posts map and return a
// NEW map rather than mutating it. This keeps state updates predictable and
// makes React.memo comparisons on unaffected day-cells work correctly, since
// only the affected key's array reference changes.

export function addPost(posts, key, text) {
  if (!key || !text || text.trim() === "") return posts;
  const existing = posts[key] || [];
  return { ...posts, [key]: [...existing, text] };
}

export function deletePost(posts, key, index) {
  if (!posts[key]) return posts;
  const updated = posts[key].filter((_, i) => i !== index);
  return { ...posts, [key]: updated };
}

export function movePost(posts, fromKey, fromIndex, toKey) {
  if (!fromKey || !toKey || fromKey === toKey) return posts;

  const fromList = posts[fromKey] || [];
  const movedPost = fromList[fromIndex];
  if (movedPost === undefined) return posts;

  const newFromList = fromList.filter((_, i) => i !== fromIndex);
  const newToList = [...(posts[toKey] || []), movedPost];

  return {
    ...posts,
    [fromKey]: newFromList,
    [toKey]: newToList,
  };
}

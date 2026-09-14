import { addPost, deletePost, movePost } from './postUtils';

describe('postUtils', () => {
  test('addPost adds text under a new key', () => {
    const result = addPost({}, '2026-8-7', 'Hello world');
    expect(result).toEqual({ '2026-8-7': ['Hello world'] });
  });

  test('addPost appends to an existing key without mutating original', () => {
    const original = { '2026-8-7': ['First post'] };
    const result = addPost(original, '2026-8-7', 'Second post');

    expect(result['2026-8-7']).toEqual(['First post', 'Second post']);
    expect(original['2026-8-7']).toEqual(['First post']); // original untouched
    expect(result).not.toBe(original); // new object reference
  });

  test('addPost ignores empty or whitespace-only text', () => {
    const original = {};
    expect(addPost(original, '2026-8-7', '')).toBe(original);
    expect(addPost(original, '2026-8-7', '   ')).toBe(original);
  });

  test('addPost ignores missing key', () => {
    const original = {};
    expect(addPost(original, null, 'Some text')).toBe(original);
  });

  test('deletePost removes only the targeted index', () => {
    const original = { '2026-8-7': ['A', 'B', 'C'] };
    const result = deletePost(original, '2026-8-7', 1);

    expect(result['2026-8-7']).toEqual(['A', 'C']);
    expect(original['2026-8-7']).toEqual(['A', 'B', 'C']); // original untouched
  });

  test('deletePost is a no-op for a key with no posts', () => {
    const original = { '2026-8-7': ['A'] };
    expect(deletePost(original, '2026-8-8', 0)).toBe(original);
  });

  test('movePost transfers a post from one day to another', () => {
    const original = {
      '2026-8-7': ['Post A', 'Post B'],
      '2026-8-10': ['Post C'],
    };
    const result = movePost(original, '2026-8-7', 0, '2026-8-10');

    expect(result['2026-8-7']).toEqual(['Post B']);
    expect(result['2026-8-10']).toEqual(['Post C', 'Post A']);
    // original untouched
    expect(original['2026-8-7']).toEqual(['Post A', 'Post B']);
  });

  test('movePost is a no-op when source and target keys match', () => {
    const original = { '2026-8-7': ['Post A'] };
    expect(movePost(original, '2026-8-7', 0, '2026-8-7')).toBe(original);
  });

  test('movePost is a no-op when the source index does not exist', () => {
    const original = { '2026-8-7': ['Post A'] };
    expect(movePost(original, '2026-8-7', 5, '2026-8-10')).toBe(original);
  });

  test('other day keys keep the same array reference after an unrelated change', () => {
    // This is the property React.memo relies on to skip re-rendering unrelated DayCells
    const original = { '2026-8-7': ['A'], '2026-8-8': ['B'] };
    const result = addPost(original, '2026-8-7', 'C');

    expect(result['2026-8-8']).toBe(original['2026-8-8']); // same reference, unchanged
    expect(result['2026-8-7']).not.toBe(original['2026-8-7']); // new reference, changed
  });
});

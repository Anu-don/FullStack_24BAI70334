import { render, screen, fireEvent } from '@testing-library/react';
import PostItem from './PostItem';

test('renders the post text', () => {
  render(
    <PostItem post="Launch campaign" index={0} dayKey="2026-8-7" onDragStart={() => {}} onDelete={() => {}} />
  );
  expect(screen.getByText('Launch campaign')).toBeInTheDocument();
});

test('calls onDragStart with dayKey and index when drag begins', () => {
  const onDragStart = jest.fn();
  render(
    <PostItem post="Launch campaign" index={2} dayKey="2026-8-7" onDragStart={onDragStart} onDelete={() => {}} />
  );
  fireEvent.dragStart(screen.getByTestId('post-item'));
  expect(onDragStart).toHaveBeenCalledWith('2026-8-7', 2);
});

test('calls onDelete with dayKey and index when the delete icon is clicked', () => {
  const onDelete = jest.fn();
  render(
    <PostItem post="Launch campaign" index={1} dayKey="2026-8-7" onDragStart={() => {}} onDelete={onDelete} />
  );
  fireEvent.click(screen.getByLabelText('delete-post-1'));
  expect(onDelete).toHaveBeenCalledWith('2026-8-7', 1);
});

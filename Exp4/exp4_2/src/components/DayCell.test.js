import { render, screen, fireEvent } from '@testing-library/react';
import DayCell from './DayCell';

const noop = () => {};

test('renders an empty cell for a null day', () => {
  const { container } = render(
    <DayCell
      day={null}
      dayKey={null}
      posts={[]}
      isSelected={false}
      isToday={false}
      onSelectDay={noop}
      onDragStart={noop}
      onDrop={noop}
      onDeletePost={noop}
    />
  );
  expect(container.querySelector('.empty')).toBeInTheDocument();
});

test('renders the day number', () => {
  render(
    <DayCell
      day={15}
      dayKey="2026-8-15"
      posts={[]}
      isSelected={false}
      isToday={false}
      onSelectDay={noop}
      onDragStart={noop}
      onDrop={noop}
      onDeletePost={noop}
    />
  );
  expect(screen.getByTestId('day-15')).toHaveTextContent('15');
});

test('applies the "selected" class when isSelected is true', () => {
  render(
    <DayCell
      day={7}
      dayKey="2026-8-7"
      posts={[]}
      isSelected={true}
      isToday={false}
      onSelectDay={noop}
      onDragStart={noop}
      onDrop={noop}
      onDeletePost={noop}
    />
  );
  expect(screen.getByTestId('day-7')).toHaveClass('selected');
});

test('calls onSelectDay with the day number when clicked', () => {
  const onSelectDay = jest.fn();
  render(
    <DayCell
      day={10}
      dayKey="2026-8-10"
      posts={[]}
      isSelected={false}
      isToday={false}
      onSelectDay={onSelectDay}
      onDragStart={noop}
      onDrop={noop}
      onDeletePost={noop}
    />
  );
  fireEvent.click(screen.getByTestId('day-10'));
  expect(onSelectDay).toHaveBeenCalledWith(10);
});

test('renders scheduled posts inside the cell', () => {
  render(
    <DayCell
      day={7}
      dayKey="2026-8-7"
      posts={['Post A', 'Post B']}
      isSelected={false}
      isToday={false}
      onSelectDay={noop}
      onDragStart={noop}
      onDrop={noop}
      onDeletePost={noop}
    />
  );
  expect(screen.getAllByTestId('post-item')).toHaveLength(2);
  expect(screen.getByText('Post A')).toBeInTheDocument();
  expect(screen.getByText('Post B')).toBeInTheDocument();
});

test('calls onDrop with the dayKey when a post is dropped on this cell', () => {
  const onDrop = jest.fn();
  render(
    <DayCell
      day={12}
      dayKey="2026-8-12"
      posts={[]}
      isSelected={false}
      isToday={false}
      onSelectDay={noop}
      onDragStart={noop}
      onDrop={onDrop}
      onDeletePost={noop}
    />
  );
  fireEvent.drop(screen.getByTestId('day-12'));
  expect(onDrop).toHaveBeenCalledWith('2026-8-12');
});

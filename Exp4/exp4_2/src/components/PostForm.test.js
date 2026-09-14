import { render, screen, fireEvent } from '@testing-library/react';
import PostForm from './PostForm';

test('shows a prompt to select a day when none is selected', () => {
  render(
    <PostForm selectedDay={null} monthLabel="August" year={2026} postText="" onChangeText={() => {}} onSubmit={() => {}} />
  );
  expect(screen.getByText('Select a day on the calendar to schedule a post')).toBeInTheDocument();
  expect(screen.getByTestId('post-textarea')).toBeDisabled();
  expect(screen.getByTestId('schedule-button')).toBeDisabled();
});

test('shows the selected date once a day is chosen', () => {
  render(
    <PostForm selectedDay={7} monthLabel="August" year={2026} postText="" onChangeText={() => {}} onSubmit={() => {}} />
  );
  expect(screen.getByText('Schedule a post for August 7, 2026')).toBeInTheDocument();
  expect(screen.getByTestId('post-textarea')).not.toBeDisabled();
  expect(screen.getByTestId('schedule-button')).not.toBeDisabled();
});

test('calls onChangeText as the user types', () => {
  const onChangeText = jest.fn();
  render(
    <PostForm selectedDay={7} monthLabel="August" year={2026} postText="" onChangeText={onChangeText} onSubmit={() => {}} />
  );
  fireEvent.change(screen.getByTestId('post-textarea'), { target: { value: 'New post text' } });
  expect(onChangeText).toHaveBeenCalledWith('New post text');
});

test('calls onSubmit when Schedule Post is clicked', () => {
  const onSubmit = jest.fn();
  render(
    <PostForm selectedDay={7} monthLabel="August" year={2026} postText="Ready to go" onChangeText={() => {}} onSubmit={onSubmit} />
  );
  fireEvent.click(screen.getByTestId('schedule-button'));
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

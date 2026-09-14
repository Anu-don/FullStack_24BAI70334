import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { MONTH_NAMES } from './utils/dateUtils';

function expectedCurrentLabel() {
  const now = new Date();
  return `${MONTH_NAMES[now.getMonth()]} ${now.getFullYear()}`;
}

test('renders the current month and year by default', () => {
  render(<App />);
  expect(screen.getByTestId('header-label')).toHaveTextContent(expectedCurrentLabel());
});

test('navigating to the next month advances the label', () => {
  render(<App />);
  const now = new Date();
  fireEvent.click(screen.getByLabelText('next-month'));

  const nextMonth = (now.getMonth() + 1) % 12;
  const nextYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();
  expect(screen.getByTestId('header-label')).toHaveTextContent(
    `${MONTH_NAMES[nextMonth]} ${nextYear}`
  );
});

test('navigating to the previous month rewinds the label', () => {
  render(<App />);
  const now = new Date();
  fireEvent.click(screen.getByLabelText('previous-month'));

  const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
  const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  expect(screen.getByTestId('header-label')).toHaveTextContent(
    `${MONTH_NAMES[prevMonth]} ${prevYear}`
  );
});

test('selecting a day highlights it and enables the post form', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('day-15'));

  expect(screen.getByTestId('day-15')).toHaveClass('selected');
  expect(screen.getByTestId('post-textarea')).not.toBeDisabled();
  expect(screen.getByTestId('schedule-button')).not.toBeDisabled();
});

test('scheduling a post adds it to the selected day', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('day-15'));
  fireEvent.change(screen.getByTestId('post-textarea'), {
    target: { value: 'Publish newsletter' },
  });
  fireEvent.click(screen.getByTestId('schedule-button'));

  expect(screen.getByText('Publish newsletter')).toBeInTheDocument();
  // textarea should clear after scheduling
  expect(screen.getByTestId('post-textarea')).toHaveValue('');
});

test('the schedule button is a no-op when the textarea is blank', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('day-15'));
  fireEvent.click(screen.getByTestId('schedule-button'));

  expect(screen.queryByTestId('post-item')).not.toBeInTheDocument();
});

test('deleting a scheduled post removes it', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('day-15'));
  fireEvent.change(screen.getByTestId('post-textarea'), {
    target: { value: 'Temporary post' },
  });
  fireEvent.click(screen.getByTestId('schedule-button'));
  expect(screen.getByText('Temporary post')).toBeInTheDocument();

  fireEvent.click(screen.getByLabelText('delete-post-0'));
  expect(screen.queryByText('Temporary post')).not.toBeInTheDocument();
});

test('dragging a post from one day and dropping it on another moves it', () => {
  render(<App />);

  // Schedule a post on day 5
  fireEvent.click(screen.getByTestId('day-5'));
  fireEvent.change(screen.getByTestId('post-textarea'), {
    target: { value: 'Movable post' },
  });
  fireEvent.click(screen.getByTestId('schedule-button'));

  const postItem = screen.getByTestId('post-item');
  fireEvent.dragStart(postItem);
  fireEvent.drop(screen.getByTestId('day-20'));

  // Post should now appear inside day 20's cell, not day 5's
  const day5Cell = screen.getByTestId('day-5');
  const day20Cell = screen.getByTestId('day-20');
  expect(day5Cell.textContent).not.toContain('Movable post');
  expect(day20Cell.textContent).toContain('Movable post');
});

test('clicking the same day twice does not clear the selection', () => {
  render(<App />);
  fireEvent.click(screen.getByTestId('day-15'));
  fireEvent.click(screen.getByTestId('day-15'));
  expect(screen.getByTestId('day-15')).toHaveClass('selected');
});

import { render, screen, fireEvent } from '@testing-library/react';
import CalendarHeader from './CalendarHeader';

test('renders the month/year label', () => {
  render(<CalendarHeader label="August 2026" onPrev={() => {}} onNext={() => {}} />);
  expect(screen.getByTestId('header-label')).toHaveTextContent('August 2026');
});

test('calls onPrev when Prev is clicked', () => {
  const onPrev = jest.fn();
  render(<CalendarHeader label="August 2026" onPrev={onPrev} onNext={() => {}} />);
  fireEvent.click(screen.getByLabelText('previous-month'));
  expect(onPrev).toHaveBeenCalledTimes(1);
});

test('calls onNext when Next is clicked', () => {
  const onNext = jest.fn();
  render(<CalendarHeader label="August 2026" onPrev={() => {}} onNext={onNext} />);
  fireEvent.click(screen.getByLabelText('next-month'));
  expect(onNext).toHaveBeenCalledTimes(1);
});

test('does not re-render when props are unchanged (React.memo)', () => {
  const onPrev = () => {};
  const onNext = () => {};
  const { rerender } = render(<CalendarHeader label="August 2026" onPrev={onPrev} onNext={onNext} />);
  expect(screen.getByTestId('header-render-count')).toHaveTextContent('1');

  rerender(<CalendarHeader label="August 2026" onPrev={onPrev} onNext={onNext} />);
  expect(screen.getByTestId('header-render-count')).toHaveTextContent('1');
});

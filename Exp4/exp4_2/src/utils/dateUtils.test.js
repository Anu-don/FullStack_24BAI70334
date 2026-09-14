import { getMonthGrid, dateKey, isToday, MONTH_NAMES, WEEKDAYS } from './dateUtils';

describe('dateUtils', () => {
  test('WEEKDAYS and MONTH_NAMES have correct lengths', () => {
    expect(WEEKDAYS).toHaveLength(7);
    expect(MONTH_NAMES).toHaveLength(12);
  });

  test('getMonthGrid returns a grid whose length is a multiple of 7', () => {
    const grid = getMonthGrid(2026, 7); // August 2026
    expect(grid.length % 7).toBe(0);
  });

  test('getMonthGrid pads leading blanks before day 1', () => {
    const year = 2026, month = 7; // August 2026
    const firstDay = new Date(year, month, 1).getDay();
    const grid = getMonthGrid(year, month);

    expect(grid.slice(0, firstDay).every((c) => c === null)).toBe(true);
    expect(grid[firstDay]).toBe(1);
  });

  test('getMonthGrid includes every day of the month exactly once', () => {
    const year = 2026, month = 1; // February 2026 (28 days, not a leap year)
    const grid = getMonthGrid(year, month);
    const days = grid.filter((c) => c !== null);
    expect(days).toHaveLength(28);
    expect(days[days.length - 1]).toBe(28);
  });

  test('getMonthGrid handles leap year correctly', () => {
    const grid = getMonthGrid(2024, 1); // February 2024 (leap year, 29 days)
    const days = grid.filter((c) => c !== null);
    expect(days).toHaveLength(29);
  });

  test('dateKey formats year-month-day consistently', () => {
    expect(dateKey(2026, 0, 5)).toBe('2026-1-5');
    expect(dateKey(2026, 11, 25)).toBe('2026-12-25');
  });

  test('isToday matches only the exact day/month/year', () => {
    const today = new Date(2026, 7, 7); // Aug 7 2026
    expect(isToday(7, 7, 2026, today)).toBe(true);
    expect(isToday(8, 7, 2026, today)).toBe(false);
    expect(isToday(7, 6, 2026, today)).toBe(false);
    expect(isToday(7, 7, 2025, today)).toBe(false);
  });
});

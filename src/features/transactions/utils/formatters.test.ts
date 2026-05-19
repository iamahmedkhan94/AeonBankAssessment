import type { Transaction } from '../types';

import {
  formatCurrency,
  formatDate,
  groupByMonth,
  isDebit,
} from './formatters';

describe('formatDate', () => {
  it('returns a human readable date string', () => {
    const result = formatDate('2024-10-15T12:34:56Z');
    expect(result).toMatch(/\d{1,2} Oct 2024/);
  });

  it('includes AM or PM', () => {
    const result = formatDate('2024-10-15T12:34:56Z');
    expect(result).toMatch(/(AM|PM)/);
  });

  it('handles different months correctly', () => {
    expect(formatDate('2024-09-21T09:12:45Z')).toMatch(/Sep 2024/);
    expect(formatDate('2024-08-30T11:47:22Z')).toMatch(/Aug 2024/);
    expect(formatDate('2024-12-01T08:45:00Z')).toMatch(/Dec 2024/);
  });
});

describe('formatCurrency', () => {
  it('formats positive amounts with RM prefix', () => {
    expect(formatCurrency(1500)).toMatch(/^RM /);
  });

  it('formats negative amounts with -RM prefix', () => {
    expect(formatCurrency(-500)).toMatch(/^-RM /);
  });

  it('always shows two decimal places', () => {
    expect(formatCurrency(1500)).toContain('.00');
    expect(formatCurrency(2300.75)).toContain('.75');
    expect(formatCurrency(0)).toContain('.00');
  });

  it('formats thousands with a separator', () => {
    expect(formatCurrency(1500)).toContain('1,500');
    expect(formatCurrency(5000)).toContain('5,000');
  });

  it('uses the absolute value for the number portion of negative amounts', () => {
    expect(formatCurrency(-500)).toContain('500.00');
    expect(formatCurrency(-500)).not.toContain('-500');
  });
});

describe('isDebit', () => {
  it('returns true for negative amounts', () => {
    expect(isDebit(-500)).toBe(true);
    expect(isDebit(-0.01)).toBe(true);
  });

  it('returns false for positive amounts', () => {
    expect(isDebit(1500)).toBe(false);
    expect(isDebit(0.01)).toBe(false);
  });

  it('returns false for zero', () => {
    expect(isDebit(0)).toBe(false);
  });
});

describe('groupByMonth', () => {
  const transactions: Transaction[] = [
    {
      refId: 'A',
      transferDate: '2024-12-01T08:00:00Z',
      recipientName: 'Alice',
      transferName: 'Payment A',
      amount: 100,
    },
    {
      refId: 'B',
      transferDate: '2024-12-15T08:00:00Z',
      recipientName: 'Bob',
      transferName: 'Payment B',
      amount: 200,
    },
    {
      refId: 'C',
      transferDate: '2024-11-10T08:00:00Z',
      recipientName: 'Carol',
      transferName: 'Payment C',
      amount: 300,
    },
  ];

  it('creates one section per unique month', () => {
    const sections = groupByMonth(transactions);
    expect(sections).toHaveLength(2);
  });

  it('labels sections with the full month and year', () => {
    const sections = groupByMonth(transactions);
    const titles = sections.map(s => s.title);
    expect(titles).toContain('December 2024');
    expect(titles).toContain('November 2024');
  });

  it('places all transactions for the same month in one section', () => {
    const sections = groupByMonth(transactions);
    const december = sections.find(s => s.title === 'December 2024');
    expect(december?.data).toHaveLength(2);
  });

  it('returns an empty array for an empty input', () => {
    expect(groupByMonth([])).toEqual([]);
  });

  it('preserves the original transaction order within each section', () => {
    const sections = groupByMonth(transactions);
    const december = sections.find(s => s.title === 'December 2024');
    expect(december?.data[0].refId).toBe('A');
    expect(december?.data[1].refId).toBe('B');
  });
});

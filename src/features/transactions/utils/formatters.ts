import { format, parseISO } from 'date-fns';

import type { Transaction } from '../types';

export interface TransactionSection {
  title: string;
  data: Transaction[];
}

export function formatDate(isoString: string): string {
  return format(parseISO(isoString), 'd MMM yyyy, h:mm a');
}

export function formatCurrency(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(abs);
  return amount < 0 ? `-RM ${formatted}` : `RM ${formatted}`;
}

export function isDebit(amount: number): boolean {
  return amount < 0;
}

export function groupByMonth(transactions: Transaction[]): TransactionSection[] {
  const map = new Map<string, Transaction[]>();

  for (const transaction of transactions) {
    const key = format(parseISO(transaction.transferDate), 'MMMM yyyy');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(transaction);
  }

  return Array.from(map.entries()).map(([title, data]) => ({ title, data }));
}

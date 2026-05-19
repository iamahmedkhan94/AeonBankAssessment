import { format, parseISO } from 'date-fns';

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

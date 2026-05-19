export const colors = {
  primary: '#003087',
  primaryLight: '#1A4BA0',

  credit: '#27AE60',
  creditBackground: '#EAF7EF',
  debit: '#E74C3C',
  debitBackground: '#FDEDEC',

  background: '#F5F7FA',
  surface: '#FFFFFF',

  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textInverse: '#FFFFFF',

  border: '#E5E7EB',
  divider: '#F3F4F6',

  shadow: '#000000',
} as const;

export type ColorKey = keyof typeof colors;

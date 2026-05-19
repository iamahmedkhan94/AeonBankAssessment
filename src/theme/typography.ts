import { StyleSheet } from 'react-native';

import { colors } from './colors';

export const typography = StyleSheet.create({
  heading1: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  heading2: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export type TypographyKey = keyof typeof typography;

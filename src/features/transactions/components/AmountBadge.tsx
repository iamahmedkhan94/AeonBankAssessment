import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

import { formatCurrency, isDebit } from '../utils/formatters';

interface Props {
  amount: number;
}

export function AmountBadge({ amount }: Props) {
  const debit = isDebit(amount);

  return (
    <View style={[styles.badge, debit ? styles.debitBadge : styles.creditBadge]}>
      <Text style={[typography.amount, debit ? styles.debitText : styles.creditText]}>
        {formatCurrency(amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  creditBadge: {
    backgroundColor: colors.creditBackground,
  },
  debitBadge: {
    backgroundColor: colors.debitBackground,
  },
  creditText: {
    color: colors.credit,
  },
  debitText: {
    color: colors.debit,
  },
});

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

import type { Transaction } from '../types';
import { formatDate } from '../utils/formatters';

import { AmountBadge } from './AmountBadge';

interface Props {
  transaction: Transaction;
  onPress: () => void;
}

export function TransactionCard({ transaction, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`${transaction.transferName} to ${transaction.recipientName}`}
    >
      <View style={styles.left}>
        <Text style={typography.heading2} numberOfLines={1}>
          {transaction.transferName}
        </Text>
        <Text style={[typography.bodySmall, styles.recipient]} numberOfLines={1}>
          {transaction.recipientName}
        </Text>
        <Text style={typography.label}>{formatDate(transaction.transferDate)}</Text>
      </View>
      <AmountBadge amount={transaction.amount} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  left: {
    flex: 1,
    marginRight: spacing.md,
    gap: spacing.xs,
  },
  recipient: {
    marginTop: 2,
  },
});

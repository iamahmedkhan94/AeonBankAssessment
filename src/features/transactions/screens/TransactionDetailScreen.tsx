import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

import { AmountBadge } from '../components/AmountBadge';
import { useTransactionStore } from '../store/useTransactionStore';
import type { RootStackParamList } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionDetail'>;

interface ShareButtonProps {
  onPress: () => void;
}

function ShareHeaderButton({ onPress }: ShareButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel="Share transaction"
      accessibilityRole="button"
    >
      <Text style={styles.shareButton}>Share</Text>
    </TouchableOpacity>
  );
}

export function TransactionDetailScreen({ navigation, route }: Props) {
  const { refId } = route.params;

  const transaction = useTransactionStore(s =>
    s.allTransactions.find((t: { refId: string }) => t.refId === refId),
  );

  const handleShare = useCallback(async () => {
    if (!transaction) {
      return;
    }

    const message = [
      'Transaction Details',
      `Reference ID: ${transaction.refId}`,
      `Date: ${formatDate(transaction.transferDate)}`,
      `Transfer: ${transaction.transferName}`,
      `Recipient: ${transaction.recipientName}`,
      `Amount: ${formatCurrency(transaction.amount)}`,
    ].join('\n');

    try {
      await Share.share({ message });
    } catch {
      Alert.alert('Unable to share', 'Please try again.');
    }
  }, [transaction]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <ShareHeaderButton onPress={handleShare} />,
    });
  }, [navigation, handleShare]);

  if (!transaction) {
    return (
      <View style={styles.empty}>
        <Text style={typography.heading2}>Transaction not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.amountRow}>
          <Text style={typography.label}>Amount</Text>
          <AmountBadge amount={transaction.amount} />
        </View>

        <View style={styles.divider} />

        <DetailRow label="Reference ID" value={transaction.refId} />
        <DetailRow label="Transfer" value={transaction.transferName} />
        <DetailRow label="Recipient" value={transaction.recipientName} />
        <DetailRow label="Date" value={formatDate(transaction.transferDate)} />
      </View>

      <TouchableOpacity
        style={styles.shareButtonFull}
        onPress={handleShare}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Share transaction details"
      >
        <Text style={styles.shareButtonFullText}>Share Details</Text>
      </TouchableOpacity>
    </View>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <View style={styles.row}>
      <Text style={typography.label}>{label}</Text>
      <Text style={[typography.body, styles.rowValue]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  rowValue: {
    flex: 1,
    textAlign: 'right',
    marginLeft: spacing.md,
  },
  shareButton: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  shareButtonFull: {
    marginTop: spacing.lg,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  shareButtonFullText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});

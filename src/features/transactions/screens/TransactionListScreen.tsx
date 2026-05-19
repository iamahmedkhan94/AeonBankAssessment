import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

import { TransactionCard } from '../components/TransactionCard';
import { useTransactionStore } from '../store/useTransactionStore';
import type { RootStackParamList, Transaction } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionList'>;

export function TransactionListScreen({ navigation }: Props) {
  const transactions = useTransactionStore(s => s.transactions);
  const loadTransactions = useTransactionStore(s => s.loadTransactions);
  const selectTransaction = useTransactionStore(s => s.selectTransaction);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handlePress = useCallback(
    (refId: string) => {
      selectTransaction(refId);
      navigation.navigate('TransactionDetail', { refId });
    },
    [selectTransaction, navigation],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Transaction>) => (
      <TransactionCard transaction={item} onPress={() => handlePress(item.refId)} />
    ),
    [handlePress],
  );

  const keyExtractor = useCallback((item: Transaction) => item.refId, []);

  if (transactions.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={typography.heading2}>No transactions yet</Text>
        <Text style={[typography.bodySmall, styles.emptySubtitle]}>
          Your transactions will appear here
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    gap: spacing.xs,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
  },
});

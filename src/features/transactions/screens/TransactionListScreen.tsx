import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ActivityIndicator,
  SectionList,
  StyleSheet,
  Text,
  View,
  type SectionListRenderItemInfo,
} from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';
import { typography } from '@theme/typography';

import { FilterBar } from '../components/FilterBar';
import { SectionHeader } from '../components/SectionHeader';
import { SkeletonCard } from '../components/SkeletonCard';
import { TransactionCard } from '../components/TransactionCard';
import { useTransactionStore } from '../store/useTransactionStore';
import type { FilterType, RootStackParamList, SortBy, Transaction } from '../types';
import { groupByMonth, type TransactionSection } from '../utils/formatters';

type Props = NativeStackScreenProps<RootStackParamList, 'TransactionList'>;

export function TransactionListScreen({ navigation }: Props) {
  const visibleTransactions = useTransactionStore(s => s.visibleTransactions);
  const isLoading = useTransactionStore(s => s.isLoading);
  const isLoadingMore = useTransactionStore(s => s.isLoadingMore);
  const hasMore = useTransactionStore(s => s.hasMore);
  const error = useTransactionStore(s => s.error);
  const filterType = useTransactionStore(s => s.filterType);
  const sortBy = useTransactionStore(s => s.sortBy);
  const loadTransactions = useTransactionStore(s => s.loadTransactions);
  const loadMore = useTransactionStore(s => s.loadMore);
  const setFilterType = useTransactionStore(s => s.setFilterType);
  const setSortBy = useTransactionStore(s => s.setSortBy);
  const selectTransaction = useTransactionStore(s => s.selectTransaction);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const sections = useMemo(
    () => groupByMonth(visibleTransactions),
    [visibleTransactions],
  );

  const handlePress = useCallback(
    (refId: string) => {
      selectTransaction(refId);
      navigation.navigate('TransactionDetail', { refId });
    },
    [selectTransaction, navigation],
  );

  const handleFilterTypeChange = useCallback(
    (type: FilterType) => setFilterType(type),
    [setFilterType],
  );

  const handleSortByChange = useCallback(
    (sort: SortBy) => setSortBy(sort),
    [setSortBy],
  );

  const renderItem = useCallback(
    ({ item }: SectionListRenderItemInfo<Transaction, TransactionSection>) => (
      <TransactionCard transaction={item} onPress={() => handlePress(item.refId)} />
    ),
    [handlePress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: TransactionSection }) => (
      <SectionHeader title={section.title} count={section.data.length} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Transaction) => item.refId, []);

  const renderFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    if (!hasMore && visibleTransactions.length > 0) {
      return (
        <View style={styles.footer}>
          <Text style={typography.label}>You have reached the end</Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, visibleTransactions.length]);

  const renderEmpty = useCallback(() => {
    if (isLoading) {
      return null;
    }
    return (
      <View style={styles.empty}>
        <Text style={typography.heading2}>No transactions found</Text>
        <Text style={[typography.bodySmall, styles.emptySubtitle]}>
          Try adjusting your filters
        </Text>
      </View>
    );
  }, [isLoading]);

  const renderHeader = useCallback(
    () => (
      <FilterBar
        filterType={filterType}
        sortBy={sortBy}
        onFilterTypeChange={handleFilterTypeChange}
        onSortByChange={handleSortByChange}
      />
    ),
    [filterType, sortBy, handleFilterTypeChange, handleSortByChange],
  );

  if (error) {
    return (
      <View style={styles.screen}>
        <FilterBar
          filterType={filterType}
          sortBy={sortBy}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
        />
        <View style={styles.empty}>
          <Text style={typography.heading2}>Something went wrong</Text>
          <Text style={[typography.bodySmall, styles.emptySubtitle]}>{error}</Text>
        </View>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.screen}>
        <FilterBar
          filterType={filterType}
          sortBy={sortBy}
          onFilterTypeChange={handleFilterTypeChange}
          onSortByChange={handleSortByChange}
        />
        <View style={styles.skeletonContainer}>
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </View>
      </View>
    );
  }

  return (
    <SectionList
      sections={sections}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
      onRefresh={loadTransactions}
      refreshing={isLoading}
      onEndReached={loadMore}
      onEndReachedThreshold={0.3}
      stickySectionHeadersEnabled
    />
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  skeletonContainer: {
    paddingVertical: spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxl,
    gap: spacing.xs,
  },
  emptySubtitle: {
    marginTop: spacing.xs,
  },
});

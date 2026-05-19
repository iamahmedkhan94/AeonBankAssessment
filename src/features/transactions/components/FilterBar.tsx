import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@theme/colors';
import { spacing } from '@theme/spacing';

import type { FilterType, SortBy } from '../types';

interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

function FilterChip({ label, active, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface Props {
  filterType: FilterType;
  sortBy: SortBy;
  onFilterTypeChange: (type: FilterType) => void;
  onSortByChange: (sort: SortBy) => void;
}

const FILTER_OPTIONS: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Credits', value: 'credit' },
  { label: 'Debits', value: 'debit' },
];

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
  { label: 'Newest', value: 'date_desc' },
  { label: 'Oldest', value: 'date_asc' },
  { label: 'Highest', value: 'amount_desc' },
  { label: 'Lowest', value: 'amount_asc' },
];

export function FilterBar({ filterType, sortBy, onFilterTypeChange, onSortByChange }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionLabel}>TYPE</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
        nestedScrollEnabled
      >
        {FILTER_OPTIONS.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={filterType === opt.value}
            onPress={() => onFilterTypeChange(opt.value)}
          />
        ))}
      </ScrollView>

      <Text style={[styles.sectionLabel, styles.sectionLabelSort]}>SORT BY</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {SORT_OPTIONS.map(opt => (
          <FilterChip
            key={opt.value}
            label={opt.label}
            active={sortBy === opt.value}
            onPress={() => onSortByChange(opt.value)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  sectionLabelSort: {
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
});

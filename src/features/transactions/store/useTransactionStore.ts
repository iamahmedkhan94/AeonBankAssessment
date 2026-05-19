import { create } from 'zustand';

import { mockTransactions } from '@features/transactions/data/mockTransactions';
import type { FilterType, SortBy, Transaction } from '@features/transactions/types';

const PAGE_SIZE = 5;

function applyFiltersAndSort(
  transactions: Transaction[],
  filterType: FilterType,
  sortBy: SortBy,
): Transaction[] {
  let result = [...transactions];

  if (filterType === 'credit') result = result.filter(t => t.amount > 0);
  else if (filterType === 'debit') result = result.filter(t => t.amount < 0);

  result.sort((a, b) => {
    switch (sortBy) {
      case 'date_desc':
        return new Date(b.transferDate).getTime() - new Date(a.transferDate).getTime();
      case 'date_asc':
        return new Date(a.transferDate).getTime() - new Date(b.transferDate).getTime();
      case 'amount_desc':
        return Math.abs(b.amount) - Math.abs(a.amount);
      case 'amount_asc':
        return Math.abs(a.amount) - Math.abs(b.amount);
    }
  });

  return result;
}

interface TransactionState {
  allTransactions: Transaction[];
  visibleTransactions: Transaction[];
  isLoading: boolean;
  isLoadingMore: boolean;
  page: number;
  hasMore: boolean;
  filterType: FilterType;
  sortBy: SortBy;
  selectedRefId: string | null;

  loadTransactions: () => void;
  loadMore: () => void;
  setFilterType: (filterType: FilterType) => void;
  setSortBy: (sortBy: SortBy) => void;
  selectTransaction: (refId: string) => void;
  getSelectedTransaction: () => Transaction | undefined;
}

function buildVisible(
  all: Transaction[],
  filterType: FilterType,
  sortBy: SortBy,
  page: number,
): { visibleTransactions: Transaction[]; hasMore: boolean } {
  const filtered = applyFiltersAndSort(all, filterType, sortBy);
  const visibleTransactions = filtered.slice(0, page * PAGE_SIZE);
  const hasMore = visibleTransactions.length < filtered.length;
  return { visibleTransactions, hasMore };
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  allTransactions: [],
  visibleTransactions: [],
  isLoading: false,
  isLoadingMore: false,
  page: 1,
  hasMore: false,
  filterType: 'all',
  sortBy: 'date_desc',
  selectedRefId: null,

  loadTransactions: () => {
    set({ isLoading: true });
    setTimeout(() => {
      const { filterType, sortBy } = get();
      const { visibleTransactions, hasMore } = buildVisible(
        mockTransactions,
        filterType,
        sortBy,
        1,
      );
      set({
        allTransactions: mockTransactions,
        visibleTransactions,
        hasMore,
        page: 1,
        isLoading: false,
      });
    }, 1500);
  },

  loadMore: () => {
    const { hasMore, isLoadingMore, allTransactions, filterType, sortBy, page } = get();
    if (!hasMore || isLoadingMore) {
      return;
    }
    set({ isLoadingMore: true });
    setTimeout(() => {
      const nextPage = page + 1;
      const { visibleTransactions, hasMore: newHasMore } = buildVisible(
        allTransactions,
        filterType,
        sortBy,
        nextPage,
      );
      set({ visibleTransactions, hasMore: newHasMore, page: nextPage, isLoadingMore: false });
    }, 600);
  },

  setFilterType: (filterType: FilterType) => {
    const { allTransactions, sortBy } = get();
    const { visibleTransactions, hasMore } = buildVisible(allTransactions, filterType, sortBy, 1);
    set({ filterType, visibleTransactions, hasMore, page: 1 });
  },

  setSortBy: (sortBy: SortBy) => {
    const { allTransactions, filterType } = get();
    const { visibleTransactions, hasMore } = buildVisible(allTransactions, filterType, sortBy, 1);
    set({ sortBy, visibleTransactions, hasMore, page: 1 });
  },

  selectTransaction: (refId: string) => {
    set({ selectedRefId: refId });
  },

  getSelectedTransaction: () => {
    const { allTransactions, selectedRefId } = get();
    return allTransactions.find(t => t.refId === selectedRefId);
  },
}));

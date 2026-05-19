import { create } from 'zustand';

import { mockTransactions } from '@features/transactions/data/mockTransactions';
import type { Transaction } from '@features/transactions/types';

interface TransactionState {
  transactions: Transaction[];
  selectedRefId: string | null;
  isLoading: boolean;
  loadTransactions: () => void;
  selectTransaction: (refId: string) => void;
  getSelectedTransaction: () => Transaction | undefined;
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  selectedRefId: null,
  isLoading: false,

  loadTransactions: () => {
    set({ isLoading: true });
    setTimeout(() => {
      set({ transactions: mockTransactions, isLoading: false });
    }, 1500);
  },

  selectTransaction: (refId: string) => {
    set({ selectedRefId: refId });
  },

  getSelectedTransaction: () => {
    const { transactions, selectedRefId } = get();
    return transactions.find(t => t.refId === selectedRefId);
  },
}));

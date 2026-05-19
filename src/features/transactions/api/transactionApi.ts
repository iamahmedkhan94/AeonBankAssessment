import { mockTransactions } from '../data/mockTransactions';
import type { Transaction } from '../types';

export interface TransactionResponse {
  data: Transaction[];
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Swap the implementation here to point at a real endpoint.
 * The store and screens have no knowledge of how data is fetched.
 */
async function fetchTransactions(): Promise<TransactionResponse> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve({ data: mockTransactions });
      } catch {
        reject(new ApiError(500, 'Failed to load transactions'));
      }
    }, 1500);
  });
}

export const transactionApi = {
  fetchTransactions,
};

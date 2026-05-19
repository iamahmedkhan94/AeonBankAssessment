export interface Transaction {
  refId: string;
  transferDate: string;
  recipientName: string;
  transferName: string;
  amount: number;
}

export type FilterType = 'all' | 'credit' | 'debit';

export type SortBy = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

export type RootStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { refId: string };
};

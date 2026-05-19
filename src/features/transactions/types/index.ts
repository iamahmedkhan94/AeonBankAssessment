export interface Transaction {
  refId: string;
  transferDate: string;
  recipientName: string;
  transferName: string;
  amount: number;
}

export type RootStackParamList = {
  TransactionList: undefined;
  TransactionDetail: { refId: string };
};

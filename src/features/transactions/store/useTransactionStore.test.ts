import { transactionApi } from '../api/transactionApi';
import { mockTransactions } from '../data/mockTransactions';

import { useTransactionStore } from './useTransactionStore';

jest.mock('../api/transactionApi', () => ({
  transactionApi: {
    fetchTransactions: jest.fn(),
  },
}));

const mockFetch = transactionApi.fetchTransactions as jest.MockedFunction<
  typeof transactionApi.fetchTransactions
>;

const CREDIT_COUNT = mockTransactions.filter(t => t.amount > 0).length;
const DEBIT_COUNT = mockTransactions.filter(t => t.amount < 0).length;

beforeEach(() => {
  useTransactionStore.setState({
    allTransactions: [],
    visibleTransactions: [],
    isLoading: false,
    isLoadingMore: false,
    page: 1,
    hasMore: false,
    filterType: 'all',
    sortBy: 'date_desc',
    selectedRefId: null,
  });
});

describe('loadTransactions', () => {
  beforeEach(() => {
    mockFetch.mockResolvedValue({ data: mockTransactions });
  });

  it('sets isLoading to true immediately', () => {
    useTransactionStore.getState().loadTransactions();
    expect(useTransactionStore.getState().isLoading).toBe(true);
  });

  it('populates allTransactions after the promise resolves', async () => {
    await useTransactionStore.getState().loadTransactions();
    expect(useTransactionStore.getState().allTransactions).toHaveLength(
      mockTransactions.length,
    );
  });

  it('sets isLoading to false after the promise resolves', async () => {
    await useTransactionStore.getState().loadTransactions();
    expect(useTransactionStore.getState().isLoading).toBe(false);
  });

  it('shows the first page of results after loading', async () => {
    await useTransactionStore.getState().loadTransactions();
    const { visibleTransactions } = useTransactionStore.getState();
    expect(visibleTransactions.length).toBeLessThanOrEqual(5);
  });

  it('sets error state when the API call fails', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    await useTransactionStore.getState().loadTransactions();
    expect(useTransactionStore.getState().error).not.toBeNull();
    expect(useTransactionStore.getState().isLoading).toBe(false);
  });
});

describe('setFilterType', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      allTransactions: mockTransactions,
      filterType: 'all',
      sortBy: 'date_desc',
      page: 1,
      visibleTransactions: mockTransactions.slice(0, 5),
      hasMore: mockTransactions.length > 5,
    });
  });

  it('shows only credit transactions when filter is credit', () => {
    useTransactionStore.getState().setFilterType('credit');
    const { visibleTransactions } = useTransactionStore.getState();
    expect(visibleTransactions.every(t => t.amount > 0)).toBe(true);
  });

  it('shows only debit transactions when filter is debit', () => {
    useTransactionStore.getState().setFilterType('debit');
    const { visibleTransactions } = useTransactionStore.getState();
    expect(visibleTransactions.every(t => t.amount < 0)).toBe(true);
  });

  it('does not show more items per page than the page size', () => {
    useTransactionStore.getState().setFilterType('credit');
    const { visibleTransactions } = useTransactionStore.getState();
    expect(visibleTransactions.length).toBeLessThanOrEqual(5);
  });

  it('sets hasMore true when filtered results exceed one page', () => {
    useTransactionStore.getState().setFilterType('credit');
    expect(useTransactionStore.getState().hasMore).toBe(CREDIT_COUNT > 5);
  });

  it('sets hasMore false when all debit results fit on one page', () => {
    useTransactionStore.getState().setFilterType('debit');
    expect(useTransactionStore.getState().hasMore).toBe(DEBIT_COUNT > 5);
  });

  it('resets page to 1 when filter changes', () => {
    useTransactionStore.setState({ page: 3 });
    useTransactionStore.getState().setFilterType('credit');
    expect(useTransactionStore.getState().page).toBe(1);
  });
});

describe('setSortBy', () => {
  beforeEach(() => {
    useTransactionStore.setState({
      allTransactions: mockTransactions,
      filterType: 'all',
      sortBy: 'date_desc',
      page: 1,
      visibleTransactions: mockTransactions.slice(0, 5),
      hasMore: mockTransactions.length > 5,
    });
  });

  it('sorts by newest date first when sortBy is date_desc', () => {
    useTransactionStore.getState().setSortBy('date_desc');
    const { visibleTransactions } = useTransactionStore.getState();
    for (let i = 1; i < visibleTransactions.length; i++) {
      const prev = new Date(visibleTransactions[i - 1].transferDate).getTime();
      const curr = new Date(visibleTransactions[i].transferDate).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('sorts by oldest date first when sortBy is date_asc', () => {
    useTransactionStore.getState().setSortBy('date_asc');
    const { visibleTransactions } = useTransactionStore.getState();
    for (let i = 1; i < visibleTransactions.length; i++) {
      const prev = new Date(visibleTransactions[i - 1].transferDate).getTime();
      const curr = new Date(visibleTransactions[i].transferDate).getTime();
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });

  it('sorts by highest absolute amount first when sortBy is amount_desc', () => {
    useTransactionStore.getState().setSortBy('amount_desc');
    const { visibleTransactions } = useTransactionStore.getState();
    for (let i = 1; i < visibleTransactions.length; i++) {
      const prev = Math.abs(visibleTransactions[i - 1].amount);
      const curr = Math.abs(visibleTransactions[i].amount);
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it('sorts by lowest absolute amount first when sortBy is amount_asc', () => {
    useTransactionStore.getState().setSortBy('amount_asc');
    const { visibleTransactions } = useTransactionStore.getState();
    for (let i = 1; i < visibleTransactions.length; i++) {
      const prev = Math.abs(visibleTransactions[i - 1].amount);
      const curr = Math.abs(visibleTransactions[i].amount);
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });

  it('resets page to 1 when sort changes', () => {
    useTransactionStore.setState({ page: 2 });
    useTransactionStore.getState().setSortBy('date_asc');
    expect(useTransactionStore.getState().page).toBe(1);
  });
});

describe('loadMore', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    useTransactionStore.setState({
      allTransactions: mockTransactions,
      visibleTransactions: mockTransactions.slice(0, 5),
      filterType: 'all',
      sortBy: 'date_desc',
      page: 1,
      hasMore: true,
      isLoadingMore: false,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets isLoadingMore to true immediately', () => {
    useTransactionStore.getState().loadMore();
    expect(useTransactionStore.getState().isLoadingMore).toBe(true);
  });

  it('increments the page after the timeout resolves', () => {
    useTransactionStore.getState().loadMore();
    jest.runAllTimers();
    expect(useTransactionStore.getState().page).toBe(2);
  });

  it('appends more transactions after the timeout resolves', () => {
    useTransactionStore.getState().loadMore();
    jest.runAllTimers();
    expect(useTransactionStore.getState().visibleTransactions.length).toBeGreaterThan(5);
  });

  it('does nothing when hasMore is false', () => {
    useTransactionStore.setState({ hasMore: false });
    useTransactionStore.getState().loadMore();
    expect(useTransactionStore.getState().isLoadingMore).toBe(false);
  });

  it('does nothing when already loading more', () => {
    useTransactionStore.setState({ isLoadingMore: true });
    useTransactionStore.getState().loadMore();
    jest.runAllTimers();
    expect(useTransactionStore.getState().page).toBe(1);
  });
});

describe('selectTransaction', () => {
  it('sets the selectedRefId', () => {
    useTransactionStore.getState().selectTransaction('123ABC');
    expect(useTransactionStore.getState().selectedRefId).toBe('123ABC');
  });

  it('getSelectedTransaction returns the matching transaction', () => {
    useTransactionStore.setState({ allTransactions: mockTransactions });
    useTransactionStore.getState().selectTransaction('123ABC');
    const selected = useTransactionStore.getState().getSelectedTransaction();
    expect(selected?.refId).toBe('123ABC');
    expect(selected?.recipientName).toBe('John Doe');
  });

  it('getSelectedTransaction returns undefined when no transaction matches', () => {
    useTransactionStore.setState({ allTransactions: mockTransactions });
    useTransactionStore.getState().selectTransaction('INVALID');
    expect(useTransactionStore.getState().getSelectedTransaction()).toBeUndefined();
  });
});

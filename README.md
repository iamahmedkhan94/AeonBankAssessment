# AEON Bank — Transaction History

A React Native mobile app that displays a list of banking transactions with filtering, sorting, and pagination. Users can view full transaction details and share them externally.

---

## Features

- Transaction list grouped by month with sticky section headers
- Filter by transaction type — All, Credits, Debits
- Sort by date (newest / oldest) or amount (highest / lowest)
- Pagination — loads 5 transactions at a time via infinite scroll
- Pull-to-refresh
- Skeleton loading state on first load
- Error state with user-facing message when the API call fails
- Transaction detail screen with reference ID, date, recipient, and amount
- Native share sheet to export transaction details to any app
- Empty state when no transactions match the active filter
- Zustand-powered state management
- Fully typed with TypeScript — zero `any`
- Pre-commit lint gate via husky and lint-staged

---

## Tech Stack

| | |
|---|---|
| Framework | React Native 0.85 |
| Language | TypeScript |
| State management | Zustand |
| Navigation | React Navigation 7 (native-stack) |
| Date formatting | date-fns |
| Share | React Native built-in Share API |

---

## Architecture

```
src/
  features/
    transactions/
      api/            # API service layer (transactionApi)
      components/     # TransactionCard, AmountBadge, FilterBar, SectionHeader, SkeletonCard
      data/           # Mock transaction data (12 transactions)
      screens/        # TransactionListScreen, TransactionDetailScreen
      store/          # Zustand store — loading, filtering, sorting, pagination, error
      types/          # Transaction, FilterType, SortBy, RootStackParamList
      utils/          # formatDate, formatCurrency, isDebit, groupByMonth
  navigation/         # RootNavigator (NativeStackNavigator)
  theme/              # Colors, spacing, typography constants
```

The API layer (`transactionApi.ts`) is the single data-fetching boundary. The store and screens have no knowledge of where data comes from — swapping the mock for a real endpoint only requires changing that one file.

---

## Prerequisites

Make sure your environment is set up for React Native development.  
Follow the official guide: https://reactnative.dev/docs/set-up-your-environment

You will need:
- Node.js 22+
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

---

## Setup

### 1. Install JavaScript dependencies

```bash
npm install
```

### 2. Install iOS native dependencies

Run the Ruby bundler once to install CocoaPods itself:

```bash
bundle install
```

Then install the native pods:

```bash
bundle exec pod install
```

> Re-run `pod install` any time native dependencies change.

---

## Running the App

Start the Metro bundler in one terminal:

```bash
npm start
```

Then in a second terminal, build for your target platform:

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

> If you recently changed `babel.config.js`, reset the Metro cache first:
> ```bash
> npm start -- --reset-cache
> ```

---

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# With coverage report
npm test -- --coverage
```

41 tests across 3 suites:
- `formatters.test.ts` — formatDate, formatCurrency, isDebit, groupByMonth
- `useTransactionStore.test.ts` — loading, error handling, filtering, sorting, pagination, selection
- `App.test.tsx` — smoke test with mocked navigation and safe area

---

## CI

GitHub Actions runs on every push and pull request to `main`:

1. Install dependencies (`npm ci`)
2. Lint (`npm run lint`)
3. Test (`npm test`)

For CD, the pipeline is structured to support adding Fastlane or EAS Build to produce signed builds and distribute to TestFlight and Firebase App Distribution on merge to `main`.

---

## Linting

```bash
npm run lint
```

ESLint also runs automatically on staged `.ts` and `.tsx` files before every commit via husky and lint-staged.

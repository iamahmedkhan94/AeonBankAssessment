# AEON Bank — Transaction History

A React Native mobile app that displays a list of banking transactions with filtering, sorting, and pagination. Users can view full transaction details and share them externally.

---

## Features

- Transaction list grouped by month with sticky section headers
- Filter by transaction type — All, Credits, Debits
- Sort by date (newest / oldest) or amount (highest / lowest)
- Pagination — loads 5 transactions at a time, infinite scroll
- Pull-to-refresh
- Skeleton loading state on first load
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

> You only need to re-run `pod install` when native dependencies change.

---

## Running the App

Start the Metro bundler in one terminal:

```bash
npm start
```

Then in a second terminal, run the platform you want:

### iOS

```bash
npm run ios
```

### Android

```bash
npm run android
```

> If you have recently changed `babel.config.js`, reset the Metro cache:
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

Tests cover:
- `formatDate`, `formatCurrency`, `isDebit`, `groupByMonth` utilities
- Zustand store — loading, filtering, sorting, pagination, and selection

---

## Project Structure

```
src/
  features/
    transactions/
      components/     # TransactionCard, AmountBadge, FilterBar, SectionHeader, SkeletonCard
      data/           # Mock transaction data (12 transactions)
      screens/        # TransactionListScreen, TransactionDetailScreen
      store/          # Zustand store with filters, sort, and pagination
      types/          # Transaction, FilterType, SortBy, RootStackParamList
      utils/          # Date, currency formatters and groupByMonth
  navigation/         # RootNavigator (NativeStackNavigator)
  theme/              # Colors, spacing, typography constants
```

---

## Linting

```bash
npm run lint
```

Lint also runs automatically on staged files before every commit via husky.

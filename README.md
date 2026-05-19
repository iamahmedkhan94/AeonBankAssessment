# AEON Bank — Transaction History

A React Native mobile app that displays a list of banking transactions and allows users to view transaction details and share them externally.

---

## Features

- Transaction list with transfer name, recipient, date, and colour-coded amount
- Transaction detail screen showing reference ID, date, recipient, and amount
- Native share sheet to export transaction details to any app
- Pull-to-refresh on the transaction list
- Zustand-powered state management
- Fully typed with TypeScript — zero `any`

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

## Project Structure

```
src/
  features/
    transactions/
      components/     # TransactionCard, AmountBadge
      data/           # Mock transaction data
      screens/        # TransactionListScreen, TransactionDetailScreen
      store/          # Zustand store
      types/          # Transaction interface, RootStackParamList
      utils/          # Date and currency formatters
  navigation/         # RootNavigator (NativeStackNavigator)
  theme/              # Colors, spacing, typography constants
```

---

## Linting

```bash
npm run lint
```

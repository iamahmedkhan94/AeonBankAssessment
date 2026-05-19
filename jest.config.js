module.exports = {
  preset: '@react-native/jest-preset',
  moduleNameMapper: {
    '^@features/(.*)$': '<rootDir>/src/features/$1',
    '^@navigation/(.*)$': '<rootDir>/src/navigation/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-screens|react-native-safe-area-context|zustand)/)',
  ],
};

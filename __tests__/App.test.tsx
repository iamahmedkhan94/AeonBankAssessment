import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => children,
    Screen: () => null,
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));

import App from '../App';

test('App renders without crashing', async () => {
  await act(async () => {
    ReactTestRenderer.create(<App />);
  });
});

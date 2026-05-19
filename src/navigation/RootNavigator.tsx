import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { TransactionDetailScreen } from '@features/transactions/screens/TransactionDetailScreen';
import { TransactionListScreen } from '@features/transactions/screens/TransactionListScreen';
import type { RootStackParamList } from '@features/transactions/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TransactionList">
        <Stack.Screen
          name="TransactionList"
          component={TransactionListScreen}
          options={{ title: 'Transactions' }}
        />
        <Stack.Screen
          name="TransactionDetail"
          component={TransactionDetailScreen}
          options={{ title: 'Transaction Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

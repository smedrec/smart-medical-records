import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  // Set isAuthenticated to true to see the main app, false to see login (as per AppNavigator logic)
  // This will be replaced by actual auth state management later.
  return (
    <SafeAreaProvider>
      <AppNavigator isAuthenticated={true} />
    </SafeAreaProvider>
  );
}

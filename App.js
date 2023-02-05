import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './assets/app/navigation/AppNavigator';
import AudioProvider from './assets/app/context/AudioProvider';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}



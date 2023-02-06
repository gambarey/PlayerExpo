import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './assets/app/navigation/AppNavigator';
import AudioProvider from './assets/app/context/AudioProvider';
import { View } from 'react-native';
import AudioListItem from './assets/app/components/AudioListItem';

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}



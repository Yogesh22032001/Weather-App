// src/navigation/ScreenNavigation.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/homeScreen/HomeScreen';
import SearchScreen from '../screens/searchScreen/SearchScreen';
import SettingScreen from '../screens/settingsScreen/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import { RootStackParamList } from './types'; // Import types

const Stack = createStackNavigator<RootStackParamList>();

export function ScreenNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SearchScreen" component={SearchScreen} />
        <Stack.Screen name="Settings" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

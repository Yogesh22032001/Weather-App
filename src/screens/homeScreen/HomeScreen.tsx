// src/screens/HomeScreen.tsx

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types'; // Import types
import { useNavigation } from '@react-navigation/native';

// Type the navigation object
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Type the navigation

  return (
    <View style={styles.container}>
        <View style={styles.nav}>
        <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
        <Text>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text>Settings</Text>
      </TouchableOpacity>
        </View>
     
      <Text>HomeScreen</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%', // Ensure it spans the full width
    paddingHorizontal: 20, // Optional: Add some padding to avoid buttons sticking to edges
    position: 'absolute', // Optional: If you want to fix it to the top or bottom
    top: 0, // Optional: Align to the top
    paddingTop:40
  },
});

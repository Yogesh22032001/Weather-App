import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const imageSource = require('./../../../assets/images/weather.png');

  return (
    <ImageBackground source={imageSource} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => navigation.navigate('SearchScreen')}>
            <IonIcon name="add" size={30} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <IonIcon name="settings-outline" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        <Text style={styles.text}>HomeScreen</Text>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Make sure the container does not interfere with background image
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    paddingTop: 40,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
  },
});

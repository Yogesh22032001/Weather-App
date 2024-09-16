import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherData from '../../api/WeatherDataAPI';
import Swiper from 'react-native-swiper';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const imageSource = require('./../../../assets/images/weather.png');

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const existingData = await AsyncStorage.getItem('weatherData');
        const data = existingData ? JSON.parse(existingData) : [];
        setWeatherData(data);
        const updatedData = [];

        // Fetch weather data for each city-country pair sequentially
        for (const item of data) {
          try {
            const weather = await WeatherData(item.city, item.country);
            updatedData.push({ ...item, weather }); // Add weather data to each item
          } catch {
            updatedData.push({ ...item, weather: null }); // Return null if there's an error
          }
        }
        setWeatherData(updatedData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load data from AsyncStorage:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchStoredData();
  }, []);

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

        {/* <Text style={styles.text}>HomeScreen</Text> */}

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="#007BFF" />}

        {/* Display weather data */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Swiper to show each city's weather data */}
        <Swiper
      style={styles.wrapper}
      showsButtons={true}
      showsPagination={true}
      autoplay={false}
      loop={false}
      dotColor="red"
      activeDotColor="#007BFF"
    >
    
      {weatherData.map((item, index) => (
        <View key={index} style={styles.slide}>
          
          <Text style={styles.dataText}>City: {item.city}</Text>
          <Text style={styles.dataText}>Country: {item.country}</Text>
          {item.weather ? (
            <>
              <Text style={styles.dataText}>
                Temperature: {(item.weather.main.temp - 273.15).toFixed(2)} °C
              </Text>
              <Text style={styles.dataText}>id: {item.weather.weather[0].id}</Text>
              <Text style={styles.dataText}>Weather: {item.weather.weather[0].description}</Text>
            </>
          ) : (
            <Text style={styles.dataText}>Weather data not available</Text>
          )}
        </View>
      ))}
    </Swiper>
      </View>
      {/* <StatusBar style="auto" /> */}
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
    // Ensure the container does not interfere with background image
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    paddingTop: 40,
    zIndex: 1, // Ensure the nav buttons are above other content
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginHorizontal: 10, // Adjust margin to ensure buttons are touching
  },
  wrapper: {
    marginTop: 60,
    height: '80%',
    width: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 10,
    borderRadius: 10,
    margin: 10,
  },
  dataText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
});

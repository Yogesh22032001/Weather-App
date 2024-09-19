import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherDataAPI from '../../api/WeatherDataAPI';

// Import the interfaces from the new file
import { WeatherData } from '../../constants/types'; 

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
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

        for (const item of data) {
          try {
            const weather = await WeatherDataAPI(item.city, item.country);
            updatedData.push({ ...item, weather });
          } catch {
            updatedData.push({ ...item, weather: null });
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

        {loading && <ActivityIndicator size="large" color="#007BFF" />}

        {error && <Text style={styles.errorText}>{error}</Text>}

        <ScrollView 
          horizontal={true} // Enable horizontal scrolling
          pagingEnabled={true} // Make it snap to each city "page"
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {weatherData.map((item, index) => (
            <View key={index} style={styles.pageContainer}>
              <Text style={styles.dataText}>City: {item.city}</Text>
              <Text style={styles.dataText}>Country: {item.country}</Text>
              {item.weather ? (
                <>
                  <Text style={styles.dataText}>
                    Temperature: {(item.weather.main.temp - 273.15).toFixed(2)} °C
                  </Text>
                  <Text style={styles.dataText}>
                    Weather: {item.weather.weather[0].description}
                  </Text>
                </>
              ) : (
                <Text style={styles.dataText}>Weather data not available</Text>
              )}
            </View>
          ))}
        </ScrollView>
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
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    paddingTop: 40,
    zIndex: 1,
  },
  scrollView: {
    marginTop: 100,
  },
  pageContainer: {
    width: Dimensions.get('window').width, // Each page takes up the full width of the screen
    height: Dimensions.get('window').height * 0.7, // Optional: adjust height for proper scrolling feel
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    padding: 20,
    borderRadius: 10,
  },
  dataText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
});

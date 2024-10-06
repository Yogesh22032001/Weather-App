import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ImageBackground, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import WeatherDataAPI from '../../api/WeatherDataAPI';
import { WeatherData } from '../../constants/types';
import { data } from '../../constants/types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [windSpeedUnit, setWindSpeedUnit] = useState('Kilometers per hour');

  const imageSource = require('./../../../assets/images/weather.png');

  useFocusEffect(
    React.useCallback(() => {
      const fetchStoredData = async () => {
        try {
          const existingData = await AsyncStorage.getItem('weatherData');
          // console.warn(existingData)
          const data = existingData ? JSON.parse(existingData) : [];
          const updatedData = [];

          for (const item of data) {
            console.warn(item)
            try {
              const weather = await WeatherDataAPI(item.city, item.country);
              // console.warn("in home screen -- "+weather)
              updatedData.push({ ...item, weather });
            } catch {
              // updatedData.push({ ...item, weather: null });
            }
          }
          // console.warn(updatedData)
          setWeatherData(updatedData);
        } catch (error) {
          console.error('Failed to load data from AsyncStorage:', error);
          setError('Failed to load data');
        } finally {
          setLoading(false);
        }
      };

      const loadUnitsFromStorage = async () => {
        const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
        const savedWindUnit = await AsyncStorage.getItem('windSpeedUnit');
  
        if (savedTempUnit) setTemperatureUnit(savedTempUnit);
        if (savedWindUnit) setWindSpeedUnit(convertWindUnit(savedWindUnit));      
      };

      fetchStoredData();
      loadUnitsFromStorage();

    }, [])
  );

  const convertTemperature = (tempInKelvin: number): number => {
    return temperatureUnit === 'Celsius'
      ? tempInKelvin - 273.15 // Kelvin to Celsius
      : (tempInKelvin - 273.15) * 9 / 5 + 32; // Kelvin to Fahrenheit
  };

  const convertWindSpeed = (speedInKmH: number): number => {
    switch (windSpeedUnit) {
      case 'Meters per second':
        return speedInKmH * 0.27778; // km/h to m/s
      case 'Miles per hour':
        return speedInKmH * 0.621371; // km/h to mph
      case 'Knots':
        return speedInKmH * 0.539957; // km/h to knots
      case 'Kilometers per hour':
      default:
        return speedInKmH;  
    }
  };
  const convertWindUnit = (unit) => {
    switch(unit) {
      case 'Meters per second':
        return 'm/s';  
      case 'Miles per hour':
        return 'mph'; 
      case 'Knots':
        return 'knots';  
      case 'Kilometers per hour':
        return 'k/m';
      // default:
      //   return 'KmH';
    }
  }

  function capitalizationFirstLatter(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const getCountryName = (code:string) => {
    const country = data.find(item2 => item2.value.toUpperCase() === code.trim());
    console.warn("country ==="+country.label)
     return country ? country.label : 'Country not found';
  };

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
          horizontal={true} 
          pagingEnabled={true} 
          showsHorizontalScrollIndicator={false}
          style={styles.scrollView}
        >
          {weatherData.map((item, index) => (
            <View key={index} style={styles.pageContainer}>
              <Text style={[styles.dataText,{fontSize:23}]}>{capitalizationFirstLatter(item.weather.name)}</Text>
              <Text style={styles.dataText}>Country: {getCountryName(item.weather.sys.country)}</Text>
              {item.weather ? (
                <>
                  <Text style={[styles.dataText,{fontSize:30}]}>
                   {convertTemperature(item.weather.main.temp).toFixed(2)} °{temperatureUnit === 'Celsius' ? 'C' : 'F'}
                  </Text>
                  <Text style={styles.dataText}>
                    Weather: {item.weather.weather[0].description}
                  </Text>
                  <Text style={styles.dataText}>
                    Wind Speed: {convertWindSpeed(item.weather.wind.speed).toFixed(2)} {windSpeedUnit}
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
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.7,
    // justifyContent: 'center',
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

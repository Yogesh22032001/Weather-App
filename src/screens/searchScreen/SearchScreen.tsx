import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SearchBar from '../../components/searchBar/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React,{ useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import WeatherDataAPI from '../../api/WeatherDataAPI';
import { WeatherData } from '../../constants/types';

export default function SearchScreen() {

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<{ city: string, country: string }[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');

  const reloadWeatherData = async () => {
    setLoading(true);
    try {
      const existingData = await AsyncStorage.getItem('weatherData');
      const data = existingData ? JSON.parse(existingData) : [];
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
    } catch (error) {
      console.error('Failed to load data from AsyncStorage:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // const fetchStoredData = async () => {
      //   try {
      //     const existingData = await AsyncStorage.getItem('weatherData');
      //     // console.warn(existingData)
      //     const data = existingData ? JSON.parse(existingData) : [];
      //     const updatedData = [];

      //     for (const item of data) {
      //       try {
      //         const weather = await WeatherDataAPI(item.city, item.country);
      //         // console.warn(weather)
      //         updatedData.push({ ...item, weather });
              
      //       } catch {
      //         updatedData.push({ ...item, weather: null });
      //       }
      //     }
      //     setWeatherData(updatedData);
      //   } catch (error) {
      //     console.error('Failed to load data from AsyncStorage:', error);
      //     setError('Failed to load data');
      //   } finally {
      //     setLoading(false);
      //   }
      // };

      const fetchStoredData = async () => {
        await reloadWeatherData(); // Fetch stored data and reload
      };

      const loadUnitsFromStorage = async () => {
        const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
        if (savedTempUnit) setTemperatureUnit(savedTempUnit);    
      };

      fetchStoredData();
      loadUnitsFromStorage();

    }, [SearchBar])
  );

  const convertTemperature = (tempInKelvin: number): number => {
    return temperatureUnit === 'Celsius'
      ? tempInKelvin - 273.15 // Kelvin to Celsius
      : (tempInKelvin - 273.15) * 9 / 5 + 32; // Kelvin to Fahrenheit
  };

  function handleLongPress(city: string, country: string) {
    let exists = false;
    for (const item of selectedCities) {
      if (item.city === city && item.country === country) {
        exists = true;
        break;
      }
    }

    if (exists) {
      setSelectedCities((prevSelected) =>
        prevSelected.filter(item => !(item.city === city && item.country === country))  // Deselect if already selected
      );
    } else {
      setSelectedCities([...selectedCities, { city, country }]);  // Select if not selected
    }
    console.warn(selectedCities);

  }

  const handleDelete = async () => {
    const filteredData = weatherData.filter(
      (item) => !selectedCities.some(selected => selected.city === item.city && selected.country === item.country)
    );

    setWeatherData(filteredData);

    try {
      await AsyncStorage.setItem('weatherData', JSON.stringify(filteredData));
      setSelectedCities([]);  // Clear selections after deletion
      Alert.alert('Success', 'Selected cities have been deleted.');
    } catch (error) {
      console.error('Failed to delete data from AsyncStorage:', error);
      Alert.alert('Error', 'Failed to delete cities.');
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Weather Search</Text>

      <View style={{ height: '28%',marginBottom:30 }}>
        <SearchBar />
      </View>
      <ScrollView>

        {
          weatherData.map((item) => {
            const isSelected = selectedCities.some(
              (selected) => selected.city === item.city && selected.country === item.country
            );

            return (
              <TouchableOpacity key={`${item.city}-${item.country}`} onLongPress={() => handleLongPress(item.city, item.country)}>
                <View style={[styles.cityContainer, isSelected && styles.selectedCity]}>

                  <View style={{ flex: 1 }}>
                    <Text style={{ flex: 1 }}>{item.city}</Text>
                    <Text>{(item.weather?.wind.speed)}</Text>
                  </View>
                  <Text> {convertTemperature(item.weather.main.temp).toFixed(2)} °{temperatureUnit === 'Celsius' ? 'C' : 'F'}</Text>
                </View>
              </TouchableOpacity>

            )
          })
        }

      </ScrollView>
      {selectedCities.length > 0 && <TouchableOpacity onPress={() => handleDelete()}>
        <Text  style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    // alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'left',
  },
  WeatherDataContainer: {
    flexDirection: 'row',
  },
  cityContainer: {
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "red",
    margin: 3,
    padding: 10,
    // flex: 1,
    // position: 'absolute',
    width: '99%',
    // height: '100%',
  },
  selectedCity: {
    backgroundColor: 'lightblue',
    borderColor: 'blue'
  },
  deleteButton: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    margin: 10,
    backgroundColor:'lightgreen'
  }
});

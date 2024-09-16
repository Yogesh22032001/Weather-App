import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import WeatherData from '../../api/WeatherDataAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchBar() {
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const data = await WeatherData(city, country);
      setWeather(data); // Set weather data
      saveDataToStorage(city,country);
    } catch (err) {
      setError('Could not fetch weather data');
    } finally {
      setLoading(false);
    }
  };


  const saveDataToStorage = async (city, country) => {
    try {
      // Retrieve existing data
      const existingData = await AsyncStorage.getItem('weatherData');
      const data = existingData ? JSON.parse(existingData) : [];
      
      // Check for duplicates
      const isDuplicate = data.some(item => item.city === city && item.country === country);
      
      if (isDuplicate) {
        console.log('City and Country pair already exists in AsyncStorage');
        return; // Exit if duplicate found
      }
      
      // Add new city and country pair to the array
      data.push({ city, country });
      
      // Save updated data back to AsyncStorage
      await AsyncStorage.setItem('weatherData', JSON.stringify(data));
      console.log('City and Country saved to AsyncStorage');
    } catch (error) {
      console.error('Failed to save data to AsyncStorage:', error);
    }
  };

  return (
    <View style={styles.container}>
      
      
      {/* Input for City */}
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />
      
      {/* Input for Country */}
      <TextInput
        style={styles.input}
        placeholder="Enter Country"
        value={country}
        onChangeText={setCountry}
      />
      
      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {/* Display weather data */}
      {weather && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>City: {weather.name}</Text>
          <Text style={styles.resultText}>
            Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C
          </Text>
          <Text style={styles.resultText}>Weather: {weather.weather[0].description}</Text>
        </View>
      )}

      {/* Display error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  input: {
    height: 40,
    width:330,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 18,
    marginBottom: 10,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    marginBottom: 10,
  },
});

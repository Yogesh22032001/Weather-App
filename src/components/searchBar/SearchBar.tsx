import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import WeatherData from '../../api/WeatherDataAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { data } from '../../constants/types';

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
        return; 
      }
      
      
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

      <Dropdown
      style={styles.input}
      data={data}
      labelField="label"
      valueField="value"
      search
       placeholder="Select Country"
      searchPlaceholder="Search..."
      value={country}
      onChange={item => {
        setCountry(item.value);
      }}
      />
      
       {/* Input for Country */}
       {/* <TextInput
        style={styles.input}
        placeholder="Enter Country"
        value={country}
        onChangeText={setCountry}
      /> */}
      
      {/* Input for City */}
      <TextInput
        style={styles.input}
        placeholder="Enter City"
        value={city}
        onChangeText={setCity}
      />
      
     
      
      {/* Search Button */}
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {/* Loading Spinner */}
      {loading && <ActivityIndicator size="large" color="#007BFF" />}

      {/* Display weather data */}
      {/* {weather && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>City: {weather.name}</Text>
          <Text style={styles.resultText}>
            Temperature: {(weather.main.temp - 273.15).toFixed(2)} °C
          </Text>
          <Text style={styles.resultText}>Weather: {weather.weather[0].description}</Text>
        </View>
      )} */}

      {/* Display error message */}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#d1e5f4',
    height:'20%',

  },
  input: {
    height: 40,
    width:330,
    borderColor: 'red',
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

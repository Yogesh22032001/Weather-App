import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, ActivityIndicator } from 'react-native';
// import SearchBar from '../../components/searchBar/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import WeatherDataAPI from '../../api/WeatherDataAPI';
import { WeatherData } from '../../constants/types';
import { Dropdown } from 'react-native-element-dropdown';
import { data } from '../../constants/types';

export default function SearchScreen() {

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCities, setSelectedCities] = useState<{ city: string, country: string }[]>([]);
  const [temperatureUnit, setTemperatureUnit] = useState('Celsius');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

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
      const fetchStoredData = async () => {
        await reloadWeatherData(); // Fetch stored data and reload
      };
  
      const loadUnitsFromStorage = async () => {
        const savedTempUnit = await AsyncStorage.getItem('temperatureUnit');
        if (savedTempUnit) setTemperatureUnit(savedTempUnit);
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
  
  const [weather, setWeather] = useState(null);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);


  // useEffect(() => {
  //   reloadWeatherData();
  //   renderCityList();
  // }, [weather]);



  const handleSearch = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const data = await WeatherDataAPI(city, country);
      const newEntry = { city, country, weather: data };
      setWeatherData(prevData => [...prevData, newEntry]); 
  
      await saveDataToStorage(city, country);
      setCity(''); 
      setCountry('');
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

  const renderCityList = () => {
    return weatherData.map((item) => {
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
      );
    });
  };


  return (
    <View style={styles.container}>

      <Text style={styles.title}>Weather Search</Text>

      {/* <View style={{ height: '28%',marginBottom:30 }}>
        <SearchBar />
      </View> */}


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

      {error && <Text style={styles.errorText}>{error}</Text>}

      <ScrollView>{renderCityList()}</ScrollView>

      {selectedCities.length > 0 && <TouchableOpacity onPress={() => handleDelete()}>
        <Text style={styles.deleteButton}>Delete</Text>
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
    backgroundColor: 'lightgreen'
  },

  input: {
    height: 40,
    width: 382,
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
    margin:2
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

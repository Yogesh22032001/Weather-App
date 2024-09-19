import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import SearchBar from '../../components/searchBar/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import WeatherDataAPI from '../../api/WeatherDataAPI';
import { WeatherData } from '../../constants/types';

export default function SearchScreen () {

  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect ( () => {
  //   const getWeatherData = async() =>{
  //     const data = await AsyncStorage.getItem('weatherData');
  //     // const data = data ? JSON.parse(data) : [];   
  //     if(data ==null){
  //       console.error('Failed to get data from AsyncStorage:');
  //       Alert.alert('Failed to get data from AsyncStorage:');
  //     }else{
  //       setWeatherData(JSON.parse(data));
  //     }
  //   }
  // },[])

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
    <View style={styles.container}>
      
      <Text style={styles.title}>Weather Search</Text>

      <View style={{height:'30%'}}>
      <SearchBar />
      </View>
      <ScrollView>
        
        <Text>aaa</Text>

        {
          weatherData.map((item) =>(
            <View style={styles.cityContainer}>
              <View>
              <Text>{item.city}</Text>
              <Text>{(item.weather?.wind.speed)}</Text>
              </View>
              <Text> {(item.weather?.main.temp - 273.15).toFixed(2)} °C</Text>
            </View>
          ))
        }

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
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
    flexDirection:'row',
  },
  cityContainer: {
    flexDirection:'row',
    borderRadius:5,
    borderWidth:1,
    borderColor:"red",
    margin:3,
    padding:8,
    flex:1,
    // width:'100%'
  }
});

import { StatusBar } from 'expo-status-bar';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import SearchBar from '../../components/searchBar/SearchBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export default function SearchScreen () {

  const[weatherData, setWeatherData] =useState([]);

  useEffect ( () => {
    const getWeatherData = async() =>{
      const data = await AsyncStorage.getItem('weatherData');
      // const data = data ? JSON.parse(data) : [];   
      if(data ==null){
        console.error('Failed to get data from AsyncStorage:');
        Alert.alert('Failed to get data from AsyncStorage:');
      }else{
        setWeatherData(JSON.parse(data));
      }
    }
  },[])

  const cityWeatherData = () => {
    return (
      <View style ={styles.WeatherDataContainer}>

      </View>
    )
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Weather Search</Text>
        <SearchBar />
        <Text>aaa</Text>
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
  }
});

import axios from 'axios';

export default async function WeatherData(city: string, country: string) {
  try {
    const API_KEY = '86f32f6fa152b96a81120556e1e68289';
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${API_KEY}`
    );
    console.warn("in api - " + JSON.stringify(response.data));

    return response.data; // Return the actual data from the API response
  } catch (err) {
    console.warn(err);
    throw new Error('Could not fetch weather data');
  }
}

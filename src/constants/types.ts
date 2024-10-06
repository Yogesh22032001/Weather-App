export interface Weather {
    id: number;
    main: string;
    description: string;
    icon: string;
  }
  
  export interface Main {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  }
  
  export interface Wind {
    speed: number;
    deg: number;
    gust: number;
  }
  
  export interface Clouds {
    all: number;
  }
  
  export interface Sys {
    type?: number;  // Optional since some cities might not have 'type' and 'id'
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  }
  
  export interface CityWeather {
    coord: {
      lon: number;
      lat: number;
    };
    weather: Weather[];
    base: string;
    main: Main;
    visibility: number;
    wind: Wind;
    clouds: Clouds;
    dt: number;
    sys: Sys;
    timezone: number;
    id: number;
    name: string;
    cod: number;
  }
  
  export interface WeatherData {
    city: string;
    country: string;
    weather: CityWeather;
  }
  
interface CountryData {
  label: string;  
  value: string; 
}

export const data: CountryData[] = [
  { label: 'Albania', value: 'AL' },
  { label: 'South Africa', value: 'ZA' },
  { label: 'Saudi Arabia', value: 'SA' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Basque Country', value: 'ES' }, // Basque is a region in Spain
  { label: 'Belarus', value: 'BY' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Catalonia', value: 'ES' }, // Catalonia is a region in Spain
  { label: 'China (Simplified)', value: 'CN' },
  { label: 'China (Traditional)', value: 'TW' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Czech Republic', value: 'CZ' },
  { label: 'Denmark', value: 'DK' },
  { label: 'Netherlands', value: 'NL' },
  { label: 'United Kingdom', value: 'GB' }, // Or 'UK'
  { label: 'Finland', value: 'FI' },
  { label: 'France', value: 'FR' },
  { label: 'Galicia', value: 'ES' }, // Galicia is a region in Spain
  { label: 'Germany', value: 'DE' },
  { label: 'Greece', value: 'GR' },
  { label: 'Israel', value: 'IL' },
  { label: 'India', value: 'IN' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Italy', value: 'IT' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
  { label: 'Kurdistan', value: 'IQ' }, // Kurdish region in Iraq
  { label: 'Latvia', value: 'LV' },
  { label: 'Lithuania', value: 'LT' },
  { label: 'North Macedonia', value: 'MK' },
  { label: 'Norway', value: 'NO' },
  { label: 'Iran', value: 'IR' }, // Farsi is spoken in Iran
  { label: 'Poland', value: 'PL' },
  { label: 'Portugal', value: 'PT' },
  { label: 'Brazil', value: 'BR' }, // Brazilian Portuguese
  { label: 'Romania', value: 'RO' },
  { label: 'Russia', value: 'RU' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Spain', value: 'ES' },
  { label: 'Sweden', value: 'SE' },
  { label: 'Thailand', value: 'TH' },
  { label: 'Turkey', value: 'TR' },
  { label: 'Ukraine', value: 'UA' },
  { label: 'Vietnam', value: 'VN' },
  { label: 'South Africa (Zulu)', value: 'ZA' }
];

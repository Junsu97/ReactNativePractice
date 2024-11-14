import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, Text, View, ActivityIndicator, Image } from 'react-native';
import * as Location from 'expo-location';
import { Day } from './types';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = 'dcd5a0fe977515706a46c2eb5476784b';
const icons : {[key: string]: "cloudy" | "day-sunny" | "cloudy-gusts" | "snow" | "rains" | "rain" | "lightning"} = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}

const getIconName = (weather: string): "cloudy" | "day-sunny" | "cloudy-gusts" | "snow" | "rains" | "rain" | "lightning"  => {
  return icons[weather] || "default";
}


export default function App() {
  // state 
  const [city, setCity] = useState<string | null>('Loading...');
  const [days, setDays] = useState<Day[]>([]);
  const [ok, setOk] = useState(true);


  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric&lang=kr`);
    const json = await response.json();
    setDays(json.daily);
  }

  // Effect
  useEffect(() => {
    getWeather();
  }, []);

  // render
  return (
    <View style={styles.container}>
      <StatusBar style='dark' />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.weather}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      // indicatorStyle={"white"}
      >
        {days.length === 0 ? <View style={styles.day}><ActivityIndicator style={{ marginTop: 10 }} color={'white'} /></View>
          : (
            days.map((day, index) =>
              <View key={index} style={styles.day}>
                {/* <Image style={styles.weatherIcon} source={{uri: `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}}/> */}
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"90%"}}>
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto style={{marginRight:15}} name={getIconName(day.weather[0].main)} size={100} color="white" />
                  
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            )
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    color: "white",
    fontSize: 68,
    fontWeight: "500"
  },
  weather: {

  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "flex-start",
    marginLeft: 15
  },
  temp: {
    color: "white",
    fontSize: 128,
  },
  description: {
    color: "white",
    marginTop: -10,
    fontSize: 40,
  },
  tinyText: {
    color: "white",
    fontSize: 20,
  },
  weatherIcon: {
    marginTop: 10,
    width: 300,
    height: 300,
  },
})
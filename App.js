import React, { useEffect, useState } from 'react';
import * as Location from "expo-location";
import { Text, View, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons';
import Constants from 'expo-constants';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const API_KEY = '688d07929ce4506e63cb5e391511a3eb';
const icons = {
  Clouds: 'cloudy',
  Clear: 'day-sunny',
  Atmosphere: 'cloudy-gusts',
  Snow: 'snow',
  Rain: 'rains',
  Drizzle: 'rain',
  Thunderstorm: 'lightning'
};

export default function App() {
  const [city, setCity] = useState();
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    setCity(location[0].city);
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const json = await response.json();
    setDays(json.daily);
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: 'center' }}>
            <ActivityIndicator color="white" style={{ marginTop: 10 }} size="large" />
          </View>
        ) : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}
                >
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={icons[day.weather[0].main]} size={24} color="white" />
                </View>

                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              </View>
            ))
          )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato'
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 58,
    fontWeight: '500',
    color: 'white'
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20
  },
  temp: {
    fontSize: 100,
    marginTop: 50,
    fontWeight: '600',
    color: 'white'
  },
  description: {
    fontSize: 30,
    marginTop: -10,
    color: 'white',
    fontWeight: '500'
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: 'white',
    fontWeight: '500'
  }
});
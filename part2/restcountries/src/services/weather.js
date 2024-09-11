import axios from "axios";
import geoService from "./geo.js";

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "https://api.openweathermap.org/data/2.5/weather";

const getByCoords = (lat, lon) => {
  return axios
    .get(`${baseUrl}?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=imperial`)
    .then((response) => response.data);
}

const getByLocation = (cityName, countryCode) => {
  return geoService
    .getByLocation(cityName, countryCode)
    .then((geo) => getByCoords(geo.lat, geo.lon));
};

export default { getByLocation };
import axios from "axios";

const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = "http://api.openweathermap.org/geo/1.0";

const getByLocation = (cityName, countryCode) => {
  return axios
    .get(`${baseUrl}/direct?q=${cityName},${countryCode}&limit=1&appid=${weatherApiKey}`)
    .then((response) => response.data[0]);
}

export default { getByLocation };
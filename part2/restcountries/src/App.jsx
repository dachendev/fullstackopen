import { useState, useEffect } from "react";
import countryService from "./services/countries.js";
import weatherService from "./services/weather.js";

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>
};

const WeatherInfo = ({ data }) => {
  if (!data) {
    return null;
  }

  console.log(data);

  return (
    <div>
      <h2>Weather in {data.name}</h2>
      <div>temperature {data.main.temp} Fahrenheit</div>
      <img src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`} />
      <div>wind {data.wind.speed} miles/hour</div>
    </div>
  );
}

const CountryInfo = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    weatherService
      .getByLocation(country.capital[0], country.cca2)
      .then((data) => setWeatherData(data));
  }, [country]);

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => <li key={code}>{name}</li>)}
      </ul>
      <img src={country.flags.png} height={100} />
      <WeatherInfo data={weatherData} />
    </div>
  )
};

const ResultsLine = ({ country, handleShowClicked }) => {
  return (
    <div>{country.name.common} <Button text="show" handleClick={() => handleShowClicked()} /></div>
  );
};

const FilterResults = ({ countries, setShow }) => {
  const createHandleShowClicked = (country) => () => setShow(country);

  if (countries === null || !countries.length) {
    return null;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <CountryInfo country={countries[0]} />;
  }

  return (
    <div>
      {countries.map(country =>
        <ResultsLine
          key={country.cca2}
          country={country}
          handleShowClicked={createHandleShowClicked(country)}
        />
      )}
    </div>
  );
}

const Filter = ({ value, handleChange }) => {
  return (
    <div>
      find countries <input value={value} onChange={handleChange} />
    </div>
  );
};

const App = () => {
  const [countries, setCountries] = useState(null);
  const [filter, setFilter] = useState("");
  const [show, setShow] = useState(null);

  useEffect(() => {
    countryService
      .getAll()
      .then((countries) => setCountries(countries));
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setShow(null);
  };

  const getCountriesToShow = () => {
    if (!countries) {
      return null;
    }

    if (show) {
      return [show];
    }

    if (filter) {
      return countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()));
    }

    // if no filter is set, display nothing
    return [];
  };

  return (
    <div>
      <Filter value={filter} handleChange={handleFilterChange} />
      <FilterResults countries={getCountriesToShow()} setShow={setShow} />
    </div>
  )
}

export default App;
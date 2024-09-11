import { useState, useEffect } from "react";
import countryService from "./services/countries.js";

const DisplayCountries = ({ countries }) => {
  if (!countries.length) {
    return null;
  }

  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => <div key={country.cca2}>{country.name.common}</div>)}
      </div>
    );
  }

  const country = countries[0];

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([code, name]) => <li key={code}>{name}</li>)}
      </ul>
      <img src={country.flags.png} height={200} />
    </div>
  )
}

const App = () => {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    countryService
      .getAll()
      .then((countries) => setCountries(countries));
  }, []);

  const countriesToShow = !query
    ? []
    : countries.filter(c => c.name.common.toLowerCase().includes(query.toLowerCase()));

  console.log(countriesToShow);

  return (
    <div>
      find countries <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <DisplayCountries countries={countriesToShow} />
    </div>
  )
}

export default App
import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api'

const formatCountryData = (country) => ({
  name: country.name.common,
  capital: country.capital[0],
  population: country.population,
  flag: country.flags.png
})

const getByName = async (name) => {
  try {
    const response = await axios.get(`${baseUrl}/name/${name}`)
    
    return {
      found: true,
      data: formatCountryData(response.data)
    }
  } catch (error) {
    return {
      found: false
    }
  }
}

export default {
  getByName,
}
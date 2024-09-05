import { useState, useEffect } from 'react'
import axios from "axios";
import Phonebook from './Phonebook.jsx';

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  
  return (
    <div>
      <Phonebook persons={persons} setPersons={setPersons} />
    </div>
  )
}

export default App
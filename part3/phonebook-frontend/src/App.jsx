import { useState, useEffect } from 'react'
import axios from "axios";
import personService from "./services/persons.js";
import "./index.css";

const SearchFilter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} />
    </div>
  )
};

const AddPersonForm = ({ addPerson, newName, setNewName, newNumber, setNewNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={e => setNewName(e.target.value)} />
      </div>
      <div>
        number: <input value={newNumber} onChange={e => setNewNumber(e.target.value)} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
};

const NumbersLine = ({ person, removePerson }) => {
  return (
    <div>
      {person.name} {person.number} <button onClick={removePerson(person)}>delete</button>
    </div>
  )
};

const Numbers = ({ persons, removePerson }) => {
  if (!persons || !Array.isArray(persons)) {
    return null;
  }

  return (
    <div>
      {persons.map(person => <NumbersLine key={person.id} person={person} removePerson={removePerson} />)}
    </div>
  );
};

const Notification = ({ type, message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={type}>
      {message}
    </div>
  )
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll()
      .then((returnedPersons) => setPersons(returnedPersons));
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const found = persons.findIndex(p => p.name === newName);
    if (found > 0) {
      const confirmOk = window.confirm(`${persons[found].name} is already added to phonebook, replace old number with a new one?`);
      if (confirmOk) {
        personService
          .update(persons[found].id, { ...persons[found], number: newNumber })
          .then((updatedPerson) => {
            const personsCopy = [...persons];
            personsCopy[found] = updatedPerson;
            setPersons(personsCopy);
            setNewName("");
            setNewNumber("");
            setSuccessMessage(`Updated ${updatedPerson.name}`);
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch((error) => {
            setErrorMessage(`Information of ${persons[found].name} has already been removed from the server`);
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(persons.filter(p => p.id !== persons[found].id));
          });
      }

      return;
    }

    const newPerson = {
      name: newName,
      number: newNumber,
    };

    personService.create(newPerson)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`Added ${returnedPerson.name}`);
        setTimeout(() => setSuccessMessage(null), 5000);
      })
      .catch((error) => {
        setErrorMessage(error.response.data.error);
        setTimeout(() => setErrorMessage(null), 5000);
      });
  }

  const removePerson = (person) => () => {
    const result = window.confirm(`Delete ${person.name}?`);
    if (result) {
      personService.remove(person.id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== person.id));
          setSuccessMessage(`Removed ${person.name}`);
          setTimeout(() => setSuccessMessage(null), 5000);
        });
    }
  };

  const personsToShow = !filter ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type="success" message={successMessage} />
      <Notification type="error" message={errorMessage} />
      <SearchFilter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <AddPersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Numbers persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
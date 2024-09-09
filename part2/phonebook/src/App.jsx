import { useState, useEffect } from 'react'
import axios from "axios";
import personService from "./services/persons.js";

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
  return (
    <div>
      {persons.map(person => <NumbersLine key={person.id} person={person} removePerson={removePerson} />)}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [filter, setFilter] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  useEffect(() => {
    personService.getAll()
      .then((returnedPersons) => setPersons(returnedPersons));
  }, [])

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = {
      name: newName,
      number: newNumber,
    };

    personService.create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
  }

  const removePerson = ({ name, id }) => () => {
    const result = window.confirm(`Delete ${name}?`);
    if (result) {
      personService.remove(id)
        .then(() => setPersons(persons.filter(p => p.id !== id)));
    }
  };

  const personsToShow = !filter ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));
  
  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <AddPersonForm addPerson={addPerson} newName={newName} setNewName={setNewName} newNumber={newNumber} setNewNumber={setNewNumber} />
      <h2>Numbers</h2>
      <Numbers persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
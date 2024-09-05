import { useState } from 'react'

const SearchFilter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={e => setFilter(e.target.value)} />
    </div>
  )
};

const AddPersonForm = ({ addPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    addPerson(newName, newNumber);
  }

  return (
    <form onSubmit={handleSubmit}>
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

const NumbersLine = ({ person }) => {
  return (
    <p>{person.name} {person.number}</p>
  )
};

const Numbers = ({ persons }) => {
  return (
    <div>
      {persons.map(person => <NumbersLine key={person.id} person={person} />)}
    </div>
  );
};

const Phonebook = ({ persons, setPersons }) => {
  const [filter, setFilter] = useState("");

  const addPerson = (name, number) => {
    if (persons.some(p => p.name === name)) {
      alert(`${name} is already added to phonebook`)
      return;
    }

    const newPerson = {
      name,
      number,
      id: persons.length + 1,
    };
    setPersons(persons.concat(newPerson));
  }

  const personsToShow = !filter ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <AddPersonForm addPerson={addPerson} />
      <h2>Numbers</h2>
      <Numbers persons={personsToShow} />
    </div>
  )
};

export default Phonebook;
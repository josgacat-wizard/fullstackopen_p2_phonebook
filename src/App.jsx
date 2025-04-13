import { useState, useEffect } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showFiltered, setShowFiltered] = useState("");

  useEffect(() => {
    // console.log("effect");
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  // console.log("render", persons.length, "persons");

  const addPerson = (event) => {
    event.preventDefault();
    // console.log("button clicked", event.target);
    const personObject = {
      name: newName,
      number: newNumber,
      // id: persons.length + 1,
    };

    if (persons.find((person) => person.name === personObject.name)) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one`
        )
      ) {
        const personFound = persons.find(
          (person) => person.name === personObject.name
        );
        personService
          .update(personFound.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== personFound.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          });
      } else {
        setNewName("");
        setNewNumber("");
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
      });
    }
  };

  const handleNameChange = (event) => {
    // console.log(event.target.value);
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    // console.log(event.target.value);
    setNewNumber(event.target.value);
  };

  const handleFilteredChange = (event) => {
    // console.log(event.target.value);
    setShowFiltered(event.target.value);
  };

  const handleDeleteOf = (id) => {
    if (window.confirm("Do you really want to delete?")) {
      personService.deletePerson(id).then((response) => {
        alert(`Person with ID ${id} were deleted from database`);
        setPersons(persons.filter((n) => n.id !== id));
      });
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={showFiltered} onChange={handleFilteredChange} />
      <h3>add a new</h3>
      <PersonForm
        onSubmit={addPerson}
        nameValue={newName}
        nameOnChange={handleNameChange}
        numberValue={newNumber}
        numberOnChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons
        persons={persons}
        showFiltered={showFiltered}
        handleDelete={handleDeleteOf}
      />
      {/* <div>
        debug: {newName} {newNumber}
      </div> */}
    </div>
  );
};

export default App;

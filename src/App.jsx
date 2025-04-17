import { useState, useEffect } from "react";
import axios from "axios";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showFiltered, setShowFiltered] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
          `${newName} is already added to phonebook, replace the old number with a new one?`
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
            setSuccessMessage(`'${personObject.name}' number updated`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `'${personObject.name}' was already removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((n) => n.id !== personFound.id));
          });
        setNewName("");
        setNewNumber("");
      } else {
        setNewName("");
        setNewNumber("");
      }
    } else {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`'${personObject.name}' added to Phonebook`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
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

  const handleDeleteOf = (id, person) => {
    if (window.confirm("Do you really want to delete?")) {
      personService
        .deletePerson(id)
        .then((response) => {
          alert(`'${person.name}' were deleted from database`);
        })
        .catch((error) => {
          setErrorMessage(`'${person.name}' was already removed from server`);
        });
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
    setPersons(persons.filter((n) => n.id !== id));
  };

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={errorMessage} typeOfNotification={"error"} />
      <Notification message={successMessage} typeOfNotification={"success"} />
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

import Person from "./Person";

const Persons = ({ persons, showFiltered, handleDelete }) => {
  return (
    <>
      {persons
        .filter((person) => {
          if (!showFiltered) return true;
          let showFilteredLower = showFiltered.slice();
          let personNameLower = person.name.slice();
          if (
            personNameLower
              .toLowerCase()
              .startsWith(showFilteredLower.toLowerCase())
          ) {
            return true;
          }
        })
        .map((person) => (
          <Person
            key={person.id}
            person={person}
            handleDelete={() => handleDelete(person.id, person)}
          />
        ))}
    </>
  );
};

export default Persons;

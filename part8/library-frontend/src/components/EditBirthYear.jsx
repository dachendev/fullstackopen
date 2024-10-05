import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

export const EditBirthYear = () => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const onSubmit = (event) => {
    event.preventDefault();

    console.log("edit birth year");

    editAuthor({
      variables: {
        name,
        setBornTo: Number(born),
      },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          name{" "}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          born{" "}
          <input
            type="number"
            value={born}
            onChange={(e) => setBorn(e.target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditBirthYear;

import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import EditBirthYear from "./EditBirthYear";

const Authors = () => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const authors = data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Set birthyear</h3>
      <EditBirthYear />
    </div>
  );
};

export default Authors;

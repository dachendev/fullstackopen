import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import EditBirthYear from "./EditBirthYear";

const Authors = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!props.show) {
    return null;
  }

  const authors = data.allAuthors;

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
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

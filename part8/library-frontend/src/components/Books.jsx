import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS);

  if (loading) return <p>loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const books = data.allBooks;

  return (
    <div>
      <h2>books</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;

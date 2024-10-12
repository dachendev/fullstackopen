import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = () => {
  const { loading, error, data } = useQuery(ALL_BOOKS)
  const [selectedGenre, setSelectedGenre] = useState('')

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const books = data.allBooks
  const genres = [...new Set(books.flatMap((book) => book.genres))]
  const booksByGenre = selectedGenre ? books.filter((book) => book.genres.includes(selectedGenre)) : books

  return (
    <div>
      <h2>books</h2>
      <div>
        in genre:
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="">all genres</option>
          {genres.map((genre) => (
            <option key={genre}>{genre}</option>
          ))}
        </select>
        <button type="button" onClick={() => setSelectedGenre('')}>
          reset
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
        </thead>
        <tbody>
          {booksByGenre.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books

import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'
import BooksTable from './BooksTable'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const allBooksQuery = useQuery(ALL_BOOKS)
  const booksByGenreQuery = useQuery(ALL_BOOKS, {
    variables: { genre: selectedGenre },
    skip: !selectedGenre,
  })

  const loading = allBooksQuery.loading || booksByGenreQuery.loading
  const error = allBooksQuery.error || booksByGenreQuery.error

  if (loading) return <p>loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const genres = [...new Set(allBooksQuery.data.allBooks.flatMap((book) => book.genres))]
  const booksToShow = selectedGenre ? booksByGenreQuery.data.allBooks : allBooksQuery.data.allBooks

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
      <BooksTable books={booksToShow} />
    </div>
  )
}

export default Books

import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES } from '../queries'
import { useState } from 'react'
import BooksTable from './BooksTable'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const { data: genresData, loading: genresLoading, error: genresError } = useQuery(ALL_GENRES)
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS, { variables: { genre: selectedGenre || null }, fetchPolicy: 'network-only' })

  if (genresLoading || booksLoading) return <div>loading...</div>
  if (genresError || booksError) return <div>Error: {genresError?.message || booksError?.message}</div>

  const genres = genresData?.allGenres || []
  const books = booksData?.allBooks || []

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
      <BooksTable books={books} />
    </div>
  )
}

export default Books

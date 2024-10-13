import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from '../queries'
import { useState } from 'react'
import BooksTable from './BooksTable'
import { useSubscription } from '@apollo/client'

const updateCache = (cache, options, addedBook) => {
  const uniqueByTitle = (items) => {
    const seen = new Set()
    return items.filter((item) => (seen.has(item.title) ? false : seen.add(item.title)))
  }

  cache.updateQuery(options, ({ allBooks }) => ({
    allBooks: uniqueByTitle(allBooks.concat(addedBook)),
  }))
}

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('')
  const { data: genresData, loading: genresLoading, error: genresError } = useQuery(ALL_GENRES)
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS, { variables: { genre: selectedGenre || null }, fetchPolicy: 'cache-and-network' })

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      alert(`Added book: ${addedBook.title}`)
      updateCache(client.cache, { query: ALL_BOOKS, variables: { genre: selectedGenre || null } }, addedBook)
    },
  })

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

import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Recommended = () => {
  const meQuery = useQuery(ME)
  const allBooksQuery = useQuery(ALL_BOOKS, {
    variables: { genre: meQuery.data?.me.favoriteGenre },
    skip: meQuery.loading,
  })

  const error = meQuery.error || allBooksQuery.error
  const loading = meQuery.loading || allBooksQuery.loading

  if (loading) return <div>loading...</div>
  if (error) return <div>error: {error}</div>

  const currentUser = meQuery.data.me
  const allBooks = allBooksQuery.data.allBooks

  return (
    <div>
      <h2>recommended</h2>
      <p>
        books in your favorite genre <strong>{currentUser.favoriteGenre}</strong>
      </p>
      <BooksTable books={allBooks} />
    </div>
  )
}

export default Recommended

import { useQuery } from '@apollo/client'
import { ALL_BOOKS, ME } from '../queries'
import BooksTable from './BooksTable'

const Recommended = () => {
  const { data: meData, loading: meLoading, error: meError } = useQuery(ME)
  const {
    data: booksData,
    loading: booksLoading,
    error: booksError,
  } = useQuery(ALL_BOOKS, {
    variables: { genre: meData?.me.favoriteGenre },
    skip: meData?.loading,
    fetchPolicy: 'network-only',
  })

  if (meLoading || booksLoading) return <div>loading...</div>
  if (meError || booksError) return <div>Error: {meError?.message || booksError?.message}</div>

  const currentUser = meData.me
  const books = booksData.allBooks

  return (
    <div>
      <h2>recommended</h2>
      <p>
        books in your favorite genre <strong>{currentUser.favoriteGenre}</strong>
      </p>
      <BooksTable books={books} />
    </div>
  )
}

export default Recommended

import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, CREATE_BOOK } from '../queries'

const NewBook = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [published, setPublished] = useState('')
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    console.log('add book...')

    createBook({
      variables: {
        title,
        author,
        published: Number(published),
        genres,
      },
    })

    setTitle('')
    setPublished('')
    setAuthor('')
    setGenres([])
    setGenre('')
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }

  return (
    <div>
      <h2>add book</h2>
      <form onSubmit={submit}>
        <div>
          title
          <input type="text" value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input type="text" value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          published
          <input type="number" value={published} onChange={({ target }) => setPublished(target.value)} />
        </div>
        <div>
          <input type="text" value={genre} onChange={({ target }) => setGenre(target.value)} />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook

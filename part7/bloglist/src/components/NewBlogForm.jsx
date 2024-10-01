import { useState } from 'react'

const NewBlogForm = ({ addBlog, cancelAddBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    addBlog(blogObject)

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  const handleCancel = () => cancelAddBlog()

  return (
    <form onSubmit={handleSubmit}>
      <div>
        title: <input data-testid="title" name="title" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
      </div>
      <div>
        author: <input data-testid="author" name="author" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
      </div>
      <div>
        url: <input data-testid="url" name="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
      </div>
      <button type="submit">create</button>
      <button type="button" onClick={handleCancel}>cancel</button>
    </form>
  )
}

export default NewBlogForm
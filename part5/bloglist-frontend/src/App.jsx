import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const Notification = ({ message, type = "error" }) => {
  if (!message) {
    return null
  }

  return (
    <div className={type}>{message}</div>
  )
}

const Toggleable = forwardRef(({ buttonLabel, children }, refs) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => setVisible(!visible)

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <button onClick={toggleVisibility}>{buttonLabel}</button>
      <div style={visible ? {} : { display: 'none' }}>
        {children}
      </div>
    </div>
  )
})

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const toggleableRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('bloglistUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('bloglistUser', JSON.stringify(user))

      setUsername('')
      setPassword('')
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('bloglistUser')
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    console.log('creating new blog with', newTitle, newAuthor, newUrl)

    try {
      const blog = await blogService.create({
        title: newTitle,
        author: newAuthor,
        url: newUrl
      })

      setBlogs(blogs.concat(blog))

      setNewTitle('')
      setNewAuthor('')
      setNewUrl('')
      toggleableRef.current.toggleVisibility()

      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification message={errorMessage} />
      <Notification message={successMessage} type="success" />
      <form onSubmit={handleLogin}>
        <div>
          username
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          password
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const handleCancel = () => {
    console.log('cancel add blog')
    toggleableRef.current.toggleVisibility()
  }

  const newBlogForm = () => (
    <>
      <Notification message={errorMessage} />
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
        </div>
        <div>
          author:
          <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)} />
        </div>
        <div>
          url:
          <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={handleCancel}>cancel</button>
      </form>
    </>
  )

  if (user === null) {
    return loginForm()
  }

  return (
    <>
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Toggleable buttonLabel="new blog" ref={toggleableRef}>
        {newBlogForm()}
      </Toggleable>
      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}
    </>
  )
}

export default App
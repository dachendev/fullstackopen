import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Toggleable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const Notification = ({ message, type = 'error' }) => {
  if (!message) {
    return null
  }

  return (
    <div className={type}>{message}</div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const toggleableRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const userJSON = window.localStorage.getItem('bloglistUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const logout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('bloglistUser')
  }

  const addBlog = async (blogObject) => {
    console.log('creating new blog', blogObject)

    try {
      const blog = await blogService.create(blogObject)
      console.log('new blog:', blog)

      setBlogs(blogs.concat(blog))

      toggleableRef.current.toggleVisibility()

      setSuccessMessage(`a new blog ${blog.title} by ${blog.author} added`)
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const cancelAddBlog = () => {
    console.log('cancel add blog')
    toggleableRef.current.toggleVisibility()
  }

  const updateLikes = async (blog) => {
    console.log('like button clicked')

    const newObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    try {
      const updatedBlog = await blogService.update(blog.id, newObject)
      const nextBlogs = blogs.map(o => (o.id === updatedBlog.id ? updatedBlog : o))
      setBlogs(nextBlogs)
    } catch (error) {
      console.log(error)
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  const removeBlog = async (id) => {
    console.log('removing blog')

    try {
      await blogService.remove(id)

      const nextBlogs = blogs.filter(o => o.id !== id)
      setBlogs(nextBlogs)

      setSuccessMessage('Removed blog successfuly')
      setTimeout(() => setSuccessMessage(null), 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => setErrorMessage(null), 5000)
    }
  }

  if (user === null) {
    return (
      <>
        <Notification message={errorMessage} />
        <Notification type="success" message={successMessage} />
        <h2>log in to application</h2>
        <LoginForm login={login} />
      </>
    )
  }

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  return (
    <>
      <Notification message={errorMessage} />
      <Notification type="success" message={successMessage} />
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={logout}>logout</button></p>
      <Toggleable buttonLabel="new blog" ref={toggleableRef}>
        <NewBlogForm addBlog={addBlog} cancelAddBlog={cancelAddBlog} />
      </Toggleable>
      {sortedBlogs.map(blog => <Blog key={blog.id} blog={blog} updateLikes={updateLikes} isCreator={user.username === blog.user.username} removeBlog={removeBlog} />)}
    </>
  )
}

export default App
import { useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import { useUserContext } from './contexts/UserContext'
import { useApiService } from './hooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const Login = () => (
  <>
    <h2>log in to application</h2>
    <LoginForm />
  </>
)

const Navbar = ({ user, onLogout }) => {
  const style = {
    background: 'lightgray',
    padding: '0.5rem',
  }

  const linkStyle = {
    padding: '0.5rem',
  }

  return (
    <div style={style}>
      <Link to="/" style={linkStyle}>
        blogs
      </Link>
      <Link to="/users" style={linkStyle}>
        users
      </Link>
      <span>
        {user.name} logged in <button onClick={onLogout}>logout</button>
      </span>
    </div>
  )
}

const Header = () => {
  const [user, userDispatch] = useUserContext()

  if (!user) {
    return null
  }

  const logout = () => {
    userDispatch({ type: 'user/reset' })
  }

  return (
    <div>
      <Navbar user={user} onLogout={logout} />
      <h2>blog app</h2>
    </div>
  )
}

const Home = () => (
  <>
    <NewBlogForm />
    <BlogList />
  </>
)

const Users = ({ users }) => (
  <>
    <h2>Users</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
)

const User = ({ users }) => {
  const id = useParams().id
  const user = users.find((p) => p.id === id)

  if (!user) {
    return <div>Loading data...</div>
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Blog = () => {
  const blogService = useApiService('/api/blogs')
  const id = useParams().id
  const activeUser = useUserContext()[0]
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  // using react-query to demo knowledge,
  // I realize there's better ways to approach this...

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.removeById,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const blog = result.data.find((p) => p.id === id)

  const handleLike = () => {
    console.log('like')

    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    updateBlogMutation.mutate(newBlog)
  }

  const handleRemove = () => {
    console.log('remove')

    removeBlogMutation.mutate(blog.id)
    navigate('/')
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} likes{' '}
        <button type="button" onClick={handleLike}>
          like
        </button>
      </div>
      <div>added by {blog.user.name}</div>
      {blog.user.username === activeUser.username ? (
        <div>
          <button type="button" onClick={handleRemove}>
            remove
          </button>
        </div>
      ) : null}
    </div>
  )
}

const App = () => {
  const [users, setUsers] = useState([])
  const userService = useApiService('/api/users')
  const activeUser = useUserContext()[0]

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  return (
    <Router>
      <Notification />
      <Header />
      <Routes>
        <Route path="/users/:id" element={<User users={users} />} />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blogs/:id" element={<Blog />} />
        <Route path="/" element={activeUser ? <Home /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

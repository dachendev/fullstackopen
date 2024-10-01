import { useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useParams } from 'react-router-dom'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import { useUserContext } from './contexts/UserContext'
import { useApiService } from './hooks'

const Login = () => (
  <>
    <h2>log in to application</h2>
    <LoginForm />
  </>
)

const Header = () => {
  const [user, userDispatch] = useUserContext()

  if (!user) {
    return null
  }

  const logout = () => {
    userDispatch({ type: 'user/reset' })
  }

  const linkStyle = {
    padding: '0.5rem',
  }

  return (
    <div>
      <div>
        <Link to="/" style={linkStyle}>
          blogs
        </Link>
        <Link to="/users" style={linkStyle}>
          users
        </Link>
      </div>
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={logout}>logout</button>
      </p>
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

const App = () => {
  const user = useUserContext()[0]
  const [users, setUsers] = useState([])
  const userService = useApiService('/api/users')

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
        <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

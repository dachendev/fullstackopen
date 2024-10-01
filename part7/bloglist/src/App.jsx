import { useEffect, useState } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
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

const Users = () => {
  const [users, setUsers] = useState([])
  const userService = useApiService('/api/users')

  useEffect(() => {
    userService.getAll().then((users) => setUsers(users))
  }, [])

  return (
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
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

const App = () => {
  const user = useUserContext()[0]

  return (
    <Router>
      <Notification />
      <Header />
      <Routes>
        <Route path="/users" element={<Users />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom'
import { useBlogsQuery } from './api/blogHooks'
import { useGetUsersQuery } from './api/userHooks'
import './App.css'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import { useUserContext } from './contexts/UserContext'

const Navbar = () => {
  const [user, userDispatch] = useUserContext()

  const handleLogout = () => {
    userDispatch({ type: 'user/reset' })
  }

  return (
    <div className="navbar">
      <Link to="/" className="navbar__link">
        blogs
      </Link>
      <Link to="/users" className="navbar__link">
        users
      </Link>
      <span>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </span>
    </div>
  )
}

const Header = () => {
  return (
    <div>
      <Navbar />
      <h2>blog app</h2>
    </div>
  )
}

const LoginPage = () => (
  <>
    <h2>log in to application</h2>
    <LoginForm />
  </>
)

const HomePage = () => (
  <>
    <Header />
    <NewBlogForm />
    <BlogList />
  </>
)

const UsersPage = () => {
  const usersQuery = useGetUsersQuery()

  if (usersQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const users = usersQuery.data

  return (
    <>
      <Header />
      <h2>Users</h2>
      <div>
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
      </div>
    </>
  )
}

const UserPage = () => {
  const id = useParams().id
  const usersQuery = useGetUsersQuery()

  if (usersQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const users = usersQuery.data
  const user = users.find((p) => p.id === id)

  return (
    <>
      <Header />
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <div>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

const BlogPage = () => {
  const id = useParams().id
  const blogsQuery = useBlogsQuery()
  const navigate = useNavigate()

  const onRemove = () => {
    navigate('/')
  }

  if (blogsQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const blog = blogsQuery.data.find((o) => o.id === id)

  return (
    <div>
      <Header />
      <Blog blog={blog} onRemove={onRemove} />
    </div>
  )
}

const App = () => {
  const activeUser = useUserContext()[0]

  return (
    <Router>
      <Notification />
      <Routes>
        <Route path="/blogs/:id" element={<BlogPage />} />
        <Route path="/users/:id" element={<UserPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={activeUser ? <HomePage /> : <Navigate replace to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App

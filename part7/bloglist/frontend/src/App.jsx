import { Card, CardBody, List, ListItem, Typography } from '@material-tailwind/react'
import { useQuery } from '@tanstack/react-query'
import { Link, Navigate, Route, BrowserRouter as Router, Routes, useNavigate, useParams } from 'react-router-dom'
import { useGetUsersQuery } from './api/userHooks'
import './App.css'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import NavbarSimple from './components/NavbarSimple'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import UsersTable from './components/UsersTable'
import { useUserValue } from './contexts/UserContext'
import useResourceService from './hooks/useResourceService'

const Header = () => {
  return (
    <div>
      <NavbarSimple />
      <Typography variant="h2" className="my-6">
        blog app
      </Typography>
    </div>
  )
}

const LoginPage = () => (
  <>
    <Typography variant="h2">log in to application</Typography>
    <Card color="transparent" shadow={false}>
      <LoginForm />
    </Card>
  </>
)

const HomePage = () => {
  return (
    <>
      <Header />
      <div className="mb-3">
        <NewBlogForm />
      </div>
      <BlogList />
    </>
  )
}

const UsersPage = () => {
  return (
    <>
      <Header />
      <Typography variant="h2" className="mb-4">
        users
      </Typography>
      <div>
        <UsersTable />
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

  if (!user) {
    return (
      <>
        <Header />
        <div>user not found</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <Card className="mb-3">
        <CardBody>
          <Typography variant="h2">{user.name}</Typography>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Typography variant="h3" className="mb-3">
            added blogs
          </Typography>
          <List>
            {user.blogs.map((blog) => (
              <Link key={blog.id} to={`/blogs/${blog.id}`} className="text-initial">
                <ListItem>
                  {blog.title} by {blog.author}
                </ListItem>
              </Link>
            ))}
          </List>
        </CardBody>
      </Card>
    </>
  )
}

const BlogPage = () => {
  const id = useParams().id
  const { get } = useResourceService('/api/blogs')
  const navigate = useNavigate()

  const blogQuery = useQuery({
    queryKey: ['blogs', id],
    queryFn: () => get(id),
  })

  const onRemove = () => {
    navigate('/')
  }

  if (blogQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const blog = blogQuery.data

  if (!blog) {
    return (
      <>
        <Header />
        <div>blog not found</div>
      </>
    )
  }

  return (
    <>
      <Header />
      <Blog blog={blog} onRemove={onRemove} />
    </>
  )
}

const AppViews = () => {
  return (
    <Routes>
      <Route path="/blogs/:id" element={<BlogPage />} />
      <Route path="/users/:id" element={<UserPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  )
}

const App = () => {
  const user = useUserValue()

  return (
    <Router>
      <div className="container mx-auto">
        <Notification />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={user ? <AppViews /> : <Navigate replace to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

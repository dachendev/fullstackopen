import { useUserContext } from '../contexts/UserContext'
import BlogList from './BlogList'
import NewBlogForm from './NewBlogForm'
import Notification from './Notification'

const Home = () => {
  const [user, userDispatch] = useUserContext()

  const logout = () => {
    userDispatch({ type: 'user/reset' })
  }

  return (
    <>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={logout}>logout</button>
      </p>
      <NewBlogForm />
      <BlogList />
    </>
  )
}

export default Home

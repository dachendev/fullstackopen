import { useEffect, useRef, useState } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Toggleable from './components/Toggleable'
import { useNotificationContext } from './NotificationContext'
import loginService from './services/login'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBlogs, createBlog, updateBlog, deleteBlog, setToken } from './requests'

const Notification = () => {
  const notification = useNotificationContext()[0]

  if (!notification) {
    return null
  }

  const style = {
    padding: '1rem',
    marginBottom: '1rem',
    border: '2px solid #000',
    borderRadius: '0.25rem',
  }

  return <div style={style}>{notification}</div>
}

const App = () => {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(null)
  const toggleableRef = useRef()
  const notificationDispatch = useNotificationContext()[1]

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    refetchOnWindowFocus: false,
  })

  const newBlogMutation = useMutation({
    mutationFn: createBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: updateBlog,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      const nextBlogs = blogs.map((p) => {
        if (p.id === newBlog.id) {
          return newBlog
        }
        return p
      })
      queryClient.setQueryData(['blogs'], nextBlogs)
    },
  })

  const deleteBlogMutation = useMutation({
    mutationFn: deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

  useEffect(() => {
    const userJSON = window.localStorage.getItem('bloglistUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      setUser(user)
      setToken(user.token)
    }
  }, [])

  const login = async ({ username, password }) => {
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      setToken(user.token)
      window.localStorage.setItem('bloglistUser', JSON.stringify(user))
    } catch (error) {
      notificationDispatch({
        type: 'notification/set',
        payload: error.response.data.error,
      })
      setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    window.localStorage.removeItem('bloglistUser')
  }

  const addBlog = async (newBlog) => {
    console.log('creating new blog', newBlog)

    newBlogMutation.mutate(newBlog, {
      onSuccess: (blog) => {
        notificationDispatch({
          type: 'notification/set',
          payload: `a new blog ${blog.title} by ${blog.author} added`,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
        // close toggleable
        toggleableRef.current.toggleVisibility()
      },
      onError: (error) => {
        notificationDispatch({
          type: 'notification/set',
          payload: error.response.data.error,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
      },
    })
  }

  const cancelAddBlog = () => {
    console.log('cancel add blog')
    toggleableRef.current.toggleVisibility()
  }

  const updateLikes = async (blog) => {
    console.log('like button clicked')

    const newBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }

    updateBlogMutation.mutate(newBlog, {
      onError: (error) => {
        notificationDispatch({
          type: 'notification/set',
          payload: error.response.data.error,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
      },
    })
  }

  const removeBlog = async (id) => {
    console.log('removing blog')

    deleteBlogMutation.mutate(id, {
      onSuccess: () => {
        notificationDispatch({
          type: 'notification/set',
          payload: 'Removed blog successfuly',
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
      },
      onError: (error) => {
        notificationDispatch({
          type: 'notification/set',
          payload: error.response.data.error,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
      },
    })
  }

  if (user === null) {
    return (
      <>
        <Notification />
        <h2>log in to application</h2>
        <LoginForm login={login} />
      </>
    )
  }

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const sortedBlogs = result.data.sort((a, b) => b.likes - a.likes)

  return (
    <>
      <Notification />
      <h2>blogs</h2>
      <p>
        {user.name} logged in <button onClick={logout}>logout</button>
      </p>
      <Toggleable buttonLabel="new blog" ref={toggleableRef}>
        <NewBlogForm addBlog={addBlog} cancelAddBlog={cancelAddBlog} />
      </Toggleable>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          isCreator={user.username === blog.user.username}
          removeBlog={removeBlog}
        />
      ))}
    </>
  )
}

export default App

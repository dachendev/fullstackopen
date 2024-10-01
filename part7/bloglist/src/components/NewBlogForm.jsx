import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef } from 'react'
import { useNotificationContext } from '../contexts/NotificationContext'
import { useApiService, useField } from '../hooks'
import Toggleable from './Toggleable'

const NewBlogForm = () => {
  const toggleableRef = useRef()
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationContext()[1]
  const [titleField, setTitle] = useField('text')
  const [authorField, setAuthor] = useField('text')
  const [urlField, setUrl] = useField('text')
  const blogService = useApiService('/api/blogs')

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      const blogs = queryClient.getQueryData(['blogs'])
      queryClient.setQueryData(['blogs'], blogs.concat(newBlog))
    },
  })

  const addBlog = (event) => {
    event.preventDefault()

    const newBlog = {
      title: titleField.value,
      author: authorField.value,
      url: urlField.value,
    }

    console.log('creating new blog', newBlog)

    newBlogMutation.mutate(newBlog, {
      onSuccess: (blog) => {
        notificationDispatch({
          type: 'notification/set',
          payload: `a new blog ${blog.title} by ${blog.author} added`,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
        // cleanup
        setTitle('')
        setAuthor('')
        setUrl('')
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

  return (
    <Toggleable buttonLabel="new blog" ref={toggleableRef}>
      <form onSubmit={addBlog}>
        <div>
          title: <input data-testid="title" {...titleField} />
        </div>
        <div>
          author: <input data-testid="author" {...authorField} />
        </div>
        <div>
          url: <input data-testid="url" {...urlField} />
        </div>
        <button type="submit">create</button>
        <button type="button" onClick={cancelAddBlog}>
          cancel
        </button>
      </form>
    </Toggleable>
  )
}

export default NewBlogForm

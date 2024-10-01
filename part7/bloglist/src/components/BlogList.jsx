import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationContext } from '../contexts/NotificationContext'
// import { deleteBlog, getBlogs, updateBlog } from '../requests/blogRequests'
import { useUserContext } from '../contexts/UserContext'
import { useApiService } from '../hooks'
import Blog from './Blog'

const BlogList = () => {
  const queryClient = useQueryClient()
  const notificationDispatch = useNotificationContext()[1]
  const user = useUserContext()[0]
  const blogService = useApiService('/api/blogs')

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
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
    mutationFn: blogService.removeById,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
  })

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

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  const sortedBlogs = result.data.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateLikes={updateLikes}
          isCreator={user.username === blog.user.username}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  )
}

export default BlogList

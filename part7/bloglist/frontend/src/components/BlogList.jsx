import { useNotificationContext } from '../contexts/NotificationContext'
// import { deleteBlog, getBlogs, updateBlog } from '../requests/blogRequests'
import { useRemoveBlogMutation, useBlogsQuery, useUpdateBlogMutation } from '../api/blogHooks'
import { useUserContext } from '../contexts/UserContext'
import BlogListItem from './BlogListItem'

const BlogList = () => {
  const notificationDispatch = useNotificationContext()[1]
  const user = useUserContext()[0]

  const blogsQuery = useBlogsQuery()
  const updateBlogMutation = useUpdateBlogMutation()
  const deleteBlogMutation = useRemoveBlogMutation()

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

  if (blogsQuery.isLoading) {
    return <div>Loading data...</div>
  }

  const sortedBlogs = blogsQuery.data.sort((a, b) => b.likes - a.likes)

  return (
    <div>
      {sortedBlogs.map((blog) => (
        <BlogListItem
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

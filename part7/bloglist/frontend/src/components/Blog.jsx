import { useRemoveBlogMutation, useUpdateBlogMutation } from '../api/blogHooks'
import { useUserValue } from '../contexts/UserContext'
import AddCommentForm from './AddCommentForm'

const Blog = ({ blog, onRemove }) => {
  const updateBlogMutation = useUpdateBlogMutation()
  const removeBlogMutation = useRemoveBlogMutation()
  const user = useUserValue()

  const userIsCreator = user.username === blog.user.username

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
    onRemove()
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
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
        {userIsCreator ? (
          <div>
            <button type="button" onClick={handleRemove}>
              remove
            </button>
          </div>
        ) : null}
      </div>
      <div>
        <h3>comments</h3>
        <AddCommentForm blog={blog} />
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment.id}>{comment.content}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Blog

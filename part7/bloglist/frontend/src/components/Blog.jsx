import { Button, Card, CardBody, List, ListItem, Typography } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
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
    const ok = window.confirm(`Are you sure you want to remove ${blog.title}? This action cannot be undone.`)
    if (ok) {
      console.log('remove')
      removeBlogMutation.mutate(blog.id)
      onRemove()
    }
  }

  return (
    <div>
      <Card className="mb-3">
        <CardBody>
          <Typography variant="h2" className="mb-3">
            {blog.title} {blog.author}
          </Typography>
          <div>
            <div className="mb-3">
              <a href={blog.url} target="_blank" rel="noreferrer" className="font-medium text-blue-600 hover:underline">
                {blog.url}
              </a>
            </div>
            <div className="mb-3">
              {blog.likes} likes{' '}
              <Button type="button" onClick={handleLike}>
                like
              </Button>
            </div>
            <div className="mb-3">
              added by{' '}
              <Link to={`/users/${blog.user.id}`} className="font-medium text-blue-600 hover:underline">
                {blog.user.name}
              </Link>
            </div>
            {userIsCreator ? (
              <div className="mb-3">
                <Button type="button" onClick={handleRemove}>
                  remove
                </Button>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Typography variant="h3" className="mb-3">
            comments
          </Typography>
          <div className="mb-3">
            <AddCommentForm blog={blog} />
          </div>
          <List>
            {blog.comments.map((comment) => (
              <ListItem key={comment.id}>{comment.content}</ListItem>
            ))}
          </List>
        </CardBody>
      </Card>
    </div>
  )
}

export default Blog

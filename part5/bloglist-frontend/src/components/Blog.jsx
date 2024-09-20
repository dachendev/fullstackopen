import Toggleable from './Toggleable'

const Blog = ({ blog, updateBlog, removeBlog }) => {
  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleLike = () => {
    console.log('like button clicked')

    const newObject = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    updateBlog(blog.id, newObject)
  }

  const handleRemove = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyles}>
      <Toggleable text={`${blog.title} ${blog.author}`} buttonLabel={'show'} buttonLabelCollapse={'hide'}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
        <div>
          <button onClick={handleRemove}>remove</button>
        </div>
      </Toggleable>
    </div>
  )
}

export default Blog
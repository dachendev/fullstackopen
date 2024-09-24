import Toggleable from './Toggleable'

const Blog = ({ blog, updateLikes, removeBlog }) => {
  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
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
        <div>likes {blog.likes} <button onClick={updateLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <div>
          <button onClick={handleRemove}>remove</button>
        </div>
      </Toggleable>
    </div>
  )
}

export default Blog
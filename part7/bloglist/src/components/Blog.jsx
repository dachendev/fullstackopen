import Toggleable from './Toggleable'

const Blog = ({ blog, updateLikes, isCreator, removeBlog }) => {
  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleUpdateLikes = () => {
    updateLikes(blog)
  }

  const handleRemove = () => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}`)
    if (ok) {
      removeBlog(blog.id)
    }
  }

  return (
    <div className="blog" style={blogStyles}>
      <Toggleable text={`${blog.title} ${blog.author}`} buttonLabel={'show'} buttonLabelCollapse={'hide'}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleUpdateLikes}>like</button></div>
        <div>{blog.user.name}</div>
        {isCreator ? (
          <div>
            <button onClick={handleRemove}>remove</button>
          </div>
        ) : null}
      </Toggleable>
    </div>
  )
}

export default Blog
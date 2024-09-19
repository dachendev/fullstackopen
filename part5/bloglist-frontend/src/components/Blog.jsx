import Toggleable from './Toggleable'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog }) => {
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

  return (
    <div style={blogStyles}>
      <Toggleable text={`${blog.title} ${blog.author}`} buttonLabel={'show'} buttonLabelCollapse={'hide'}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
      </Toggleable>
    </div>
  )
}

export default Blog
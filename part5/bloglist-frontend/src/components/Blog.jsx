import Toggleable from './Toggleable'

const Blog = ({ blog }) => {
  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyles}>
      <Toggleable text={`${blog.title} ${blog.author}`} buttonLabel={'show'} buttonLabelCollapse={'hide'}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button>like</button></div>
        <div>{blog.user.name}</div>
      </Toggleable>
    </div>
  )
}

export default Blog
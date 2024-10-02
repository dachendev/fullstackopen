import { Link } from 'react-router-dom'
// import Toggleable from './Toggleable'

const BlogListItem = ({ blog }) => {
  const blogStyles = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyles}>
      <Link to={`/blogs/${blog.id}`}>
        {blog.title} {blog.author}
      </Link>
    </div>
  )
}

export default BlogListItem

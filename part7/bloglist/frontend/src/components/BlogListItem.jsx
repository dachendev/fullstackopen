import { ListItem } from '@material-tailwind/react'
import { Link } from 'react-router-dom'
// import Toggleable from './Toggleable'

const BlogListItem = ({ blog }) => {
  return (
    <Link to={`/blogs/${blog.id}`}>
      <ListItem>
        {blog.title} by {blog.author}
      </ListItem>
    </Link>
  )
}

export default BlogListItem

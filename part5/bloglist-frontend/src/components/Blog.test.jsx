import { render, screen } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: {
      name: 'Jacob Dachenhaus'
    }
  }

  beforeEach(() => {
    render(<Blog blog={blog} />)
  })

  test('renders title and author, but not url and likes by default', () => {
    expect(screen.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
    expect(screen.getByText(blog.url)).not.toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).not.toBeVisible()
  })
})
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

  test('url and likes are shown after button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
  })
})
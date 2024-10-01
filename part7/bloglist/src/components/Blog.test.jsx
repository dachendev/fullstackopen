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

  const mockUpdateLikes = vi.fn()

  beforeEach(() => {
    render(<Blog blog={blog} updateLikes={mockUpdateLikes} />)
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
    expect(button).toHaveTextContent('hide')
  })

  test('mock for like button called twice', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateLikes.mock.calls).toHaveLength(2)
  })
})
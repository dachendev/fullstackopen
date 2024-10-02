import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

describe('<NewBlogForm />', () => {
  test('calls the event handler recieved as props when new blog created', async () => {
    const user = userEvent.setup()
    const mockAddBlog = vi.fn()
    const { container } = render(<NewBlogForm addBlog={mockAddBlog} />)

    const titleInput = container.querySelector('input[name="title"]')
    const authorInput = container.querySelector('input[name="author"]')
    const urlInput = container.querySelector('input[name="url"]')
    const createButton = screen.getByText('create')

    // interactions
    const blogObject = {
      title: 'Test title',
      author: 'Test author',
      url: 'http://example.com'
    }

    await user.type(titleInput, blogObject.title)
    await user.type(authorInput, blogObject.author)
    await user.type(urlInput, blogObject.url)
    await user.click(createButton)

    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog.mock.calls[0][0]).toEqual(blogObject)
  })
})
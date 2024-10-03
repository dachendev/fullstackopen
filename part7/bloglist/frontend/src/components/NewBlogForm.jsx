import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Input, Typography } from '@material-tailwind/react'
import { useState } from 'react'
import { useCreateBlogMutation } from '../api/blogHooks'
import { useNotificationContext } from '../contexts/NotificationContext'
import useField from '../hooks/useField'

const NewBlogForm = () => {
  const notificationDispatch = useNotificationContext()[1]
  const [titleField, setTitle] = useField('text')
  const [authorField, setAuthor] = useField('text')
  const [urlField, setUrl] = useField('text')
  const [open, setOpen] = useState(false)

  const toggleOpen = () => setOpen(!open)

  const createBlogMutation = useCreateBlogMutation()

  const resetForm = () => {
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const addBlog = (event) => {
    event.preventDefault()

    const newBlog = {
      title: titleField.value,
      author: authorField.value,
      url: urlField.value,
    }

    console.log('creating new blog', newBlog)

    createBlogMutation.mutate(newBlog, {
      onSuccess: (blog) => {
        notificationDispatch({
          type: 'notification/set',
          payload: `a new blog ${blog.title} by ${blog.author} added`,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
        // cleanup
        resetForm()
        toggleOpen()
      },
      onError: (error) => {
        toggleOpen()
        notificationDispatch({
          type: 'notification/set',
          payload: error.response.data.error,
        })
        setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
      },
    })
  }

  const handleCancel = () => {
    console.log('cancel add blog')
    resetForm()
    toggleOpen()
  }

  return (
    <>
      <Button onClick={toggleOpen} variant="gradient">
        create blog
      </Button>
      <Dialog open={open} handler={toggleOpen}>
        <DialogHeader>create blog</DialogHeader>
        <form onSubmit={addBlog}>
          <DialogBody>
            <div className="mb-3">
              <Typography variant="h6" className="mb-3">
                title:
              </Typography>
              <Input data-testid="title" {...titleField} />
            </div>
            <div className="mb-3">
              <Typography variant="h6" className="mb-3">
                author:
              </Typography>
              <Input data-testid="author" {...authorField} />
            </div>
            <div className="mb-3">
              <Typography variant="h6" className="mb-3">
                url:
              </Typography>
              <Input data-testid="url" {...urlField} />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button variant="text" color="red" onClick={handleCancel} className="mr-1">
              cancel
            </Button>
            <Button variant="gradient" type="submit">
              create
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </>
  )
}

export default NewBlogForm

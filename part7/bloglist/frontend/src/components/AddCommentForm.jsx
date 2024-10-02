import { useAddCommentMutation } from '../api/blogHooks'
import { useNotificationDispatch } from '../contexts/NotificationContext'
import useField from '../hooks/useField'

const AddCommentForm = ({ blog }) => {
  const [commentField, setComment] = useField('text')
  const notifDispatch = useNotificationDispatch()
  const addCommentMutation = useAddCommentMutation(blog.id)

  const addComment = (event) => {
    event.preventDefault()

    const newComment = {
      content: commentField.value,
    }

    console.log('add comment:', newComment)

    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        // success
        notifDispatch({ type: 'notification/set', payload: `Added comment '${newComment.content}'` })
        setTimeout(() => notifDispatch({ type: 'notification/reset' }), 5000)
      },
      onError: (error) => {
        notifDispatch({
          type: 'notification/set',
          payload: error.response.data.error,
        })
        setTimeout(() => notifDispatch({ type: 'notification/reset' }), 5000)
      },
    })

    // cleanup
    setComment('')
  }

  return (
    <div>
      <form onSubmit={addComment}>
        <input {...commentField} />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default AddCommentForm

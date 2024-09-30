import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnecdote } from '../anecdoteRequests'
import { useNotifDispatch } from '../NotifContext'

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const notifDispatch = useNotifDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    newAnecdoteMutation.mutate(
      {
        content: event.target.anecdote.value,
        votes: 0
      },
      {
        onSuccess: (newAnecdote) => {
          notifDispatch({ type: 'notif/set', payload: `Created '${newAnecdote.content}'` })
          setTimeout(() => notifDispatch({ type: 'notif/clear' }), 5000)
        },
        onError: (error) => {
          notifDispatch({ type: 'notif/set', payload: error.response.data.error })
          setTimeout(() => notifDispatch({ type: 'notif/clear' }), 5000)
        }
      }
    )
    event.target.anecdote.value = ''
    console.log('new anecdote')
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm

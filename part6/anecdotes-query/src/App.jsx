import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateAnecdote } from './anecdoteRequests'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useNotifDispatch } from './NotifContext'

const App = () => {
  const queryClient = useQueryClient()
  const notifDispatch = useNotifDispatch()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>Loading data...</div>
  }

  if (result.error) {
    return <div>anecdote service not available due to problems in server</div>
  }

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate(
      {
        ...anecdote,
        votes: anecdote.votes + 1
      },
      {
        onSuccess: (newAnecdote) => {
          notifDispatch({ type: 'notif/set', payload: `Voted '${newAnecdote.content}'` })
          setTimeout(() => notifDispatch({ type: 'notif/clear' }), 5000)
        }
      })
    console.log('vote')
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

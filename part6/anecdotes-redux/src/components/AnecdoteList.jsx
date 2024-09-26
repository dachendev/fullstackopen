import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { clearNotification, setNotification, setTimeoutId, cancelTimeout } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    return state.filter
      ? state.anecdotes.filter(p => p.content.toLowerCase().includes(state.filter.toLowerCase()))
      : state.anecdotes
  })
  const dispatch = useDispatch()

  const voteFor = (anecdote) => {
    dispatch(addVote(anecdote.id))
    dispatch(setNotification(`you voted '${anecdote.content}'`))

    // hide notification after 5 seconds
    dispatch(cancelTimeout())
    const timeoutId = setTimeout(() => dispatch(clearNotification()), 5000)
    dispatch(setTimeoutId(timeoutId))
  }

  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)

  return (
    <div>
      {sortedAnecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteFor(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList
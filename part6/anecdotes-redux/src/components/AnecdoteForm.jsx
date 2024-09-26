import { useDispatch } from 'react-redux'
import { appendAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification, setTimeoutId, cancelTimeout } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdoteService'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    
    const content = event.target.content.value
    event.target.content.value = ''

    const newAnecdoe = await anecdoteService.create(content)
    dispatch(appendAnecdote(newAnecdoe))
    dispatch(setNotification(`you created '${content}'`))

    // hide notification after 5 seconds
    dispatch(cancelTimeout())
    const timeoutId = setTimeout(() => dispatch(clearNotification()), 5000)
    dispatch(setTimeoutId(timeoutId))
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <div><input name="content" /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
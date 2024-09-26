import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdoteService'

const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState,
  reducers: {
    setAnecdotes(state, action) {
      return action.payload
    },
    appendAnecdote(state, action) {
      state.push(action.payload)
    },
    patchAnecdote(state, action) {
      const { id, patch } = action.payload
      const anecdote = state.find(p => p.id === id)
      Object.assign(anecdote, patch)
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const vote = (id) => {
  return async (dispatch, getState) => {
    const state = getState()

    const anecdote = state.anecdotes.find(p => p.id === id)
    const patch = { votes: anecdote.votes + 1 }

    dispatch(patchAnecdote({ id, patch }))

    await anecdoteService.patchById(id, patch)
  }
}

export const { setAnecdotes, appendAnecdote, patchAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
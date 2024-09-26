import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: '',
  timeoutId: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setContent(state, action) {
      state.content = action.payload
    },
    clearContent(state) {
      state.content = ''
    },
    setTimeoutId(state, action) {
      state.timeoutId = action.payload
    },
    clearTimeoutId(state) {
      clearTimeout(state.timeoutId)
      state.timeoutId = null
    }
  }
})

export const setNotification = (content, seconds) => {
  return async dispatch => {
    dispatch(setContent(content))
    dispatch(clearTimeoutId())
    const timeoutId = setTimeout(() => dispatch(clearContent()), seconds * 1000)
    dispatch(setTimeoutId(timeoutId))
  }
}

export const { setContent, clearContent, setTimeoutId, clearTimeoutId } = notificationSlice.actions
export default notificationSlice.reducer
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  content: '',
  timeoutId: null
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      const content = action.payload
      state.content = content
    },
    clearNotification(state) {
      state.content = ''
    },
    setTimeoutId(state, action) {
      const newTimeoutId = action.payload
      state.timeoutId = newTimeoutId
    },
    cancelTimeout(state) {
      clearTimeout(state.timeoutId)
      state.timeoutId = null
    }
  }
})

export const { setNotification, clearNotification, setTimeoutId, cancelTimeout } = notificationSlice.actions
export default notificationSlice.reducer
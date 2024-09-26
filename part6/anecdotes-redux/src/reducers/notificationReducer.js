import { createSlice } from '@reduxjs/toolkit'

const initialState = 'default notification!'

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {}
})

export default notificationSlice.reducer
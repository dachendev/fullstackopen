const initialState = ''

const actionType = {
  CHANGE: 'filter/change'
}

const filterReducer = (state = initialState, action) => {
  console.log('action:', action)

  if (action.type === actionType.CHANGE) {
    return action.payload
  }
  
  return state
}

export const filterChange = (text) => ({
  type: actionType.CHANGE,
  payload: text
})

export default filterReducer
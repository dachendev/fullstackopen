import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'notification/set':
      return action.payload
    case 'notification/reset':
      return ''
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, '')
  return (
    <NotificationContext.Provider value={[state, dispatch]}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)

export default NotificationContext

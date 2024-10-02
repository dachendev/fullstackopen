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
  const [notification, dispatch] = useReducer(notificationReducer, '')
  return <NotificationContext.Provider value={[notification, dispatch]}>{children}</NotificationContext.Provider>
}

export const useNotificationContext = () => useContext(NotificationContext)
export const useNotificationValue = () => useContext(NotificationContext)[0]
export const useNotificationDispatch = () => useContext(NotificationContext)[1]

export default NotificationContext

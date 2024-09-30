import { useReducer, createContext, useContext } from 'react'

const notifReducer = (state, action) => {
  switch (action.type) {
    case 'notif/set':
      return action.payload
    case 'notif/clear':
      return ''
    default:
      return state
  }
}

const NotifContext = createContext(null)

export const NotifContextProvider = props => {
  const [notif, notifDispatch] = useReducer(notifReducer, '')
  return (
    <NotifContext.Provider value={[notif, notifDispatch]}>
      {props.children}
    </NotifContext.Provider>
  )
}

export const useNotifContext = () => useContext(NotifContext)
export const useNotifValue = () => useContext(NotifContext)[0]
export const useNotifDispatch = () => useContext(NotifContext)[1]

export default NotifContext
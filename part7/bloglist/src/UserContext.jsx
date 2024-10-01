import { createContext, useContext, useReducer, useEffect } from 'react'
import { setToken } from './requests'

const userReducer = (state, action) => {
  if (action.type === 'user/set') {
    const user = action.payload
    setToken(user.token)
    window.localStorage.setItem('bloglistUser', JSON.stringify(user))

    return user
  }
  if (action.type === 'user/reset') {
    setToken(null)
    window.localStorage.removeItem('bloglistUser')

    return null
  }
  return state
}

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  useEffect(() => {
    const userJSON = window.localStorage.getItem('bloglistUser')
    if (userJSON) {
      const user = JSON.parse(userJSON)
      userDispatch({ type: 'user/set', payload: user })
      setToken(user.token)
    }
  }, [])

  return <UserContext.Provider value={[user, userDispatch]}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)

export default UserContext

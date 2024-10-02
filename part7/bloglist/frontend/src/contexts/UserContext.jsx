import { createContext, useContext, useReducer } from 'react'

const userReducer = (state, action) => {
  console.log('action:', action)
  if (action.type === 'user/set') {
    const user = action.payload
    window.localStorage.setItem('bloglistUser', JSON.stringify(user))
    return user
  }
  if (action.type === 'user/reset') {
    window.localStorage.removeItem('bloglistUser')
    return null
  }
  return state
}

const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
  const userJSON = window.localStorage.getItem('bloglistUser')
  const initialUser = userJSON ? JSON.parse(userJSON) : null
  const [user, dispatch] = useReducer(userReducer, initialUser)

  return <UserContext.Provider value={[user, dispatch]}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
export const useUserValue = () => useContext(UserContext)[0]
export const useUserDispatch = () => useContext(UserContext)[1]

export const useToken = () => {
  const user = useUserValue()
  if (user) {
    return user.token
  }
  return null
}

export default UserContext

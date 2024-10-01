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
  const [user, userDispatch] = useReducer(userReducer, initialUser)

  return <UserContext.Provider value={[user, userDispatch]}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)

export const useToken = () => {
  const user = useUserContext()[0]
  if (user) {
    return user.token
  }
  return null
}

export default UserContext

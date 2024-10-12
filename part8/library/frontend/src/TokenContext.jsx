import { createContext, useContext, useReducer } from 'react'
import PropTypes from 'prop-types'

const tokenReducer = (state, action) => {
  if (action.type === 'set') {
    const token = action.payload
    localStorage.setItem('token', token)
    return token
  }
  if (action.type === 'reset') {
    localStorage.removeItem('token')
    return null
  }
  return state
}

const TokenContext = createContext()

export const TokenContextProvider = ({ children }) => {
  const storedToken = localStorage.getItem('token')
  const [token, tokenDispatch] = useReducer(tokenReducer, storedToken)
  return (
    <TokenContext.Provider value={[token, tokenDispatch]}>
      {children}
    </TokenContext.Provider>
  )
}

TokenContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useToken = () => useContext(TokenContext)[0]
export const useTokenDispatch = () => useContext(TokenContext)[1]
export const useTokenContext = () => useContext(TokenContext)

export default TokenContext

import { useMutation } from '@apollo/client'
import { useEffect } from 'react'
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'
import { LOGIN } from './queries'
import { useTokenContext, useTokenDispatch } from './TokenContext'

const Login = () => {
  const tokenDispatch = useTokenDispatch()
  const [login, { data }] = useMutation(LOGIN)

  useEffect(() => {
    if (data) {
      const token = data.login.value
      tokenDispatch({ type: 'set', payload: token })
    }
  }, [data, tokenDispatch])

  const onLogin = ({ username, password }) => {
    console.log('Logging in with credentials:', username, password)
    login({ variables: { username, password } })
  }

  return (
    <>
      <LoginForm onLogin={onLogin} />
    </>
  )
}

const App = () => {
  const [token, tokenDispatch] = useTokenContext()

  const logout = () => {
    tokenDispatch({ type: 'reset' })
  }

  return (
    <Router>
      <div>
        <Link to="/" role="button">
          authors
        </Link>
        <Link to="/books" role="button">
          books
        </Link>
        {token ? (
          <>
            <Link to="/add" role="button">
              add book
            </Link>
            <button type="button" onClick={logout}>
              logout
            </button>
          </>
        ) : (
          <Link to="/login" role="button">
            login
          </Link>
        )}
      </div>
      <Routes>
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
        <Route path="/add" element={token ? <NewBook /> : <Navigate to="/login" />} />
        <Route path="/books" element={<Books />} />
        <Route path="/" element={<Authors />} />
      </Routes>
    </Router>
  )
}

export default App

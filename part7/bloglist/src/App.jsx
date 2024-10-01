import Home from './components/Home'
import Login from './components/Login'
import { useUserContext } from './UserContext'

const App = () => {
  const user = useUserContext()[0]

  if (!user) {
    return <Login />
  }
  return <Home />
}

export default App

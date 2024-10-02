import { useNotificationContext } from '../contexts/NotificationContext'
import { useUserContext } from '../contexts/UserContext'
import useField from '../hooks/useField'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authService'
import { Button } from '@material-tailwind/react'

const LoginForm = () => {
  const [usernameField] = useField('text')
  const [passwordField] = useField('password')
  const userDispatch = useUserContext()[1]
  const notificationDispatch = useNotificationContext()[1]
  const navigate = useNavigate()

  const onLogin = async ({ username, password }) => {
    console.log('logging in with', username, password)

    try {
      const user = await login({ username, password })
      userDispatch({ type: 'user/set', payload: user })
    } catch (error) {
      notificationDispatch({
        type: 'notification/set',
        payload: error.response.data.error,
      })
      setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()

    const loginObj = {
      username: usernameField.value,
      password: passwordField.value,
    }

    await onLogin(loginObj)
    navigate('/')
  }

  return (
    <form onSubmit={onSubmit}>
      <div>
        username
        <input data-testid="username" {...usernameField} />
      </div>
      <div>
        password
        <input data-testid="password" {...passwordField} />
      </div>
      <Button type="submit">login</Button>
    </form>
  )
}

export default LoginForm

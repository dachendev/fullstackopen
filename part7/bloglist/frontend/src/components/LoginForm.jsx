import { useNotificationContext } from '../contexts/NotificationContext'
import { useUserContext } from '../contexts/UserContext'
import useField from '../hooks/useField'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/authService'
import { Button, Input, Card, Typography } from '@material-tailwind/react'

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
        <Typography variant="h6" className="mb-3">
          username
        </Typography>
        <Input data-testid="username" {...usernameField} />
      </div>
      <div>
        <Typography variant="h6" className="mb-3">
          password
        </Typography>
        <Input data-testid="password" {...passwordField} />
      </div>
      <Button type="submit" className="mt-6" fullWidth>
        login
      </Button>
    </form>
  )
}

export default LoginForm

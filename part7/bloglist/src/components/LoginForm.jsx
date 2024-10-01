import { useNotificationContext } from '../contexts/NotificationContext'
import loginService from '../services/login'
import { useUserContext } from '../contexts/UserContext'
import { useField } from '../hooks'

const LoginForm = () => {
  const [usernameField, setUsername] = useField('text')
  const [passwordField, setPassword] = useField('password')
  const userDispatch = useUserContext()[1]
  const notificationDispatch = useNotificationContext()[1]

  const onLogin = async (event) => {
    event.preventDefault()

    const loginObj = {
      username: usernameField.value,
      password: passwordField.value,
    }

    console.log('logging in with', loginObj)

    try {
      const user = await loginService.login(loginObj)
      userDispatch({ type: 'user/set', payload: user })
    } catch (error) {
      notificationDispatch({
        type: 'notification/set',
        payload: error.response.data.error,
      })
      setTimeout(() => notificationDispatch({ type: 'notification/reset' }), 5000)
    }

    // cleanup
    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={onLogin}>
      <div>
        username
        <input data-testid="username" {...usernameField} />
      </div>
      <div>
        password
        <input data-testid="password" {...passwordField} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm

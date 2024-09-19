import { useState } from 'react'

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const loginObject = {
      username,
      password
    }

    login(loginObject)

    setUsername('')
    setPassword('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        username
        <input value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div>
        password
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
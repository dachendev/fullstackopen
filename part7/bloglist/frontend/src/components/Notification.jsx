import { Alert } from '@material-tailwind/react'
import { useNotificationContext } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationContext()[0]

  if (!notification) {
    return null
  }

  return <Alert>{notification}</Alert>
}

export default Notification

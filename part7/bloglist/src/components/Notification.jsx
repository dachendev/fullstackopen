import { useNotificationContext } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationContext()[0]

  if (!notification) {
    return null
  }

  const style = {
    padding: '1rem',
    marginBottom: '1rem',
    border: '2px solid #000',
    borderRadius: '0.25rem',
  }

  return <div style={style}>{notification}</div>
}

export default Notification

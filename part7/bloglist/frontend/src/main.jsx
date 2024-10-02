import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <NotificationContextProvider>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </UserContextProvider>
  </NotificationContextProvider>,
)

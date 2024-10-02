import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { UserContextProvider } from './contexts/UserContext'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <QueryClientProvider client={queryClient}>
    <NotificationContextProvider>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </NotificationContextProvider>
  </QueryClientProvider>,
)

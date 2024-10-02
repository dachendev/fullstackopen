import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import App from './App'
import { NotificationContextProvider } from './contexts/NotificationContext'
import { UserContextProvider } from './contexts/UserContext'
import { ThemeProvider } from '@material-tailwind/react'
import './index.css'

const queryClient = new QueryClient()

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <NotificationContextProvider>
    <UserContextProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </UserContextProvider>
  </NotificationContextProvider>,
)

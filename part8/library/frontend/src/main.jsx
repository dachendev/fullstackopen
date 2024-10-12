import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TokenContextProvider } from './TokenContext'

const setAuth = setContext((_, { headers }) => {
  const storedToken = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      authorization: storedToken ? `Bearer ${storedToken}` : null,
    },
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000',
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: setAuth.concat(httpLink),
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TokenContextProvider>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </TokenContextProvider>
  </React.StrictMode>
)

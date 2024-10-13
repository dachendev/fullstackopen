import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TokenContextProvider } from './TokenContext'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { createClient } from 'graphql-ws'
import { getMainDefinition } from '@apollo/client/utilities'

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

const wsLink = new GraphQLWsLink(createClient({ url: 'ws://localhost:4000' }))

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition' && def.operation === 'subscription'
  },
  wsLink,
  setAuth.concat(httpLink)
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
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

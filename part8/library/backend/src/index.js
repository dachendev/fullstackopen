require('dotenv').config()
const { ApolloServer } = require('@apollo/server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const express = require('express')
const cors = require('cors')
const { expressMiddleware } = require('@apollo/server/express4')
const http = require('node:http')
const { WebSocketServer } = require('ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { useServer } = require('graphql-ws/lib/use/ws')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message)
  })

const app = express()
const httpServer = http.createServer(app)
const wsServer = new WebSocketServer({ server: httpServer, path: '/' })

const schema = makeExecutableSchema({ typeDefs, resolvers })
const serverCleanup = useServer({ schema }, wsServer)

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      serverWillStart: async () => ({
        drainServer: async () => await serverCleanup.dispose(),
      }),
    },
  ],
})

const contextFn = async ({ req, res }) => {
  const auth = req?.headers.authorization
  if (auth && auth.startsWith('Bearer ')) {
    const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)
    return { currentUser }
  }
}

const start = async () => {
  await server.start()

  app.use('/', [cors(), express.json(), expressMiddleware(server, { context: contextFn })])

  httpServer.listen(4000, () => {
    console.log('Server running at http://localhost:4000')
  })
}

start()

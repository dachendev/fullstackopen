const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
require('dotenv').config()

mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.log('Error connecting to MongoDB:', err.message)
  })

const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
    allGenres: [String]!
  }

  type Mutation {
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Author: {
    bookCount: async (obj) => Book.countDocuments({ author: obj._id }),
  },
  Query: {
    me: async (obj, args, context) => {
      return context.currentUser
    },
    bookCount: async () => Book.countDocuments(),
    authorCount: async () => Author.countDocuments(),
    allBooks: async (obj, args) => {
      const query = {}
      if (args.author) {
        const author = await Author.findOne({ name: args.author })
        if (author) {
          query.author = author._id
        }
      }
      if (args.genre) {
        query.genres = args.genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find(),
    allGenres: async () => {
      const genres = await Book.aggregate([
        { $unwind: '$genres' },
        { $group: { _id: null, items: { $addToSet: '$genres' } } },
        { $project: { _id: 0, items: 1 } },
      ])

      return genres[0]?.items || []
    },
  },
  Mutation: {
    createUser: async (obj, args) => {
      try {
        return User.create({
          username: args.username,
          favoriteGenre: args.favoriteGenre,
        })
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Operation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.message,
            },
          })
        } else {
          throw new GraphQLError('Unexpected error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error,
            },
          })
        }
      }
    },
    login: async (obj, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const payload = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(payload, process.env.JWT_SECRET) }
    },
    addBook: async (obj, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        let author = await Author.findOne({ name: args.author })
        if (!author) {
          author = await Author.create({ name: args.author })
        }
        const book = await Book.create({ ...args, author: author._id })
        await book.populate('author')
        return book
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Operation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.message,
            },
          })
        } else {
          throw new GraphQLError('Unexpected error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error,
            },
          })
        }
      }
    },
    editAuthor: async (obj, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        return Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true, runValidators: true }
        )
      } catch (error) {
        if (error.name === 'ValidationError') {
          throw new GraphQLError('Operation failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              error: error.message,
            },
          })
        } else {
          throw new GraphQLError('Unexpected error', {
            extensions: {
              code: 'INTERNAL_SERVER_ERROR',
              error,
            },
          })
        }
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req?.headers.authorization
    if (auth && auth.startsWith('Bearer ')) {
      const decoded = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decoded.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

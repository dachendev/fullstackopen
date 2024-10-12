const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const gql = require('graphql-tag')
const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
const { GraphQLError } = require('graphql')
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
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`

const resolvers = {
  Author: {
    bookCount: async (obj) => Book.countDocuments({ author: obj._id }),
  },
  Query: {
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
        query.genre = args.genre
      }
      return Book.find(query).populate('author')
    },
    allAuthors: async () => Author.find(),
  },
  Mutation: {
    addBook: async (obj, args) => {
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
    editAuthor: async (obj, args) => {
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})

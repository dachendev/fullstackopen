const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const mongoose = require('mongoose')

const pubSub = new PubSub()

const resolvers = {
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
          // If the author doesn't exist, create a new one
          author = await Author.create({ name: args.author })
        }

        const book = await Book.create({ ...args, author: author._id })

        // If the book was created successfully, increment bookCount
        author.bookCount += 1
        await author.save()

        await book.populate('author')

        // Publish the new book to any subscribers
        pubSub.publish('BOOK_ADDED', { bookAdded: book })

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
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers

const gql = require('graphql-tag')

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

  type Subscription {
    bookAdded: Book!
  }
`

module.exports = typeDefs

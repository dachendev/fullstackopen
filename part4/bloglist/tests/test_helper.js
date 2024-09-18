const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const config = require('../utils/config.js')

const blogObjects = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2
  }  
]

const seedBlogs = async (userId) => {
  await Blog.deleteMany({})

  const promises = blogObjects.map(async b => (await Blog.create({ ...b, user: userId })).toJSON())

  return await Promise.all(promises)
}

const blogs = async () => (await Blog.find({})).map(b => b.toJSON())

const userObjects = [
  {
    username: 'root',
    name: 'Superuser',
    password: 'secret'
  },
  {
    username: 'dachendev',
    name: 'Jacob Dachenhaus',
    password: 'dachendev'
  }
]

const seedUsers = async () => {
  await User.deleteMany({})

  const promises = userObjects.map(async u => {
    const hash = await bcrypt.hash(u.password, 10)
    return (await User.create({ ...u, hash })).toJSON()
  })

  return await Promise.all(promises)
}

const users = async () => (await User.find({})).map(u => u.toJSON())

const auth = (user) => {
  const tokenObject = {
    id: user.id,
    user: user.username
  }

  const token = jwt.sign(tokenObject, config.SECRET)

  return `Bearer ${token}`
}

module.exports = {
  blogObjects,
  seedBlogs,
  blogs,
  userObjects,
  seedUsers,
  users,
  auth
}
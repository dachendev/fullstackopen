const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')

const getTokenFrom = (request) => {
  const auth = request.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    return auth.substring(7)
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

// creates a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const decoded = jwt.verify(getTokenFrom(request), config.SECRET)
  if (!decoded.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decoded.id)

  const blogObj = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  }

  const blog = new Blog(blogObj)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true, runValidators: true, context: 'query' })
  res.json(updatedBlog)
})

module.exports = blogsRouter;
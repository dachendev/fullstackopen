const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

// creates a new blog
blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const firstUser = await User.findOne({})

  const blogObj = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: firstUser._id
  }

  const blog = new Blog(blogObj)
  const savedBlog = await blog.save()

  firstUser.blogs = firstUser.blogs.concat(savedBlog._id)
  await firstUser.save()
  
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
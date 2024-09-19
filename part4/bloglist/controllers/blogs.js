const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

// creates a new blog
blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user invalid' })
  }

  const blog = await Blog.create({ ...request.body, user: user._id })

  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  
  response.status(201).json(blog)
})

// deletes a blog
blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (user._id.toString() !== blog.user.toString()) {
    return response.status(401).json({ error: 'only the creator can delete this blog' })
  }

  await blog.deleteOne()
  response.status(204).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const body = req.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog
    .findByIdAndUpdate(req.params.id, blog, { new: true, runValidators: true, context: 'query' })
    .populate('user')
    
  res.json(updatedBlog)
})

module.exports = blogsRouter;
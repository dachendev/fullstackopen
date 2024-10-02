const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const Comment = require('../models/comment.js')
const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')

// get blog by id
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate(['user', 'comments'])
  response.json(blog)
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate(['user', 'comments'])
  response.json(blogs)
})

// create a new comment
blogsRouter.post('/:id/comments', async (request, response) => {
  const user = request.user

  if (!user) {
    response
      .status(401) // unauthorized
      .json({ error: 'user invalid' })
    return
  }

  const newComment = {
    ...request.body,
    user: user._id,
  }

  const comment = new Comment(newComment)
  await comment.save()

  await Blog.findByIdAndUpdate(request.params.id, { $push: { comments: comment } })

  response.status(201).json(comment)
})

// creates a new blog
blogsRouter.post('/', async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'user invalid' })
  }

  const blog = await Blog.create({ ...request.body, user: user._id })

  await User.findByIdAndUpdate(user._id, { $push: { blogs: blog } })
  await blog.populate(['user', 'comments'])

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
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  })

  await updatedBlog.populate(['user', 'comments'])

  res.json(updatedBlog)
})

module.exports = blogsRouter

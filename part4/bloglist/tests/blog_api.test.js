const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app.js')
const Blog = require('../models/blog.js')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const res = await api.get('/api/blogs')
  
  assert.strictEqual(res.body.length, helper.initialBlogs.length)
})

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')
  const firstBlog = response.body[0]

  assert(firstBlog.hasOwnProperty('id'))
})

test('creates a new blog', async () => {
  const newBlog = {
    title: 'atomic habits'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAfter = await helper.blogsInDb()
  assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

  const titles = blogsAfter.map(b => b.title)
  assert(titles.includes(newBlog.title))
})

after(async () => {
  await mongoose.connection.close()
})
const { test, after, beforeEach, describe } = require('node:test')
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

describe('creating new blogs', () => {
  test('creates a new blog', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2
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

  test('missing likes defaults to zero', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }
  
    const response = await api.post('/api/blogs').send(newBlog)
  
    const createdBlog = (await helper.blogsInDb()).find(b => b.id === response.body.id)
    assert.strictEqual(createdBlog.likes, 0)
  })

  test('blog with missing title is invalid', async () => {
    const newBlog = {
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('blog with missing url is invalid', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})
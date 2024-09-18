const { test, after, beforeEach, describe, before } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app.js')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')

const api = supertest(app)

let headers
before(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const defaultUser = await User.create({
    username: 'default',
    name: 'Default User',
    password: 'default'
  })

  const promiseArray = helper.initialBlogs.map(blog => Blog.create({ ...blog, user: defaultUser._id }))
  await Promise.all(promiseArray)

  headers = {
    Authorization: await helper.loginUser()
  }
})

describe('when there is initially some blogs saved', () => {
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

  test('blogs have a creator', async () => {
    const res = await api.get('/api/blogs')
    const firstBlog = res.body[0]

    assert(firstBlog.hasOwnProperty('user'))
  })

  test('creator data is populated', async () => {
    const res = await api.get('/api/blogs')
    const firstBlog = res.body[0]

    assert(firstBlog.user.hasOwnProperty('id') && firstBlog.user.hasOwnProperty('username'))
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api
        .post('/api/blogs')
        .set(headers)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, helper.initialBlogs.length + 1)

      const titles = blogsAfter.map(b => b.title)
      assert(titles.includes(newBlog.title))
    })

    test('missing likes defaults to 0', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      }

      const response = await api.post('/api/blogs').set(headers).send(newBlog)

      const createdBlog = (await helper.blogsInDb()).find(b => b.id === response.body.id)
      assert.strictEqual(createdBlog.likes, 0)
    })

    test('missing creator is assigned', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      }

      const res = await api.post('/api/blogs').set(headers).send(newBlog)

      assert(res.body.hasOwnProperty('user'))
    })

    test('fails with status code 400 if title invalid', async () => {
      const newBlog = {
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html'
      }

      await api.post('/api/blogs').set(headers).send(newBlog).expect(400)
    })

    test('fails with status code 400 if url invalid', async () => {
      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
      }

      await api.post('/api/blogs').set(headers).send(newBlog).expect(400)
    })

    test('fails with status code 401 if unauthorized', async () => {
      const blogsBefore = await helper.blogsInDb()

      const newBlog = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const blogsAfter = await helper.blogsInDb()
      assert.strictEqual(blogsAfter.length, blogsBefore.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const firstBlog = await helper.firstBlog()
      await api.delete(`/api/blogs/${firstBlog.id}`).expect(204)
    })

    test('fails with status code 400 if id invalid', async () => {
      const invalidId = 'keyboard cat'
      await api.delete(`/api/blogs/${invalidId}`).expect(400)
    })
  })

  describe('updating a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const firstBlog = await helper.firstBlog()

      const blogObject = {
        ...firstBlog,
        likes: 20
      }

      await api
        .put(`/api/blogs/${firstBlog.id}`)
        .send(blogObject)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogsInDb()
      const updatedBlog = blogsAfter.find(b => b.id === firstBlog.id)
      assert.strictEqual(updatedBlog.likes, blogObject.likes)
    })

    test('fails with status code 400 if id invalid', async () => {
      const invalidId = 'keyboard cat'
      await api.put(`/api/blogs/${invalidId}`).send({}).expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
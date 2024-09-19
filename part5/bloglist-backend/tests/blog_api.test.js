const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app.js')

const api = supertest(app)

let firstUser = null
let firstBlog = null
let headers = {}

beforeEach(async () => {
  // create users
  const users = await helper.seedUsers()
  firstUser = users[0]

  // create blogs
  const blogs = await helper.seedBlogs(firstUser.id)
  firstBlog = blogs[0]

  // set default headers
  headers = {
    Authorization: helper.auth(firstUser)
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
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.blogObjects.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].id)
  })

  test('blogs have a creator', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].user)
  })

  test('creator data is populated', async () => {
    const response = await api.get('/api/blogs')
    assert(response.body[0].user.id && response.body[0].user.username)
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

      const blogsAfter = await helper.blogs()
      assert.strictEqual(blogsAfter.length, helper.blogObjects.length + 1)

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

      const createdBlog = (await helper.blogs()).find(b => b.id === response.body.id)
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
      const blogsBefore = await helper.blogs()

      const blogObject = {
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2
      }

      await api.post('/api/blogs').send(blogObject).expect(401)

      const blogsAfter = await helper.blogs()
      assert.strictEqual(blogsAfter.length, blogsBefore.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      await api.delete(`/api/blogs/${firstBlog.id}`).set(headers).expect(204)
    })

    test('fails with status code 400 if id invalid', async () => {
      const invalidId = 'keyboard cat'
      await api.delete(`/api/blogs/${invalidId}`).set(headers).expect(400)
    })

    test('fails with status code 401 if unauthorized', async () => {
      await api.delete(`/api/blogs/${firstBlog.id}`).expect(401)
    })

    test('fails with status code 401 if not creator', async () => {
      const userObject = {
        username: 'ducky',
        password: 'ducky'
      }

      const response1 = await api.post('/api/users').send(userObject)
      const savedUser = response1.body

      assert.notStrictEqual(savedUser.id, firstBlog.user.id)

      const headers = {
        Authorization: helper.auth(savedUser)
      }

      const response2 = await api
        .delete(`/api/blogs/${firstBlog.id}`)
        .set(headers)
        .expect(401)

      assert(response2.body.error.includes('only the creator can delete this blog'))
    })
  })

  describe('updating a specific blog', () => {
    test('succeeds with a valid id', async () => {
      const blogObject = {
        ...firstBlog,
        likes: 20
      }

      await api
        .put(`/api/blogs/${firstBlog.id}`)
        .send(blogObject)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAfter = await helper.blogs()
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
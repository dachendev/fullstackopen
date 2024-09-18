const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')
const helper = require('./test_helper.js')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  // create users
  await helper.seedUsers()
})

describe('when there are initially some users saved', () => {
  test('returns as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all users', async () => {
    const usersBefore = await helper.users()
    const response = await api.get('/api/users')
    assert.strictEqual(response.body.length, usersBefore.length)
  })

  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/users')
    assert(response.body[0].id)
  })

  test('password is not included', async () => {
    const response = await api.get('/api/users')
    assert(!(response.body[0].password || response.body[0].passwordHash))
  })

  test('user has blogs', async () => {
    const response = await api.get('/api/users')
    assert(response.body[0].blogs)
  })

  describe('adding a new user', () => {
    test('succeeds with valid data', async () => {
      const usersBefore = await helper.users()

      const userObject = {
        username: 'bmarley',
        name: 'Bob Marley',
        password: 'littlebirds3'
      }

      await api
        .post('/api/users')
        .send(userObject)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.users()
      assert.strictEqual(usersAfter.length, usersBefore.length + 1)

      const usernames = usersAfter.map(u => u.username)
      assert(usernames.includes(userObject.username))
    })

    test('fails with status code 400 if username invalid', async () => {
      const usersBefore = await helper.users()
      const userObject = {
        password: 'littlebirds3'
      }

      await api.post('/api/users').send(userObject).expect(400)

      const usersAfter = await helper.users()
      assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('fails with status code 400 if username too short', async () => {
      const usersBefore = await helper.users()
      const userObject = {
        username: 'bm',
        password: 'littlebirds3'
      }

      await api.post('/api/users').send(userObject).expect(400)

      const usersAfter = await helper.users()
      assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('fails with status code 400 if username not unique', async () => {
      const usersBefore = await helper.users()
      const userObject = {
        username: 'root',
        password: 'secret'
      }

      const res = await api.post('/api/users').send(userObject).expect(400)

      const usersAfter = await helper.users()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(res.body.error.includes('expected `username` to be unique'))
    })

    test('fails with status code 400 if password invalid', async () => {
      const usersBefore = await helper.users()
      const userObject = {
        username: 'bmarley'
      }

      const response = await api.post('/api/users').send(userObject).expect(400)

      const usersAfter = await helper.users()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(response.body.error.includes('password invalid'))
    })

    test('fails with status code 400 if password too short', async () => {
      const usersBefore = await helper.users()
      const userObject = {
        username: 'bmarley',
        password: 'lb'
      }

      const response = await api.post('/api/users').send(userObject).expect(400)

      const usersAfter = await helper.users()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(response.body.error.includes('password should be at least 3 characters'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
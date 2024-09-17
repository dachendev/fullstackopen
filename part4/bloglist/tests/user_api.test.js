const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app.js')
const helper = require('./test_helper.js')
const User = require('../models/user.js')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({ username: 'root', passwordHash })

  await user.save()
})

describe('when there are initially some users saved', () => {
  test('returns as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns all users', async () => {
    const users = await helper.usersInDb()
    const res = await api.get('/api/users')

    assert.strictEqual(res.body.length, users.length)
  })

  test('unique identifier property is named id', async () => {
    const res = await api.get('/api/users')
    const firstUser = res.body[0]

    assert(firstUser.hasOwnProperty('id'))
  })

  test('password is not included', async () => {
    const res = await api.get('/api/users')
    const firstUser = res.body[0]

    assert(!(firstUser.password || firstUser.passwordHash))
  })

  test('user has blogs', async () => {
    const res = await api.get('/api/users')
    const firstUser = res.body[0]

    assert(firstUser.hasOwnProperty('blogs'))
  })

  describe('adding a new user', () => {
    test('succeeds with valid data', async () => {
      const usersBefore = await helper.usersInDb()

      const newUser = {
        username: 'bmarley',
        name: 'Bob Marley',
        password: 'littlebirds3'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersAfter.length, usersBefore.length + 1)

      const usernames = usersAfter.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('fails with status code 400 if username invalid', async () => {
      const usersBefore = await helper.usersInDb()
      const newUser = {
        password: 'littlebirds3'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('fails with status code 400 if username too short', async () => {
      const usersBefore = await helper.usersInDb()
      const newUser = {
        username: 'bm',
        password: 'littlebirds3'
      }

      await api.post('/api/users').send(newUser).expect(400)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersBefore.length, usersAfter.length)
    })

    test('fails with status code 400 if username not unique', async () => {
      const usersBefore = await helper.usersInDb()
      const newUser = {
        username: 'root',
        password: 'secret'
      }

      const res = await api.post('/api/users').send(newUser).expect(400)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(res.body.error.includes('expected `username` to be unique'))
    })

    test('fails with status code 400 if password invalid', async () => {
      const usersBefore = await helper.usersInDb()
      const newUser = {
        username: 'bmarley'
      }

      const res = await api.post('/api/users').send(newUser).expect(400)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(res.body.error.includes('password invalid'))
    })

    test('fails with status code 400 if password too short', async () => {
      const usersBefore = await helper.usersInDb()
      const newUser = {
        username: 'bmarley',
        password: 'lb'
      }

      const res = await api.post('/api/users').send(newUser).expect(400)

      const usersAfter = await helper.usersInDb()
      assert.strictEqual(usersBefore.length, usersAfter.length)

      assert(res.body.error.includes('password should be at least 3 characters'))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
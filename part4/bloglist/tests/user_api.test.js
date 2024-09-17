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

    // test('fails with status code 400 if username invalid', async () => {
    //   const newUser = {
    //     name: 'Bob Marley',
    //     password: 'littlebirds3'
    //   }

    //   await api.post('/api/users').send(newUser).expect(400)
    // })

    // test('fails with status code 400 if password invalid', async () => {
    //   const newUser = {
    //     username: 'bmarley',
    //     name: 'Bob Marley'
    //   }

    //   await api.post('/api/users').send(newUser).expect(400)
    // })
  })
})

after(async () => {
  await mongoose.connection.close()
})
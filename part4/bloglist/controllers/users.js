const usersRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')

usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs')
  res.json(users)
})

usersRouter.post('/', async (req, res) => {
  const body = req.body

  if (!body.password) {
    return res.status(400).json({ error: 'password invalid' })
  }

  if (body.password.length < 3) {
    return res.status(400).json({ error: 'password should be at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  })

  const savedUser = await user.save()

  res.status(201).json(savedUser)
})

module.exports = usersRouter
const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const config = require('../utils/config.js')

loginRouter.post('/', async (req, res) => {
  const body = req.body

  const user = await User.findOne({ username: body.username })

  const passwordCheck = (user === null) ?
    false :
    bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCheck)) {
    return res.status(401).json({ error: 'invalid username or password' })
  }

  const userObject = {
    id: user._id,
    username: user.username
  }

  const token = jwt.sign(userObject, config.SECRET, { expiresIn: 3600 })

  res.status(200).send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
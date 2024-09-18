const jwt = require('jsonwebtoken')
const config = require('../utils/config.js')
const User = require('../models/user.js')

const userExtractor = () => async (request, response, next) => {
  request.user = null

  if (!request.token) {
    return next()
  }

  try {
    const { id } = jwt.verify(request.token, config.SECRET)
    if (id) {
      request.user = await User.findById(id)
    }
  } catch (error) {
    // do nothing
  }

  next()
}

module.exports = userExtractor
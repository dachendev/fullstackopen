const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (doc, returnObj) => {
    returnObj.id = returnObj._id.toString()
    delete returnObj._id
    delete returnObj.__v
    // do not expose password hash!
    delete returnObj.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)
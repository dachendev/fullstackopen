const mongoose = require('mongoose')
const Comment = require('./comment')
const User = require('./user')

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: String,
  url: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /^(https?:\/\/)([a-z0-9\-\.]+)(\.)([a-z]+)(\/.*)?$/i.test(v)
      },
      message: (props) => `${props.value} is not a valid url!`,
    },
  },
  likes: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
})

blogSchema.set('toJSON', {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
  },
})

blogSchema.pre('deleteOne', { document: true }, async function (next) {
  await User.updateById(this.user, { $pull: { blogs: this._id } })
  await Comment.deleteMany({ _id: { $in: this.comments } })
  next()
})

module.exports = mongoose.model('Blog', blogSchema)

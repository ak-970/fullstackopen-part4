const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // username must be unique
    unique: true,
    // username must be at least 3 characters long
    minLength: [3, 'Username must be at least 3 characters long.']
  },
  passwordHash: {
    type: String,
    required: true,
    // password must be at least 3 characters long -
    // requirement is handled in controllers/users.js since only passwordHash gets here
  },
  name: {
    type: String
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.plugin(uniqueValidator)


userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})


const User = mongoose.model('User', userSchema)

module.exports = User
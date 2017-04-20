const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = require('bluebird')

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  token: String,
})

module.exports = mongoose.model('User', UserSchema)

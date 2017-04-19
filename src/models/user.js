const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = require('bluebird')

const UserSchema = new Schema({
  email: String,
  password: String,
  name: String,
  token: String,
})

module.exports = mongoose.model('User', UserSchema)

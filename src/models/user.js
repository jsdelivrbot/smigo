const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = require('bluebird')

const UserSchema = new Schema({
  username: String,
  password: String,
})

module.exports = mongoose.model('User', UserSchema)

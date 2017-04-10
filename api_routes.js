// setup mongo
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/smigo')

// require models
const User = require('./src/models/user')

// require utils
const handleUpload = require('./src/utils/handleUpload').handleUpload
const SGFParser = require('./src/utils/SGF_parser').SGFParser
const scoreEstimator = require('./src/utils/scoreEstimator').scoreEstimator
const generateToken = require('./src/utils/generateToken').generateToken

const route_login = (req, res) => {
  const { username, password } = req.body

  User.find({ username, password }, 'name', (error, collection) => {
    if (error) {
      res.json({ success: false, error, user: null, id: null })

      return false
    }

    if (collection.length === 0) {
      res.json({ success: false, error: false, user: null, id: null })

      return false
    }

    const id = collection[0]._id
    const token = generateToken({ id })
    const name = collection[0].name

    const user = { name, token }

    res.json({ success: true, error: false, user, id })
  })
}

const route_predict = (req, res) => {
  const { board } = req.body

  const promise = new Promise((resolve, reject) => {
    const prediction = scoreEstimator(board)

    if (!prediction) {
      reject('no prediction could be made')
    }
    else {
      resolve(prediction)
    }

    res.json({ prediction })
  })
}

const route_upload = (req, res) => {
  handleUpload(req, res, (filePath, response) => {
    SGFParser(filePath)
      .then(parsedGame => response.send(JSON.stringify(parsedGame)))
      .catch(error => response.send(JSON.stringify({ error })))
  })
}

const route_saveToken = (req, res) => {
  const {id, token } = req.body

  User.where({ _id: id }).update({ token }, (error, writeOpResult) => {
    if (error) {
      res.json({ success: false, error })

      return false
    }

    res.json({ success: true, error: false })
  })
}

const route_users = (req, res) => {
  User.where('token').ne("").find({}, (error, users) => {
    if (error) {
      res.json({ error, users: null })

      return false
    }

    res.json({ error: null, users })
  })

}

module.exports = {
  login: route_login,
  predict: route_predict,
  saveToken: route_saveToken,
  upload: route_upload,
  users: route_users,
}

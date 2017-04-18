const service = require('feathers-mongoose')

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

const predict = params => {
  return new Promise((resolve, reject) => {
    const prediction = scoreEstimator(params.board)

    if (!prediction) {
      reject('no prediction could be made')
    }

    resolve({ prediction })
  })
}

const route_upload = (req, res) => {
  handleUpload(req, res, (filePath, response) => {
    SGFParser(filePath)
      .then(parsedGame => response.send(JSON.stringify(parsedGame)))
      .catch(error => response.send(JSON.stringify({ error })))
  })
}

const userService = service({
  Model: User
})

module.exports = {
  userService,
  predict,
  upload: route_upload,
}

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

const service_user = service({
  Model: User
})

module.exports = {
  service_user,
  predict: route_predict,
  upload: route_upload,
}

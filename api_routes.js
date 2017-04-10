// setup mongo
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/smigo')

const fs = require('fs')

const jwt = require('jsonwebtoken')
const cert = require('./secret').secretKey  // get private key

// require models
const User = require('./src/models/user')

// require utils
const handleUpload = require('./src/utils/handleUpload').handleUpload
const SGFParser = require('./src/utils/SGF_parser').SGFParser
const scoreEstimator = require('./src/utils/scoreEstimator').scoreEstimator

const route_login = (req, res) => {
  const { username, password } = req.body

  User.find({ username, password }, 'name', (error, collection) => {
    if (error) {
      res.json({ success: false, error, user: null })

      return false
    }

    if (collection.length === 0) {
      res.json({ success: false, error: false, user: null })

      return false
    }

    const token = jwt.sign({ id: collection[0]._id }, cert)
    const name = collection[0].name

    const user = { name, token }

    res.json({ success: true, error: false, user })
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

module.exports = {
  predict: route_predict,
  upload: route_upload,
  login: route_login,
}

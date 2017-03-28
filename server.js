const express = require('express')
const path = require('path')
const port = process.env.PORT || 8081
const app = express()

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const scoreEstimator = require('./src/utils/scoreEstimator').scoreEstimator
const handleUpload = require('./src/utils/handleUpload').handleUpload
const SGFParser = require('./src/utils/SGF_parser').SGFParser

app.use(express.static(__dirname))

app.post('/api/predict', (req, res) => {
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
})

app.post('/api/upload', (req, res) => {
  handleUpload(req, res, (filePath, response) => {
    SGFParser(filePath)
      .then(parsedGame => { response.send(JSON.stringify(parsedGame)) })
  })
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port)

console.log(`Server started. Listening to port ${port}.`)

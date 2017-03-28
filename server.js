const express = require('express')
const path = require('path')
const port = process.env.PORT || 8081
const app = express()
const formidable = require('formidable')
const fs = require('fs')

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const cors = require('cors')
app.use(cors())

const scoreEstimator = require('./src/utils/scoreEstimator').scoreEstimator
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
  // create an incoming form object
  const form = new formidable.IncomingForm()
  let filePath = ""

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false

  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '/uploads')

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    filePath = path.join(form.uploadDir, file.name)

    fs.renameSync(file.path, filePath)
  })

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err)
  })

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    SGFParser(filePath)
    .then(response => {
      res.send(JSON.stringify(response))
    })
  })

  // parse the incoming request containing the form data
  form.parse(req)
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port)

console.log(`Server started. Listening to port ${port}.`)
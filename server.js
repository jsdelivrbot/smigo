const express = require('express')
const path = require('path')
const port = process.env.PORT || 8081
const app = express()

// use body-parser middleware
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// use cors middleware
const cors = require('cors')
app.use(cors())

app.use(express.static(__dirname))

const routes = require('./api_routes')

app.post('/api/login', routes.login)
app.post('/api/predict', routes.predict)
app.post('/api/upload', routes.upload)
app.post('/api/save_token', routes.saveToken)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.listen(port)

console.log(`Server started. Listening to port ${port}.`)

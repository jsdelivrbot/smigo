const express = require('express')
const app = express()

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const moment = require('moment')

const path = require('path')
const port = process.env.PORT || 8081

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
app.get('/api/users', routes.users)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

io.on('connection', (socket) => {
  const timestamp = moment().format('hh:mm')

  io.emit('chat message', { user: { name: 'Notification' }, message: 'User connected', timestamp })

  socket.on('chat message', msg => io.emit('chat message', msg))
  socket.on('incoming chat message', name => io.emit('incoming chat message', name))

  socket.on('disconnect', () => {
    // console.log('user disconnected')
  })
})

server.listen(port)

console.log(`Server started. Listening to port ${port}.`)

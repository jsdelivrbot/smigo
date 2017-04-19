// const express = require('express')
const feathers = require('feathers')
const rest = require('feathers-rest')
const hooks = require('feathers-hooks')
const moment = require('moment')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorHandler = require('feathers-errors/handler')

const app = feathers()
  .configure(rest())
  .configure(hooks())
  .set('port', process.env.PORT || 8081)
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cors())
  .use(errorHandler())
  // .use('/', feathers.static(__dirname + '/public'))

const server = require('http').createServer(app)
const io = require('socket.io')(server)

// app.use(express.static(__dirname))

const services = require('./api_services')

app.post('/api/upload', services.upload)

app.use('/api/users', services.user)

app.service('/api/predict', {
  create: params => services.predict(params)
})

app.service('/api/token', {
  get: id => services.token(id)
})

app.service('/api/predict').hooks({
  before: {
    find(hook) {
      console.log('hook before', hook)
    }
  },
  after: {
    find(hook) {
      // console.log('hook after', hook)

      // const { _id: id, name } = hook.result[0]
      // const token = generateToken({ id })

      // const user = { name, token }
    }
  }
})

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'))
})

const chat = io
  .of('/chat')
  .on('connection', socket => {
    const timestamp = moment().format('hh:mm')
    const generalChatChannel = 0

    chat.emit('chat message', {
      user: {
        name: 'Notification'
      },
      message: 'User connected',
      timestamp ,
    }, generalChatChannel)

    socket.on('chat message', (msg, channel) => chat.emit('chat message', msg, channel))
    socket.on('incoming chat message', (name, channel) => chat.emit('incoming chat message', name, channel))
    socket.on('add channel', () => socket.broadcast.emit('add channel'))
    socket.on('remove channel', targetKey => socket.broadcast.emit('remove channel', targetKey))

    socket.on('disconnect', () => {
      // console.log('user disconnected')
    })
  })

server.listen(app.get('port'))

console.log(`Server started. Listening to port ${app.get('port')}.`)

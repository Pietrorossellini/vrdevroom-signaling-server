import env from 'dotenv'
import socketIO from 'socket.io'
import RoomController from './room/Controller'

env.config()

const io = socketIO.listen(process.env.IO_PORT, {
  origins: process.env.ALLOWED_ORIGINS,
  pingInterval: 5000,
  pingTimeout: 15000
})

const MAX_CLIENTS = 3
const rooms = new RoomController(log)

function log(socket, ...args) {
  const msg = ['[Server says]', ...args]
  socket.emit('log', msg)
}

const getClients = room =>
  new Promise((resolve, reject) =>
    io.in(room).clients((error, clients) =>
      error ? reject() : resolve(clients)))

io.sockets.on('connection', socket => {

  socket.on('message', (message, clientId) => {
    const rooms = Object.keys(socket.rooms).filter(r => r !== socket.id)

    if (clientId) {
      log(socket, `[Client ${socket.id} said to ${clientId}] `, message)
      socket.to(clientId).emit('message', socket.id, message) // Direct message
    } else if (rooms.length > 0) {
      socket.to(rooms[0]).emit('message', socket.id, message) // All in room except self
    } else {
      console.warn(`Client ${socket.id} is broadcasting, but is not in the room`)
    }
  })

  socket.on('enter', (room, nickname) => {
    log(socket, `Received request from ${nickname} to enter room ${room}`)

    getClients(room)
      .then(clients => clients.length)
      .then(maybeJoin)

    function maybeJoin(numClients) {
      log(socket, 'Room ' + room + ' had ' + numClients + ' client(s)')

      if (numClients === 0) rooms.createAndJoin(room, nickname, socket, MAX_CLIENTS)
      else if (numClients < MAX_CLIENTS) rooms.join(room, nickname, socket)
      else socket.emit('full', room)
    }
  })

  socket.on('disconnecting', reason => {
    const report = reason === 'ping timeout' ? console.warn : console.log
    report(`Client ${socket.id} is being disconnected due ${reason}`)

    Object.keys(socket.rooms).forEach(room =>
      getClients(room)
        .then(clients => clients.length)
        .then(numClients => rooms.leave(room, socket, numClients))
    )
  })

  socket.on('disconnect', reason => {
    console.log(`Client ${socket.id} disconnected due to ${reason}`)
  })
})
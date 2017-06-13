import {Map} from 'immutable'
import Room from './Room'


class RoomController {
  constructor(log = (_, msg) => console.log(msg)) {
    this.log = log
    this.rooms = Map()
  }

  createAndJoin(roomName, socket, size = 3) {
    socket.join(roomName)

    const room = new Room(roomName, size)
    room.fillNextAvailableSlot(socket.id)
    this.rooms = this.rooms.set(roomName, room)

    socket.emit('created', roomName, socket.id)
    this.log(socket, `Client ID ${socket.id} created room ${roomName}`)
  }

  join(roomName, socket) {
    const room = this.rooms.get(roomName)
    if (!room.hasAvailableSlot()) throw new Error('Room full')

    this.io.sockets.in(roomName).emit('join', roomName)

    socket.join(roomName)
    const slot = room.fillNextAvailableSlot(socket.id)

    socket.emit('joined', roomName, socket.id, slot)
    this.log(socket, `Client ID ${socket.id} joined room ${roomName}`)
  }

  leave(roomName, socket, numClients) {
    socket.leave(roomName, () => {
      numClients > 1
        ? this.rooms.get(roomName).vacateSlotById(socket.id)
        : this.rooms = this.rooms.delete(roomName)

      socket.to(roomName).emit('leave', roomName, socket.id)
      this.log(socket, `Client ID ${socket.id} leaved room ${roomName}`)
    })
  }
}

export default RoomController

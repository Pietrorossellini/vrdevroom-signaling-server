import {Map} from 'immutable'
import Room from './Room'
import Client from './Client'

class RoomController {
  constructor(log = (_, msg) => console.log(msg)) {
    this.log = log
    this.rooms = Map()
  }

  createAndJoin(roomName, nickname, socket, size = 3) {
    socket.join(roomName)

    const room = new Room(roomName, size)
    room.fillNextAvailableSlot(new Client(socket.id, nickname, true))
    this.rooms = this.rooms.set(roomName, room)

    socket.emit('created', roomName, socket.id)
    this.log(socket.to(roomName), `${nickname} with client ID ${socket.id} created room ${roomName}`)
  }

  join(roomName, nickname, socket) {
    const room = this.rooms.get(roomName)
    if (!room.hasAvailableSlot()) throw new Error('Room full')

    socket.to(roomName).emit('join', roomName)

    socket.join(roomName)
    const slot = room.fillNextAvailableSlot(new Client(socket.id, nickname))

    socket.emit('joined', roomName, socket.id, slot)
    this.log(socket.to(roomName), `${nickname} with client ID ${socket.id} joined room ${roomName}`)
  }

  leave(roomName, socket, numClients) {
    socket.leave(roomName, () => {
      const room = this.rooms.get(roomName)

      if (numClients === 1) {
        this.rooms = this.rooms.delete(roomName)
        return
      }

      const removedClient = room.vacateSlotById(socket.id)
      socket.to(roomName).emit('leave', roomName, socket.id)
      this.log(socket.to(roomName), `Client ID ${socket.id} leaved room ${roomName}`)

      if (removedClient.isLeader) {
        const newLeader = room.electNewLeader()
        socket.to(roomName).emit('lead', roomName, newLeader.id)
        this.log(socket.to(roomName),
          `Leader has left the room ${roomName}: client ID ${newLeader.id} is the new leader`)
      }
    })
  }
}

export default RoomController
import {List, Repeat} from 'immutable'

export default class Room {
  constructor(id, maxSize = 3) {
    this.roomId = id
    this.slots = List(Repeat(null, maxSize))
  }

  _findNextAvailableSlot() {
    const i = this.slots.findIndex(slot => slot === null)
    if (i === -1) throw new Error(`No available slots in room ${this.roomId}.`)
    return i
  }

  hasAvailableSlot() {
    return this.slots.includes(null)
  }

  fillNextAvailableSlot(client) {
    const i = this._findNextAvailableSlot()
    this.slots = this.slots.set(i, client)
    return i
  }

  /**
   * Vacates the slot taken by the client with given id.
   * @param id client to be removed
   * @returns {Client} removed Client
   */
  vacateSlotById(id) {
    const i = this.slots.findIndex(v => v && v.id === id)
    const client = this.slots.get(i)
    if (i === -1) throw new Error(`ID ${id} not found in room ${this.roomId}.`)
    this.slots = this.slots.set(i, null)

    return client
  }

  electNewLeader() {
    const newLeader = this.slots.find(v => v !== null)
    newLeader.isLeader = true
    return newLeader
  }
}
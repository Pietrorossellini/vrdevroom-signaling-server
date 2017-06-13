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

  fillNextAvailableSlot(id) {
    const i = this._findNextAvailableSlot()
    this.slots = this.slots.set(i, id)
    return i
  }

  vacateSlotById(id) {
    const i = this.slots.findIndex(v => v === id)
    if (i === -1) throw new Error(`ID ${id} not found in room ${this.roomId}.`)
    this.slots = this.slots.set(i, null)
  }
}
export default class Client {
  constructor(id, isLeader = false) {
    this.id = id
    this.isLeader = isLeader
  }
}
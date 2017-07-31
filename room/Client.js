export default class Client {
  constructor(id, name = 'Unknown', isLeader = false) {
    this.id = id
    this.name = name
    this.isLeader = isLeader
  }
}
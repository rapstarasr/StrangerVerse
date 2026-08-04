class QueueService {
  constructor() {
    this.waitingQueue = new Set();
  }

  add(socketId) {
    this.waitingQueue.add(socketId);
  }

  remove(socketId) {
    this.waitingQueue.delete(socketId);
  }

  has(socketId) {
    return this.waitingQueue.has(socketId);
  }

  get size() {
    return this.waitingQueue.size;
  }

  toArray() {
    return Array.from(this.waitingQueue);
  }

  takeTwo() {
    const socketIds = this.toArray();
    if (socketIds.length < 2) {
      return null;
    }

    const [first, second] = socketIds;
    this.waitingQueue.delete(first);
    this.waitingQueue.delete(second);
    return [first, second];
  }
}

module.exports = QueueService;

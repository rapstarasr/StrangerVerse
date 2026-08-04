class PairService {
  constructor() {
    this.activePairs = new Map();
    this.socketToPartner = new Map();
    this.socketToRoom = new Map();
  }

  getPartner(socketId) {
    return this.socketToPartner.get(socketId) || null;
  }

  getRoom(socketId) {
    return this.socketToRoom.get(socketId) || null;
  }

  pairUsers(user1, user2, roomName) {
    this.activePairs.set(user1, user2);
    this.activePairs.set(user2, user1);
    this.socketToPartner.set(user1, user2);
    this.socketToPartner.set(user2, user1);
    this.socketToRoom.set(user1, roomName);
    this.socketToRoom.set(user2, roomName);
  }

  removePair(socketId) {
    const partner = this.getPartner(socketId);

    if (!partner) {
      return null;
    }

    this.activePairs.delete(socketId);
    this.activePairs.delete(partner);
    this.socketToPartner.delete(socketId);
    this.socketToPartner.delete(partner);

    const roomName = this.socketToRoom.get(socketId) || this.socketToRoom.get(partner);
    this.socketToRoom.delete(socketId);
    this.socketToRoom.delete(partner);

    return { partner, roomName };
  }

  clearSocket(socketId) {
    const partner = this.getPartner(socketId);
    const roomName = this.getRoom(socketId);

    this.activePairs.delete(socketId);
    this.socketToPartner.delete(socketId);
    this.socketToRoom.delete(socketId);

    if (partner) {
      this.activePairs.delete(partner);
      this.socketToPartner.delete(partner);
      this.socketToRoom.delete(partner);
    }

    return { partner, roomName };
  }

  hasPair(socketId) {
    return this.socketToPartner.has(socketId);
  }
}

module.exports = PairService;

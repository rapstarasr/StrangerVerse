module.exports = function registerMatchmaking(io, state) {
  const { queueService, pairService } = state;

  return (socket) => {
    const tryMatch = async () => {
      if (pairService.hasPair(socket.id)) {
        return;
      }

      if (queueService.has(socket.id)) {
        socket.emit("waiting");
        return;
      }

      queueService.add(socket.id);
      socket.emit("waiting");

      const pair = queueService.takeTwo();
      if (!pair) {
        return;
      }

      const [firstSocketId, secondSocketId] = pair;
      const firstSocket = io.sockets.sockets.get(firstSocketId);
      const secondSocket = io.sockets.sockets.get(secondSocketId);

      if (!firstSocket || !secondSocket || !firstSocket.connected || !secondSocket.connected) {
        if (firstSocket?.connected) {
          firstSocket.emit("waiting");
        }
        if (secondSocket?.connected) {
          secondSocket.emit("waiting");
        }
        return;
      }

      const roomName = `pair:${[firstSocketId, secondSocketId].sort().join(":")}`;
      await Promise.all([firstSocket.join(roomName), secondSocket.join(roomName)]);
      pairService.pairUsers(firstSocketId, secondSocketId, roomName);
      firstSocket.emit("stranger-found");
      secondSocket.emit("stranger-found");
    };

    const handleNext = async () => {
      try {
        const currentPartner = pairService.getPartner(socket.id);
        const currentRoom = pairService.getRoom(socket.id);

        if (currentPartner) {
          const partnerSocket = io.sockets.sockets.get(currentPartner);
          if (partnerSocket && partnerSocket.connected) {
            partnerSocket.emit("partner-left");
          }

          if (currentRoom) {
            const roomMembers = io.sockets.adapter.rooms.get(currentRoom);
            if (roomMembers) {
              for (const memberId of Array.from(roomMembers)) {
                if (memberId === socket.id) {
                  continue;
                }

                const memberSocket = io.sockets.sockets.get(memberId);
                if (memberSocket && memberSocket.connected) {
                  memberSocket.leave(currentRoom).catch(() => undefined);
                }
              }
            }
          }

          pairService.clearSocket(socket.id);

          if (partnerSocket && partnerSocket.connected && !pairService.hasPair(partnerSocket.id) && !queueService.has(partnerSocket.id)) {
            queueService.add(partnerSocket.id);
            partnerSocket.emit("waiting");
          }
        }

        queueService.remove(socket.id);
        socket.emit("waiting");
        await tryMatch();
      } catch (error) {
        console.error(`Next handling failed for ${socket.id}`, error);
      }
    };

    socket.on("find-stranger", () => {
      tryMatch().catch((error) => {
        console.error(`Find stranger failed for ${socket.id}`, error);
      });
    });

    socket.on("next", () => {
      handleNext().catch((error) => {
        console.error(`Next handling failed for ${socket.id}`, error);
      });
    });
  };
};

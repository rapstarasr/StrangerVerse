module.exports = function registerTypingHandlers(io, state) {
  const { pairService } = state;

  return (socket) => {
    const forwardTyping = (eventName) => {
      try {
        const partner = pairService.getPartner(socket.id);
        if (!partner) {
          return;
        }

        io.to(partner).emit(eventName);
      } catch (error) {
        console.error(`Typing forwarding failed for ${socket.id}`, error);
      }
    };

    socket.on("typing", () => forwardTyping("typing"));
    socket.on("stop-typing", () => forwardTyping("stop-typing"));
  };
};

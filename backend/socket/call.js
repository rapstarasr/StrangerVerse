module.exports = function registerCallHandlers(io, state) {
  const { pairService } = state;

  return (socket) => {
    const sendToPartner = (event, data) => {
      try {
        const partner = pairService.getPartner(socket.id);

        if (!partner) {
          socket.emit("call-unavailable");
          return false;
        }

        io.to(partner).emit(event, data);
        return true;
      } catch (error) {
        console.error(`${event} failed for ${socket.id}`, error);
        return false;
      }
    };

    socket.on("call-user", (data) => {
      const mode = data && data.mode === "audio" ? "audio" : "video";
      sendToPartner("incoming-call", { mode });
    });

    socket.on("accept-call", () => {
      sendToPartner("call-accepted");
    });

    socket.on("reject-call", () => {
      sendToPartner("call-rejected");
    });

    socket.on("end-call", () => {
      sendToPartner("call-ended");
    });

    socket.on("webrtc-hangup", () => {
      sendToPartner("webrtc-hangup");
    });

    socket.on("webrtc-offer", (offer) => {
      sendToPartner("webrtc-offer", offer);
    });

    socket.on("webrtc-answer", (answer) => {
      sendToPartner("webrtc-answer", answer);
    });

    socket.on("webrtc-ice", (candidate) => {
      sendToPartner("webrtc-ice", candidate);
    });
  };
};

module.exports = function registerMessageHandlers(io, state) {
  const { pairService } = state;

  return (socket) => {
    const forwardToPartner = (eventName, payload) => {
      try {
        const partner = pairService.getPartner(socket.id);
        if (!partner) {
          return;
        }

        io.to(partner).emit(eventName, payload);
      } catch (error) {
        console.error(`Socket forwarding failed for ${socket.id}`, error);
      }
    };

    const sendMessage = (data) => {
      const partner = pairService.getPartner(socket.id);
      if (!partner) {
        return;
      }

      io.to(partner).emit("receive-message", data);
      socket.emit("message-sent", data.id);
    };

    const sendFile = (file) => {
      const partner = pairService.getPartner(socket.id);
      if (!partner) {
        return;
      }

      const enrichedFile = {
        ...file,
        uploadedAt: file.uploadedAt ?? Date.now(),
      };

      io.to(partner).emit("receive-file", enrichedFile);
      socket.emit("message-sent", enrichedFile.id);
    };

    socket.on("send-message", (data) => {
      try {
        sendMessage(data);
      } catch (error) {
        console.error(`send-message failed for ${socket.id}`, error);
      }
    });

    socket.on("message-delivered", (messageId) => {
      try {
        forwardToPartner("message-delivered", messageId);
      } catch (error) {
        console.error(`message-delivered failed for ${socket.id}`, error);
      }
    });

    socket.on("message-seen", (messageId) => {
      try {
        forwardToPartner("message-seen", messageId);
      } catch (error) {
        console.error(`message-seen failed for ${socket.id}`, error);
      }
    });

    socket.on("send-file", (file) => {
      try {
        sendFile(file);
      } catch (error) {
        console.error(`send-file failed for ${socket.id}`, error);
      }
    });

    socket.on("message-reaction", (payload) => {
      try {
        const partner = pairService.getPartner(socket.id);
        if (!partner) {
          return;
        }
        io.to(partner).emit("message-reaction", payload);
      } catch (error) {
        console.error(`message-reaction failed for ${socket.id}`, error);
      }
    });

    socket.onAny((eventName, payload) => {
      if (!eventName || eventName === "connect" || eventName === "disconnect" || eventName === "error") {
        return;
      }

      if (eventName === "send-message" || eventName === "send-file" || eventName === "message-delivered" || eventName === "message-seen" || eventName === "typing" || eventName === "stop-typing") {
        return;
      }

      if (eventName.startsWith("video-") || eventName.startsWith("webrtc-") || eventName.startsWith("signal")) {
        try {
          forwardToPartner(eventName, payload);
        } catch (error) {
          console.error(`Signal forwarding failed for ${socket.id}`, error);
        }
      }
    });
  };
};

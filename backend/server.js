const express = require("express");
const http = require("http");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const { PORT, FRONTEND_ORIGIN } = require("./utils/constants");
const UploadService = require("./services/uploadService");
const QueueService = require("./services/queueService");
const PairService = require("./services/pairService");
const registerUploadRoute = require("./routes/upload");
const registerMatchmaking = require("./socket/matchmaking");
const registerMessageHandlers = require("./socket/message");
const registerTypingHandlers = require("./socket/typing");
const registerCallHandlers = require("./socket/call");
const app = express();
app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

const uploadsDir = path.join(__dirname, "uploads");
const uploadService = new UploadService(uploadsDir);
app.use("/uploads", express.static(uploadService.uploadDir));

registerUploadRoute(app, uploadService);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const state = {
  connectedSockets: new Set(),
  queueService: new QueueService(),
  pairService: new PairService(),
  uploadService,
};

const emitOnlineUsers = () => {
  io.emit("online-users", state.connectedSockets.size);
};

const cleanupSocket = async (socket) => {
  const socketId = socket.id;
  if (!socketId) {
    return;
  }

  state.connectedSockets.delete(socketId);
  state.queueService.remove(socketId);

  const { partner, roomName } = state.pairService.clearSocket(socketId);

  if (roomName) {
    const roomMembers = io.sockets.adapter.rooms.get(roomName);
    if (roomMembers) {
      for (const memberId of Array.from(roomMembers)) {
        if (memberId === socketId) {
          continue;
        }

        const memberSocket = io.sockets.sockets.get(memberId);
        if (memberSocket && memberSocket.connected) {
          memberSocket.leave(roomName).catch(() => undefined);
        }
      }
    }
  }

  if (partner) {
    const partnerSocket = io.sockets.sockets.get(partner);
    if (partnerSocket && partnerSocket.connected) {
      partnerSocket.emit("partner-left");

      if (!state.pairService.hasPair(partner) && !state.queueService.has(partner)) {
        state.queueService.add(partner);
        partnerSocket.emit("waiting");
      }
    }
  }

  emitOnlineUsers();
};

app.get("/", (req, res) => {
  res.send("StrangerVerse Backend Running 🚀");
});

io.on("connection", (socket) => {
  state.connectedSockets.add(socket.id);
  emitOnlineUsers();

  registerMatchmaking(io, state)(socket);
  registerMessageHandlers(io, state)(socket);
  registerTypingHandlers(io, state)(socket);
  registerCallHandlers(io, state)(socket);

  socket.on("disconnect", () => {
    cleanupSocket(socket).catch((error) => {
      console.error("Failed to clean up disconnected socket", error);
    });
  });

  socket.on("error", (error) => {
    console.error(`Socket error for ${socket.id}`, error);
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Backend Running: http://localhost:${PORT}`);
});
const socketIo = require("socket.io");

let io;

const userSockets = {};

function initializeWebSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: [
        "http://localhost:3000"
      ],
      methods: ["GET", "POST"]
    },
  });

  io.on("connection", async (socket) => {
    console.log("WebSocket Connected");

    socket.on("message", (data) => {
      console.log("Received message:", data);
      io.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket Disconnected");
    });
  });
}

function emitPersonalityListUpdate(drugPersonalities) {
    io.emit("personalityListUpdate", drugPersonalities);
    console.log("Emitted personalityListUpdate:", drugPersonalities);
  }

// Export the io object
module.exports = {
    io,
  initializeWebSocket,
  emitPersonalityListUpdate
};

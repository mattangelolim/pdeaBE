const socketIo = require("socket.io")

let io;

const userSockets = {}

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
            // Handle the message and broadcast to other clients
            io.emit("message", data);
        });
    
        socket.on("disconnect", () => {
            console.log("WebSocket Disconnected");
            // Handle disconnect logic
        });
    });
    
}

module.exports = {
    initializeWebSocket
}
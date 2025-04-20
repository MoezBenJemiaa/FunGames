const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const loginRoute = require("./routes/loginRoute");
const connectDB = require("./db");

const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/login", loginRoute);

// 👇 Attach io instance to app so routes can access it
app.set("io", io);
app.use("/room", require("./routes/room"));

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("🔌 New client connected");

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);
    console.log(`👤 joined room ${roomCode}`);
  });
  socket.on("startGame", (roomCode) => {
    io.to(roomCode).emit("startGame");
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected");
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

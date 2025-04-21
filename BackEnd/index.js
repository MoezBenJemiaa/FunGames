const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");

const loginRoute = require("./routes/loginRoute");
const connectDB = require("./db");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = 5000;

app.use(cors());
app.use(express.json());
connectDB();

app.use("/login", loginRoute);
app.set("io", io);
app.use("/room", require("./routes/room"));

const Room = require("./models/Room");
let roomPlayers = {};
let roomTurns = {};
let startingTurn;

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  socket.on("joinRoom", (roomCode) => {
    socket.join(roomCode);

    if (!roomPlayers[roomCode]) roomPlayers[roomCode] = [];
    roomPlayers[roomCode].push(socket.id);
    console.log(`👤 Socket ${socket.id} joined room ${roomCode}`);
  });

  socket.on("choesTurn", (roomCode) => {
    console.log(`🌀 Choosing turn for room ${roomCode}`);
    startingTurn = Math.random() < 0.5 ? "X" : "O";
    io.to(roomCode).emit("choesTurn", startingTurn);
  });
  socket.on("gameOver", ({ roomCode, winner }) => {
    socket.to(roomCode).emit("gameOver", winner);
  });
  socket.on("resetGame", (roomCode) => {
    // Reset game state for all players in the room
      io.to(roomCode).emit("resetGame");
    
  });
  
  
  socket.on("startGame", (roomCode) => {
    const symbols = ["X", "O"];
    const startingSymbol = symbols[Math.floor(Math.random() * symbols.length)];

    io.to(roomCode).emit("startGame", { startingSymbol });
    console.log(`🎮 Game started in room ${roomCode} | First: ${startingSymbol}`);
  });

  socket.on("makeMove", ({ roomCode, index, symbol }) => {
    socket.to(roomCode).emit("opponentMove", { index, symbol });
  });

  socket.on("resetBoard", async (roomCode) => {
    try {
      const room = await Room.findOneAndUpdate(
        { code: roomCode },
        { $inc: { rounds: 1 } },
        { new: true }
      );
      io.to(roomCode).emit("resetBoard", room.rounds);
      console.log(`♻️ Board reset in room ${roomCode} | Round ${room.rounds}`);
    } catch (err) {
      console.error("❌ Error resetting round:", err);
    }
  });
  

  socket.on("deleteRoom", async (roomCode) => {
    try {
      await Room.findOneAndDelete({ code: roomCode });
      io.to(roomCode).emit("roomDeleted");
      delete roomPlayers[roomCode];
      console.log(`🗑️ Room ${roomCode} deleted`);
    } catch (err) {
      console.error("❌ Error deleting room:", err);
    }
  });



  socket.on("guessLetter", async ({ roomCode, letter, isCorrect, symbol }) => {
    console.log(`Starting turn for room ${roomCode}: ${startingTurn}`);
    console.log(`Player's symbol: ${symbol}`);
    
    // Validate that the player is guessing in the correct turn
    if (symbol !== startingTurn) {
      console.warn(`⛔ ${socket.id} (symbol: ${symbol}) tried to guess out of turn in room ${roomCode}`);
      return;
    }
  
    try {
      const roomDoc = await Room.findOne({ code: roomCode });
      if (!roomDoc || !roomDoc.players) {
        console.warn(`⚠️ Could not find valid player data for room ${roomCode}`);
        return;
      }
  
      // Emit the guess letter event to all players in the room
  
      // If incorrect, toggle the turn and update startingTurn
      if (!isCorrect) {
        startingTurn = startingTurn === "X" ? "O" : "X"; // Toggle between X and O
        console.log(`🎮 Turn changed to ${startingTurn} in room ${roomCode}`);
        
        // Emit to all players in the room
        io.to(roomCode).emit("guessLetter", { letter, isCorrect });
        io.to(roomCode).emit("choesTurn", startingTurn);
      }
      else{
        startingTurn = startingTurn === "X" ? "O" : "X"; // Toggle between X and O
        io.to(roomCode).emit("guessLetter", { letter, isCorrect });
        io.to(roomCode).emit("choesTurn", startingTurn);

      }
    } catch (err) {
      console.error("❌ Error handling guessLetter:", err);
    }
  });
  
  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
    for (const [roomCode, players] of Object.entries(roomPlayers)) {
      roomPlayers[roomCode] = players.filter((id) => id !== socket.id);
      if (roomPlayers[roomCode].length === 0) {
        delete roomPlayers[roomCode];
        console.log(`🚪 All players left room ${roomCode}`);
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

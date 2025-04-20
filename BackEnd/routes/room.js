const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Room = require("../models/Room");
const User = require("../models/User");

const jwtSecret = process.env.JWT_SECRET;



// Create Room
router.post("/create", async (req, res) => {
  const { code, nickname, character, rounds, game ,id} = req.body;
  const existing = await Room.findOne({ code });
  if (existing) return res.status(400).json({ message: "Room code already in use" });

  const room = new Room({
    code,
    game,
    rounds,
    players: [{ userId: id, nickname, character }]
  });

  await room.save();
  res.json({ message: "Room created", room });
});

// Join Room
router.post("/join", async (req, res) => {
  const { code, nickname, character, id } = req.body;
  const room = await Room.findOne({ code });
  if (!room) return res.status(404).json({ message: "Room not found" });

  if (room.players.length >= 2) return res.status(400).json({ message: "Room is full" });

  const alreadyJoined = room.players.find(p => p.userId.toString() === id);
  if (alreadyJoined) return res.status(400).json({ message: "You already joined this room" });

  room.players.push({ userId: id, nickname, character });
  await room.save();

  // Emit to Socket.IO room
  const io = req.app.get("io");
  io.to(code).emit("playerJoined", { nickname, character });

  res.json({ message: "Joined room", room });
});

module.exports = router;

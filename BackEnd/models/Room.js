const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  game: String,
  rounds: Number,
  players: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      nickname: String,
      character: String
    }
  ]
});

module.exports = mongoose.model("Room", RoomSchema);

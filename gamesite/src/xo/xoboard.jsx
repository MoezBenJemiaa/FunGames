import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import styles from "./xoboard.module.css";

import finnImage from "../assets/finn.jpeg";
import bmoImage from "../assets/bmo.jpeg";
import jakeImage from "../assets/jake.jpeg";
import marcelineImage from "../assets/marceline.jpg";

const characterImages = {
  Finn: finnImage,
  Jake: jakeImage,
  BMO: bmoImage,
  Marceline: marcelineImage,
};

const socket = io("http://localhost:5000");
const initialBoard = Array(9).fill("");

export default function XOGame() {
  const [round, setRound] = useState(1);
  const [maxRound, setmaxRound] = useState(1);
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(initialBoard);
  const [symbol, setSymbol] = useState("");
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [message, setMessage] = useState("Waiting for opponent...");
  const [players, setPlayers] = useState([]);

  const token = localStorage.getItem("token");
  const { id: userId } = jwtDecode(token);

  useEffect(() => {
    socket.emit("joinRoom", roomCode);

    fetch(`http://localhost:5000/room/${roomCode}`)
      .then((res) => res.json())
      .then((data) => {
        setPlayers(data.players);
        setmaxRound(data.rounds);
        const assignedSymbol = data.players[0].userId === userId ? "X" : "O";
        setSymbol(assignedSymbol);

        if (data.players.length === 2) {
          socket.emit("choesTurn", roomCode);
        }
      });

    socket.on("choesTurn", (startingTurn) => {
      setTurn(startingTurn);
      setMessage(startingTurn === symbol ? "Your turn!" : "Opponent's turn!");
    });

    socket.on("opponentMove", ({ index, symbol: opponentSymbol }) => {
      setBoard((prev) => {
        const updated = [...prev];
        updated[index] = opponentSymbol;
        return updated;
      });
      const nextTurn = opponentSymbol === "X" ? "O" : "X";
      setTurn(nextTurn);
      setMessage(nextTurn === symbol ? "Your turn!" : "Opponent's turn!");
    });

    socket.on("resetBoard", (newRound) => {
      setBoard(initialBoard);
      setWinner("");
      setRound((prev) => prev + 1); // 👈 Update round number
      setMessage(turn === symbol ? "Your turn!" : "Opponent's turn!");
    });

    socket.on("roomDeleted", () => {
      navigate("/");
    });
    socket.on("gameOver", (win) => {
      setWinner(win);
      setMessage(
        win === "Draw" ? "It's a draw!" : `${getPlayerName(win)} wins!`
      );
    });

    return () => {
      socket.off("choesTurn");
      socket.off("opponentMove");
      socket.off("resetBoard");
      socket.off("roomDeleted");
      socket.off("gameOver");
    };
  }, [roomCode, symbol]);

  const checkWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let [a, b, c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c])
        return board[a];
    }
    if (board.every((cell) => cell)) return "Draw";
    return "";
  };

  const handleClick = (index) => {
    if (board[index] || winner || turn !== symbol) return;

    const updatedBoard = [...board];
    updatedBoard[index] = symbol;
    setBoard(updatedBoard);

    const win = checkWinner(updatedBoard);
    if (win) {
      setWinner(win);
      setMessage(win === "Draw" ? "It's a draw!" : `${win} wins!`);

      // 👉 Emit game over event to opponent
      socket.emit("gameOver", { roomCode, winner: win });
    } else {
      const nextTurn = symbol === "X" ? "O" : "X";
      setTurn(nextTurn);
      setMessage(nextTurn === symbol ? "Your turn!" : "Opponent's turn!");
      socket.emit("makeMove", { roomCode, index, symbol });
    }
  };

  const handleReset = () => {
    socket.emit("resetBoard", roomCode);
  };

  const handleExit = () => {
    socket.emit("deleteRoom", roomCode);
    navigate("/");
  };

  const getPlayer = (sym) => {
    const idx = sym === "X" ? 0 : 1;
    return players[idx] || {};
  };

  const you = getPlayer(symbol);
  const opponent = getPlayer(symbol === "X" ? "O" : "X");

  const getPlayerName = (sym) => {
    const player = getPlayer(sym);
    return player?.nickname || sym; // fallback to symbol if no nickname
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>XO Game 🎮</h1>
      <p className={styles.turnMessage}>{message}</p>
      <p className={styles.round}>
        Round: {round} / {maxRound}{" "}
      </p>

      <div className={styles.board}>
        {board.map((cell, idx) => (
          <div
            key={idx}
            className={`${styles.cell} ${
              cell === "X" ? styles.xCell : cell === "O" ? styles.oCell : ""
            }`}
            onClick={() => handleClick(idx)}
          >
            {cell}
          </div>
        ))}
      </div>

      {winner && (
        <div className={styles.popup}>
          <h2>
            {winner === "Draw"
              ? "It's a Draw!"
              : `${getPlayerName(winner)} Wins!`}
          </h2>
          {maxRound > round && (
            <button onClick={handleReset}>Play Again</button>
          )}
          <button onClick={handleExit}>Exit</button>
        </div>
      )}

      <div className={styles.players}>
        {opponent?.nickname && (
          <div className={styles.playerInfo}>
            <img
              src={characterImages[opponent.character]}
              alt={opponent.nickname}
            />
            <p>{opponent.nickname}</p>
          </div>
        )}
        {you?.nickname && (
          <div className={styles.playerInfo}>
            <img src={characterImages[you.character]} alt={you.nickname} />
            <p>{you.nickname} (You)</p>
          </div>
        )}
      </div>
    </div>
  );
}

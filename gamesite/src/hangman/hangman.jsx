import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { jwtDecode } from "jwt-decode";
import styles from "./hangman.module.css";

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

export default function HangmanGame() {
  const [word, setWord] = useState("example"); // Replace with actual word logic
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [remainingTries, setRemainingTries] = useState(6);
  const [message, setMessage] = useState("Waiting for opponent...");
  const [round, setRound] = useState(1);
  const [maxRound, setMaxRound] = useState(1);
  const [players, setPlayers] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [turn, setTurn] = useState("");
  const [winner, setWinner] = useState("");
  const [gameOver, setGameOver] = useState(false);

  const { roomCode } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { id: userId } = jwtDecode(token);

  useEffect(() => {
    socket.emit("joinRoom", roomCode);

    fetch(`http://localhost:5000/room/${roomCode}`)
      .then(res => res.json())
      .then(data => {
        setPlayers(data.players);
        setMaxRound(data.rounds);

        const assignedSymbol = data.players[0].userId === userId ? "X" : "O";
        setSymbol(assignedSymbol);

        if (data.players.length === 2 && assignedSymbol === "X") {
          socket.emit("choesTurn", roomCode);
        }
      });

    socket.on("choesTurn", (startingTurn) => {
      setTurn(startingTurn);
    });

    socket.on("guessLetter", ({ letter, isCorrect }) => {
      setGuessedLetters(prev => [...prev, letter]);
      if (!isCorrect) {
        setRemainingTries(prev => prev - 1);
      }
      setTurn(prev => (symbol === "O" ? "X" : "O"));
    });

    socket.on("resetHangman", (newRound) => {
      setGuessedLetters([]);
      setRemainingTries(6);
      setWinner("");
      setGameOver(false);
    });

    socket.on("gameOver", (winSymbol) => {
      setWinner(winSymbol);
      setGameOver(true);

      if (winSymbol === "Draw") {
        setMessage("It's a draw!");
        return;
      }

      const playerSymbol = players[0]?.userId === userId ? "X" : "O";
      const winnerPlayer = players.find(p => {
        return (players[0].userId === p.userId ? "X" : "O") === winSymbol;
      });

      if (winSymbol === playerSymbol) {
        setMessage(`🎉 You win, ${winnerPlayer?.nickname || "Player"}!`);
      } else {
        setMessage(`${winnerPlayer?.nickname || "Opponent"} wins! 😢`);
      }
    });

    socket.on("roomDeleted", () => navigate("/"));

    socket.on("resetGame", () => {
      setRound(1); // Reset round counter
      setGuessedLetters([]); // Clear guessed letters
      setRemainingTries(6); // Reset tries
      setWinner(""); // Clear winner
      setGameOver(false); // Game isn't over anymore
    });

    return () => {
      socket.off("choesTurn");
      socket.off("guessLetter");
      socket.off("resetHangman");
      socket.off("gameOver");
      socket.off("roomDeleted");
    };
  }, [roomCode]);

  useEffect(() => {
    if (!symbol || !turn) return;
    setMessage(turn === symbol ? "Your turn to guess!" : "Opponent's turn!");
  }, [symbol, turn]);

  const handleGuess = (letter) => {
    if (turn !== symbol || guessedLetters.includes(letter) || winner || remainingTries <= 0) return;

    const isCorrect = word.includes(letter);
    const newGuessedLetters = [...guessedLetters, letter];

    if (isCorrect) {
      const uniqueLetters = [...new Set(word.split(""))];
      const allGuessed = uniqueLetters.every(l => newGuessedLetters.includes(l));

      if (allGuessed) {
        socket.emit("guessLetter", { roomCode, letter, isCorrect, symbol });
        setGuessedLetters(newGuessedLetters);
        setWinner(symbol);
        setGameOver(true);
        socket.emit("gameOver", { roomCode, winner: symbol }); // ✅ FIXED
        return;
      }
    }

    socket.emit("guessLetter", { roomCode, letter, isCorrect, symbol });
  };

  const handleReset = () => {
    setRound(prev => prev + 1);
    socket.emit("resetGame", roomCode); // Corrected the event name
  };

  const handleExit = () => {
    socket.emit("deleteRoom", roomCode);
    navigate("/");
  };

  const renderWord = () => {
    return word
      .split("")
      .map((char, idx) => (guessedLetters.includes(char) ? char : "_"))
      .join(" ");
  };

  useEffect(() => {
    if (remainingTries <= 0 && !gameOver) {
      setGameOver(true);
      setWinner("Draw");
      socket.emit("gameOver", { roomCode, winner: "Draw" }); // ✅ FIXED
    }
  }, [remainingTries]);

  const you = players.find(p => p.userId === userId);
  const opponent = players.find(p => p.userId !== userId);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hangman Game 🎯</h1>
      <p className={styles.turnMessage}>{message}</p>
      <p className={styles.round}>Round: {round} / {maxRound}</p>
      <p className={styles.word}>{renderWord()}</p>
      <p className={styles.tries}>Tries left: {remainingTries}</p>

      <div className={styles.keyboard}>
        {"abcdefghijklmnopqrstuvwxyz".split("").map(letter => (
          <button
            key={letter}
            onClick={() => handleGuess(letter)}
            disabled={guessedLetters.includes(letter) || remainingTries <= 0}
          >
            {letter}
          </button>
        ))}
      </div>

      {gameOver && (
        <div className={styles.popup}>
          <h2>
            {winner === "Draw"
              ? "It's a Draw!"
              : symbol === winner
              ? `🎉 You Win, ${you?.nickname || "You"}!`
              : `${opponent?.nickname || "Opponent"} Wins! 😢`}
          </h2>
          {maxRound > round && <button onClick={handleReset}>Play Again</button>}
          <button onClick={handleExit}>Exit</button>
        </div>
      )}

      <div className={styles.players}>
        {opponent && (
          <div className={styles.playerInfo}>
            <img src={characterImages[opponent.character]} alt={opponent.nickname} />
            <p>{opponent.nickname}</p>
          </div>
        )}
        {you && (
          <div className={styles.playerInfo}>
            <img src={characterImages[you.character]} alt={you.nickname} />
            <p>{you.nickname} (You)</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './RoomManager.module.css';
import { jwtDecode } from "jwt-decode";
import finnImage from "../assets/finn.jpeg";
import bmoImage from "../assets/bmo.jpeg";
import jakeImage from "../assets/jake.jpeg";
import marcelineImage from "../assets/marceline.jpg";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const characters = ['Finn', 'Jake', 'BMO', 'Marceline'];
const games = ['XO', 'Hangman'];
const roundsOptions = [1, 3, 6];

const characterImages = {
  Finn: finnImage,
  Jake: jakeImage,
  BMO: bmoImage,
  Marceline: marcelineImage
};

function getRandomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function RoomManager({ selectedGame = "XO" }) {
  const navigate = useNavigate();
  const [game, setGame] = useState(selectedGame);
  const [activeTab, setActiveTab] = useState('create');
  const [roomCode, setRoomCode] = useState(getRandomCode());
  const [joinCode, setJoinCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [character, setCharacter] = useState(characters[0]);
  const [rounds, setRounds] = useState(1);
  const [roomCreated, setRoomCreated] = useState(false);
  const [playerJoined, setPlayerJoined] = useState(false);
  const [joinedPlayer, setJoinedPlayer] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const createRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const { id } = jwtDecode(token);
      const response = await axios.post("http://localhost:5000/room/create", {
        code: roomCode,
        nickname,
        character,
        rounds,
        game,
        id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRoomCreated(true);
      setIsHost(true);
      socket.emit("joinRoom", roomCode);
    } catch (err) {
      alert(err.response?.data?.message || "Room creation failed");
    }
  };

  const joinRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      const { id } = jwtDecode(token);
      const response = await axios.post("http://localhost:5000/room/join", {
        code: joinCode,
        nickname,
        character,
        id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRoomCode(joinCode);
      setPlayerJoined(true);
      setIsHost(false);
      socket.emit("joinRoom", joinCode);
    } catch (err) {
      alert(err.response?.data?.message || "Join failed");
    }
  };

  const handleStartGame = () => {
    socket.emit("startGame", roomCode);
  };

  useEffect(() => {
    socket.on("playerJoined", (player) => {
      setPlayerJoined(true);
      setJoinedPlayer(player);
    });

    socket.on("startGame", () => {
      setGameStarted(true);
    });

    return () => {
      socket.off("playerJoined");
      socket.off("startGame");
    };
  }, []);

  useEffect(() => {
    if (gameStarted) {
      navigate(`/game/${roomCode}`);
    }
  }, [gameStarted]);

  const handleCharacterSelect = (name) => {
    setCharacter(name);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>🎮 Game Lobby</h1>

      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'create' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Create Room
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'join' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('join')}
        >
          Join Room
        </button>
      </div>

      {activeTab === 'create' && (
        <div>
          <p className={styles.label}>Room Code: <strong>{roomCode}</strong></p>
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Nickname"
            className={styles.input}
          />

          <div className={styles.characterGrid}>
            {characters.map(c => (
              <div
                key={c}
                className={`${styles.characterCard} ${character === c ? styles.selected : ''}`}
                onClick={() => handleCharacterSelect(c)}
              >
                <img src={characterImages[c]} alt={c} className={styles.characterImage} />
                <p>{c}</p>
              </div>
            ))}
          </div>

          <select value={rounds} onChange={e => setRounds(Number(e.target.value))} className={styles.select}>
            {roundsOptions.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={game} onChange={e => setGame(e.target.value)} className={styles.select}>
            {games.map(g => <option key={g}>{g}</option>)}
          </select>
          {!roomCreated && (
            <button className={styles.actionButton} onClick={createRoom}>
            Create Room 🚀
           </button>
          )}
        </div>
      )}

      {activeTab === 'join' && (
        <div>
          <input
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
            placeholder="Room Code"
            className={styles.input}
          />
          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Nickname"
            className={styles.input}
          />

          <div className={styles.characterGrid}>
            {characters.map(c => (
              <div
                key={c}
                className={`${styles.characterCard} ${character === c ? styles.selected : ''}`}
                onClick={() => handleCharacterSelect(c)}
              >
                <img src={characterImages[c]} alt={c} className={styles.characterImage} />
                <p>{c}</p>
              </div>
            ))}
          </div>

          <button onClick={joinRoom} className={styles.actionButton}>Join</button>
        </div>
      )}

      {roomCreated && !playerJoined && (
        <div>
          <h2>Waiting for a player to join room <strong>{roomCode}</strong>...</h2>
        </div>
      )}

      {roomCreated && playerJoined && !gameStarted && isHost && (
        <div>
          <h2>Player <strong>{joinedPlayer?.nickname}</strong> joined!</h2>
          <p>Character: {joinedPlayer?.character}</p>
          <button onClick={handleStartGame} className={styles.actionButton}>Start Game</button>
        </div>
      )}

      {!isHost && playerJoined && !gameStarted && (
        <div>
          <h2>Waiting for host to start the game...</h2>
        </div>
      )}

      {gameStarted && (
        <div>
          <h2>Game starting!</h2>
        </div>
      )}
    </div>
  );
}

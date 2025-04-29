import { Routes, Route, useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./home/home";
import LoginPage from "./login/YetiLogin";
import Xo from "./xo/xoboard";
import Hungman from "./hangman/hangman";
import Snake from "./Snake/snake";
import NotFoundPage from "./404/404";
import ProfilePage from "./Profile/profile";

function GameRouteHandler() {
  const { roomCode } = useParams();
  const [component, setComponent] = useState(<div>Loading...</div>);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/room/${roomCode}`);
        if (!res.ok) throw new Error("Room not found");
        const room = await res.json();

        switch (room.game) {
          case "XO":
            setComponent(<Xo />);
            break;
          case "Hangman":
            setComponent(<Hungman />);
            break;
          default:
            setComponent(<NotFoundPage />);
        }
      } catch (err) {
        setComponent(<NotFoundPage />);
      }
    };

    fetchRoom();
  }, [roomCode]);

  return component;
}

function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/game/:roomCode" element={<GameRouteHandler />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/Snake" element={<Snake />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;

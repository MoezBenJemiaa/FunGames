import { Routes, Route } from "react-router-dom";
import HomePage from "./home/home";
import LoginPage from "./login/YetiLogin";
import Xo from "./xo/xoboard";
import Hungman from "./hangman/hangman";

function App() {
  return (
    <>
      <Routes>
        <Route path="/game/:roomCode" element={<Hungman/>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;

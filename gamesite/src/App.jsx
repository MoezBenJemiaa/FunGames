import { Routes, Route } from "react-router-dom";
import HomePage from "./home/home";
import LoginPage from "./login/YetiLogin";
import Xo from "./xo/xoboard";

function App() {
  return (
    <>
      <Routes>
        <Route path="/game/:roomCode" element={<Xo/>} />
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;

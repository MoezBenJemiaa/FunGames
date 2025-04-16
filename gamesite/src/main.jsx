import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 👈 Import BrowserRouter
import "./index.css";
import App from "./App.jsx";
import XOBoard from "./xo/xoboard.jsx";
import Header from "./header/header.jsx";
import HomePage from "./home/home.jsx";
import GameCard from "./game/gamecard.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  </StrictMode>
);

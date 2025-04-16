import { Routes, Route } from "react-router-dom";
import HomePage from "./home/home";
import LoginPage from "./login/login";
import Header from "./header/header";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;

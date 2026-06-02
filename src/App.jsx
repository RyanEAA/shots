import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { login } from "./services/auth";


import Lobby from "./pages/Lobby";
import Game from "./pages/Game";

function App() {
  useEffect(() => {
    login();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:gameId" element={<Game />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
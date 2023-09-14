import MainPage from "./MainPage";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import MatrixComponent from "./MatrixComponent";
import { useState } from "react";
import { GameValueContext } from "./hooks/gameValueContext";

function App() {
  const [format, setFormat] = useState(0);

  return (
    <Router>
      <GameValueContext.Provider value={{ format, setFormat }}>
        <Routes >
          <Route path="/" element={<MainPage />} />
          <Route path="/game" element={<MatrixComponent />} />
        </Routes>
      </GameValueContext.Provider>
    </Router>
  );
}

export default App;

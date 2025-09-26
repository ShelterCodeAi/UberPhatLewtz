import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import GameCategory from './pages/GameCategory';
import SnakeGame from './games/SnakeGame';
import TicTacToe from './games/TicTacToe';
import ConnectFour from './games/ConnectFour';
import TextAdventure from './games/TextAdventure';
import ResourceManager from './games/ResourceManager';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:categoryId" element={<GameCategory />} />
          <Route path="/game/snake" element={<SnakeGame />} />
          <Route path="/game/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/game/connect-four" element={<ConnectFour />} />
          <Route path="/game/text-adventure" element={<TextAdventure />} />
          <Route path="/game/resource-manager" element={<ResourceManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

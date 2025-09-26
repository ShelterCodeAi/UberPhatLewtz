import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Game {
  id: string;
  name: string;
  players: string;
}

interface GameCategory {
  id: string;
  name: string;
  games: Game[];
}

interface GamesResponse {
  categories: GameCategory[];
}

const Home: React.FC = () => {
  const [categories, setCategories] = useState<GameCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get<GamesResponse>('http://localhost:5000/api/games');
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Error fetching games:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="category-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-header">
        <h1>UberPhatLewtz Gaming Platform</h1>
        <p>Welcome to the ultimate online gaming experience! Choose from various game categories and start playing now.</p>
      </div>
      
      <div className="game-grid">
        {categories.map((category) => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`} 
            className="game-card"
          >
            <h3>{category.name}</h3>
            <p>{category.games.length} game{category.games.length !== 1 ? 's' : ''} available</p>
          </Link>
        ))}
      </div>
      
      <div className="category-header" style={{ marginTop: '60px' }}>
        <h2>Featured Games</h2>
        <div className="game-grid">
          <Link to="/game/snake" className="game-card">
            <h3>🐍 Snake Game</h3>
            <p>Classic arcade game - eat the food and grow longer!</p>
          </Link>
          <Link to="/game/tic-tac-toe" className="game-card">
            <h3>❌ Tic Tac Toe</h3>
            <p>Multiplayer strategy game - get three in a row to win!</p>
          </Link>
          <Link to="/game/connect-four" className="game-card">
            <h3>🔴 Connect Four</h3>
            <p>Drop discs and connect four in a row to win!</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
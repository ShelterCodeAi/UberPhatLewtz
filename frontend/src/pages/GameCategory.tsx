import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

interface Game {
  id: string;
  name: string;
  players: string;
}

interface GameCategoryData {
  id: string;
  name: string;
  games: Game[];
}

const GameCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<GameCategoryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        const foundCategory = response.data.categories.find(
          (cat: GameCategoryData) => cat.id === categoryId
        );
        setCategory(foundCategory || null);
      } catch (error) {
        console.error('Error fetching category:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="container">
        <div className="category-header">
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container">
        <div className="category-header">
          <h1>Category Not Found</h1>
          <p>The requested game category could not be found.</p>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-header">
        <h1>{category.name}</h1>
        <p>Choose a game from this category to start playing!</p>
      </div>
      
      <div className="game-grid">
        {category.games.map((game) => (
          <Link 
            key={game.id} 
            to={`/game/${game.id}`} 
            className="game-card"
          >
            <h3>{game.name}</h3>
            <p>Players: {game.players}</p>
          </Link>
        ))}
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default GameCategory;
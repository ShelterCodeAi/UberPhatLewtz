import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Position {
  x: number;
  y: number;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
const INITIAL_FOOD: Position = { x: 15, y: 15 };

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback((): Position => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  }, []);

  const checkCollision = useCallback((head: Position, snakeBody: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      return true;
    }
    
    // Self collision
    return snakeBody.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameOver || !gameStarted) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      head.x += direction.x;
      head.y += direction.y;

      if (checkCollision(head, newSnake)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore(score => score + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, checkCollision, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameInterval = setInterval(moveSnake, 150);
      return () => clearInterval(gameInterval);
    }
  }, [moveSnake, gameStarted, gameOver]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(generateFood());
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="container">
      <div className="category-header">
        <h1>🐍 Snake Game</h1>
        <p>Use arrow keys to control the snake. Eat the food to grow and increase your score!</p>
      </div>
      
      <div className="game-board">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Score: {score}</h3>
          {!gameStarted && !gameOver && (
            <button className="btn" onClick={startGame}>Start Game</button>
          )}
          {gameOver && (
            <div>
              <h3 style={{ color: '#ff6b6b' }}>Game Over!</h3>
              <button className="btn" onClick={startGame}>Play Again</button>
            </div>
          )}
          <button className="btn" onClick={resetGame} style={{ marginLeft: '10px' }}>
            Reset
          </button>
        </div>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
            gap: '1px',
            backgroundColor: '#333',
            padding: '10px',
            borderRadius: '10px',
            margin: '0 auto',
            width: 'fit-content'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snake.some(segment => segment.x === x && segment.y === y);
            const isFood = food.x === x && food.y === y;
            const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
            
            return (
              <div
                key={index}
                style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: isSnake 
                    ? (isHead ? '#4ecdc4' : '#ff6b6b')
                    : isFood 
                    ? '#ffeb3b'
                    : '#111',
                  borderRadius: isFood ? '50%' : '2px'
                }}
              />
            );
          })}
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default SnakeGame;
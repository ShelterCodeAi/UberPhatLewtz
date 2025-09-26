import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

interface GameState {
  board: (string | null)[][];
  currentPlayer: string;
  winner: string | null;
}

const ConnectFour: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>({
    board: Array(6).fill(null).map(() => Array(7).fill(null)),
    currentPlayer: 'red',
    winner: null
  });
  const [isConnected, setIsConnected] = useState(false);
  const [players, setPlayers] = useState<any[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('joined-game', (data) => {
      setIsConnected(true);
      setPlayers(data.players);
    });

    newSocket.on('player-joined', (data) => {
      console.log('Player joined:', data);
    });

    newSocket.on('c4-update', (newGameState) => {
      setGameState(newGameState);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const joinGame = () => {
    if (socket && gameId.trim() && playerName.trim()) {
      socket.emit('join-game', {
        gameId: gameId.trim(),
        playerId: socket.id,
        playerName: playerName.trim(),
        gameType: 'connect-four'
      });
    }
  };

  const makeMove = (column: number) => {
    if (socket && isConnected && !gameState.winner) {
      // Check if column is full
      if (gameState.board[0][column] === null) {
        socket.emit('c4-move', {
          gameId,
          column,
          player: gameState.currentPlayer
        });
      }
    }
  };

  const resetGame = () => {
    setGameState({
      board: Array(6).fill(null).map(() => Array(7).fill(null)),
      currentPlayer: 'red',
      winner: null
    });
    setIsConnected(false);
    setPlayers([]);
    setGameId('');
    setPlayerName('');
  };

  if (!isConnected) {
    return (
      <div className="container">
        <div className="category-header">
          <h1>🔴 Connect Four</h1>
          <p>Join a game room to play with another player!</p>
        </div>
        
        <div className="game-board">
          <div style={{ textAlign: 'center' }}>
            <h3>Join Game</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{
                  padding: '10px',
                  margin: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
            </div>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Enter game room ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                style={{
                  padding: '10px',
                  margin: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
            </div>
            <button 
              className="btn" 
              onClick={joinGame}
              disabled={!gameId.trim() || !playerName.trim()}
            >
              Join Game
            </button>
            <p style={{ marginTop: '20px', opacity: 0.8 }}>
              Use any room ID (e.g., "room1") to create or join a game room.
            </p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Link to="/" className="btn">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-header">
        <h1>🔴 Connect Four</h1>
        <p>Drop your discs to get four in a row!</p>
      </div>
      
      <div className="game-board">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Room: {gameId}</h3>
          <p>Players: {players.length}/2</p>
          {gameState.winner ? (
            <h3 style={{ color: gameState.winner === 'red' ? '#ff6b6b' : '#ffeb3b' }}>
              {gameState.winner === 'red' ? 'Red' : 'Yellow'} player wins!
            </h3>
          ) : (
            <h3>
              Current Player: 
              <span style={{ color: gameState.currentPlayer === 'red' ? '#ff6b6b' : '#ffeb3b' }}>
                {gameState.currentPlayer === 'red' ? ' Red' : ' Yellow'}
              </span>
            </h3>
          )}
        </div>
        
        {/* Column buttons */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 50px)',
            gap: '5px',
            margin: '0 auto 10px auto',
            width: 'fit-content'
          }}
        >
          {Array.from({ length: 7 }).map((_, colIndex) => (
            <button
              key={colIndex}
              onClick={() => makeMove(colIndex)}
              disabled={gameState.winner !== null || gameState.board[0][colIndex] !== null}
              className="btn"
              style={{
                width: '50px',
                height: '30px',
                padding: '5px',
                fontSize: '12px'
              }}
            >
              ↓
            </button>
          ))}
        </div>
        
        {/* Game board */}
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 50px)',
            gridTemplateRows: 'repeat(6, 50px)',
            gap: '5px',
            margin: '0 auto',
            width: 'fit-content',
            backgroundColor: '#2196F3',
            padding: '10px',
            borderRadius: '10px'
          }}
        >
          {gameState.board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: cell === 'red' 
                    ? '#ff6b6b' 
                    : cell === 'yellow' 
                    ? '#ffeb3b' 
                    : 'white',
                  border: '2px solid #333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            ))
          )}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button className="btn" onClick={resetGame}>
            Leave Game
          </button>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default ConnectFour;
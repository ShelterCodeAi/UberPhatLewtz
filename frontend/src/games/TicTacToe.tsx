import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import io, { Socket } from 'socket.io-client';

interface GameState {
  board: (string | null)[];
  currentPlayer: string;
  winner: string | null;
}

const TicTacToe: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [gameState, setGameState] = useState<GameState>({
    board: Array(9).fill(null),
    currentPlayer: 'X',
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

    newSocket.on('ttt-update', (newGameState) => {
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
        gameType: 'tic-tac-toe'
      });
    }
  };

  const makeMove = (position: number) => {
    if (socket && isConnected && gameState.board[position] === null && !gameState.winner) {
      socket.emit('ttt-move', {
        gameId,
        position,
        player: gameState.currentPlayer
      });
    }
  };

  const resetGame = () => {
    setGameState({
      board: Array(9).fill(null),
      currentPlayer: 'X',
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
          <h1>❌ Tic Tac Toe</h1>
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
        <h1>❌ Tic Tac Toe</h1>
        <p>Get three in a row to win!</p>
      </div>
      
      <div className="game-board">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3>Room: {gameId}</h3>
          <p>Players: {players.length}/2</p>
          {gameState.winner ? (
            <h3 style={{ color: gameState.winner === 'tie' ? '#ffeb3b' : '#4ecdc4' }}>
              {gameState.winner === 'tie' ? "It's a tie!" : `Player ${gameState.winner} wins!`}
            </h3>
          ) : (
            <h3>Current Player: {gameState.currentPlayer}</h3>
          )}
        </div>
        
        <div 
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 80px)',
            gridTemplateRows: 'repeat(3, 80px)',
            gap: '5px',
            margin: '0 auto',
            width: 'fit-content'
          }}
        >
          {gameState.board.map((cell, index) => (
            <button
              key={index}
              onClick={() => makeMove(index)}
              disabled={cell !== null || gameState.winner !== null}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '24px',
                fontWeight: 'bold',
                backgroundColor: cell ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                color: cell === 'X' ? '#ff6b6b' : '#4ecdc4',
                cursor: cell === null && !gameState.winner ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease'
              }}
            >
              {cell}
            </button>
          ))}
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

export default TicTacToe;
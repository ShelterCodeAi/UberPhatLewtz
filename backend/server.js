const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Game state storage (in production, use a database)
const gameRooms = new Map();
const players = new Map();

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', timestamp: new Date().toISOString() });
});

app.get('/api/games', (req, res) => {
  res.json({
    categories: [
      {
        id: 'rpg',
        name: 'Role Playing Games',
        games: [
          { id: 'text-adventure', name: 'Text Adventure', players: 'single' }
        ]
      },
      {
        id: 'rts',
        name: 'Real Time Strategy',
        games: [
          { id: 'resource-manager', name: 'Resource Manager', players: 'single' }
        ]
      },
      {
        id: 'arcade',
        name: 'Arcade Games',
        games: [
          { id: 'snake', name: 'Snake Game', players: 'single' }
        ]
      },
      {
        id: 'multiplayer',
        name: 'Multiplayer Games',
        games: [
          { id: 'tic-tac-toe', name: 'Tic Tac Toe', players: 'multiplayer' }
        ]
      },
      {
        id: 'board',
        name: 'Board Games',
        games: [
          { id: 'connect-four', name: 'Connect Four', players: 'multiplayer' }
        ]
      }
    ]
  });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Player joins a game room
  socket.on('join-game', (data) => {
    const { gameId, playerId, playerName } = data;
    
    socket.join(gameId);
    players.set(socket.id, { playerId, playerName, gameId });
    
    if (!gameRooms.has(gameId)) {
      gameRooms.set(gameId, {
        players: [],
        gameState: {},
        gameType: data.gameType || 'unknown'
      });
    }
    
    const room = gameRooms.get(gameId);
    room.players.push({ socketId: socket.id, playerId, playerName });
    
    socket.emit('joined-game', { gameId, players: room.players });
    socket.to(gameId).emit('player-joined', { playerId, playerName });
    
    console.log(`Player ${playerName} joined game ${gameId}`);
  });

  // Handle tic-tac-toe moves
  socket.on('ttt-move', (data) => {
    const { gameId, position, player } = data;
    const room = gameRooms.get(gameId);
    
    if (room) {
      if (!room.gameState.board) {
        room.gameState.board = Array(9).fill(null);
        room.gameState.currentPlayer = 'X';
        room.gameState.winner = null;
      }
      
      if (room.gameState.board[position] === null && !room.gameState.winner) {
        room.gameState.board[position] = room.gameState.currentPlayer;
        room.gameState.currentPlayer = room.gameState.currentPlayer === 'X' ? 'O' : 'X';
        
        // Check for winner
        const winner = checkTicTacToeWinner(room.gameState.board);
        if (winner) {
          room.gameState.winner = winner;
        }
        
        io.to(gameId).emit('ttt-update', room.gameState);
      }
    }
  });

  // Handle connect-four moves
  socket.on('c4-move', (data) => {
    const { gameId, column, player } = data;
    const room = gameRooms.get(gameId);
    
    if (room) {
      if (!room.gameState.board) {
        room.gameState.board = Array(6).fill().map(() => Array(7).fill(null));
        room.gameState.currentPlayer = 'red';
        room.gameState.winner = null;
      }
      
      const board = room.gameState.board;
      
      // Find the lowest empty row in the column
      for (let row = 5; row >= 0; row--) {
        if (board[row][column] === null) {
          board[row][column] = room.gameState.currentPlayer;
          room.gameState.currentPlayer = room.gameState.currentPlayer === 'red' ? 'yellow' : 'red';
          
          // Check for winner
          const winner = checkConnectFourWinner(board, row, column);
          if (winner) {
            room.gameState.winner = winner;
          }
          
          io.to(gameId).emit('c4-update', room.gameState);
          break;
        }
      }
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      const room = gameRooms.get(player.gameId);
      if (room) {
        room.players = room.players.filter(p => p.socketId !== socket.id);
        socket.to(player.gameId).emit('player-left', { playerId: player.playerId });
      }
      players.delete(socket.id);
    }
    console.log('Client disconnected:', socket.id);
  });
});

// Helper functions
function checkTicTacToeWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];
  
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  
  if (board.every(cell => cell !== null)) {
    return 'tie';
  }
  
  return null;
}

function checkConnectFourWinner(board, row, col) {
  const player = board[row][col];
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1] // horizontal, vertical, diagonal
  ];
  
  for (let [dr, dc] of directions) {
    let count = 1;
    
    // Check positive direction
    for (let i = 1; i < 4; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }
    
    // Check negative direction
    for (let i = 1; i < 4; i++) {
      const r = row - dr * i;
      const c = col - dc * i;
      if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
        count++;
      } else {
        break;
      }
    }
    
    if (count >= 4) {
      return player;
    }
  }
  
  return null;
}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
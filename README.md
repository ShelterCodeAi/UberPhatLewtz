# UberPhatLewtz Gaming Platform

A comprehensive web-based gaming platform featuring multiple game genres built with React.js frontend and Node.js backend.

![Homepage](https://github.com/user-attachments/assets/2b15a847-f158-46cf-9800-0be42832b0ad)

## 🎮 Features

### Game Categories
- **Role Playing Games (RPG)**: Text-based adventure games
- **Real Time Strategy (RTS)**: Resource management and building games
- **Arcade Games**: Classic single-player arcade games
- **Multiplayer Games**: Real-time multiplayer games with WebSocket support
- **Board Games**: Turn-based strategy games

### Games Included

#### 🐍 Snake Game (Arcade)
Classic snake game where players control a snake to eat food and grow longer.
- Arrow key controls
- Score tracking
- Collision detection
- Responsive grid-based gameplay

![Snake Game](https://github.com/user-attachments/assets/bdca6cb9-cfc6-4274-b262-4967a205185c)

#### ❌ Tic Tac Toe (Multiplayer)
Real-time multiplayer Tic Tac Toe with room-based matchmaking.
- WebSocket-powered real-time gameplay
- Room creation and joining
- Turn-based mechanics
- Win detection

![Tic Tac Toe](https://github.com/user-attachments/assets/505b932f-c9e3-47b3-b253-da0ca4df06fe)

#### 🔴 Connect Four (Board Game)
Multiplayer Connect Four with real-time gameplay.
- Drop disc mechanics
- 4-in-a-row win detection
- Real-time multiplayer support
- Visual game board

#### ⚔️ Text Adventure (RPG)
Interactive text-based adventure game with inventory and combat systems.
- Command-based interface
- Inventory management
- Health and score tracking
- Multiple rooms and items
- Combat mechanics

![Text Adventure](https://github.com/user-attachments/assets/dc09e165-a4ee-46b9-ac3c-a941abaf835f)

#### 🏗️ Resource Manager (RTS)
Settlement building and resource management game.
- Multiple resource types (Wood, Stone, Food, Gold)
- Building construction system
- Population management
- Real-time resource production
- Strategic gameplay

![Resource Manager](https://github.com/user-attachments/assets/8821eac9-5c84-412d-acb2-c8ab92a72436)

## 🛠️ Technology Stack

### Frontend
- **React.js** with TypeScript
- **React Router** for navigation
- **Socket.IO Client** for real-time communication
- **Axios** for HTTP requests
- **CSS3** with modern gradients and animations

### Backend
- **Node.js** with Express.js
- **Socket.IO** for real-time multiplayer functionality
- **CORS** for cross-origin requests
- **dotenv** for environment configuration

## 📁 Project Structure

```
UberPhatLewtz/
├── frontend/                 # React.js frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── Navbar.tsx
│   │   ├── pages/           # Main application pages
│   │   │   ├── Home.tsx
│   │   │   └── GameCategory.tsx
│   │   ├── games/           # Individual game components
│   │   │   ├── SnakeGame.tsx
│   │   │   ├── TicTacToe.tsx
│   │   │   ├── ConnectFour.tsx
│   │   │   ├── TextAdventure.tsx
│   │   │   └── ResourceManager.tsx
│   │   ├── App.tsx          # Main application component
│   │   └── App.css          # Global styles
│   └── package.json
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file with Socket.IO
│   ├── package.json
│   └── .env                # Environment configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShelterCodeAi/UberPhatLewtz.git
   cd UberPhatLewtz
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The server will run on `http://localhost:5000`

2. **Start the Frontend Application**
   ```bash
   cd frontend
   npm start
   ```
   The application will open in your browser at `http://localhost:3000`

## 🎯 How to Play

### Single Player Games
- **Snake Game**: Use arrow keys to control the snake and eat the yellow food
- **Text Adventure**: Type commands like "look", "go north", "take stick", "use item"
- **Resource Manager**: Build structures to gather resources and grow your settlement

### Multiplayer Games
- **Tic Tac Toe**: Enter a room ID and player name to join or create a game room
- **Connect Four**: Same as Tic Tac Toe - use room-based matchmaking

## 🔧 API Endpoints

### REST API
- `GET /api/health` - Server health check
- `GET /api/games` - Get all game categories and games

### WebSocket Events
- `join-game` - Join a multiplayer game room
- `ttt-move` - Make a move in Tic Tac Toe
- `c4-move` - Make a move in Connect Four
- `ttt-update` - Receive Tic Tac Toe game state updates
- `c4-update` - Receive Connect Four game state updates

## 🎨 Design Features

- **Modern UI**: Beautiful gradient backgrounds and glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Theme**: Eye-friendly dark color scheme
- **Smooth Animations**: Hover effects and transitions throughout
- **Game-Specific Styling**: Each game has its own visual identity

## 🔮 Future Enhancements

- User authentication and profiles
- Game statistics and leaderboards
- More game types and genres
- Spectator mode for multiplayer games
- Chat functionality in game rooms
- Tournament system
- Mobile app versions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the package.json files for details.

## 🎮 Game Controls

### Snake Game
- **Arrow Keys**: Move the snake
- **Start Game**: Begin playing
- **Reset**: Return to initial state

### Text Adventure
- **Text Commands**: Type commands and press Enter
- **Available Commands**: look, go [direction], take [item], use [item], inventory, help

### Resource Manager  
- **Build Buttons**: Click to construct buildings
- **Start/Pause**: Control game simulation
- **Reset**: Start over with initial resources

### Multiplayer Games
- **Mouse Clicks**: Make moves on the game board
- **Room System**: Enter room ID to join/create games

---

Enjoy playing the UberPhatLewtz Gaming Platform! 🎮

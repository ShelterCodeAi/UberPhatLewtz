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

## 🎮 Game Gallery & Screenshots

This section provides detailed instructions, screenshots, and automation scripts for each game in the platform.

### 🐍 Snake Game

**Description**: Classic arcade game where players control a snake to eat food and grow longer while avoiding collisions.

**How to Play**:
1. Navigate to the Snake Game from the homepage or via `/game/snake`
2. Click "Start Game" to begin playing
3. Use arrow keys to control the snake's movement
4. Eat the yellow food pellets to grow longer and increase your score
5. Avoid hitting the walls or the snake's own body
6. Click "Reset" to restart the game at any time

**Game Controls**:
- ⬆️ **Up Arrow**: Move snake up
- ⬇️ **Down Arrow**: Move snake down
- ⬅️ **Left Arrow**: Move snake left
- ➡️ **Right Arrow**: Move snake right
- 🎮 **Start Game**: Begin/restart gameplay
- 🔄 **Reset**: Return to initial state

**Screenshots**:
- **Main Interface**: ![Snake Game Main](/screenshots/snake-main.png)
- **Gameplay/Game Over**: ![Snake Game Gameplay](/screenshots/snake-gameplay.png)

---

### ⚔️ Text Adventure

**Description**: Interactive text-based RPG adventure with AI-driven NPCs, inventory management, and exploration mechanics.

**How to Play**:
1. Navigate to the Text Adventure from the homepage or via `/game/text-adventure`
2. Read the initial game description and your current location
3. Type commands in the text input field and press Enter
4. Explore different rooms, collect items, and interact with NPCs
5. Manage your health, score, and inventory
6. Find the legendary Crystal of Power to win

**Available Commands**:
- **look**: Examine your current location
- **go [direction]**: Move to different areas (north, south, east, west)
- **take [item]**: Pick up items from the current location
- **use [item]**: Use items from your inventory
- **inventory**: View your current items
- **talk**: Interact with NPCs in the current location
- **help**: Display available commands

**Game Features**:
- 🏰 Multiple interconnected rooms and locations
- 🎒 Inventory management system
- ❤️ Health and score tracking
- 🤖 AI-driven NPCs with unique personalities
- ⚔️ Combat mechanics with enemies
- 🏆 Victory conditions and objectives

**Screenshots**:
- **Main Interface**: ![Text Adventure Main](/screenshots/text-adventure-main.png)
- **Gameplay with Commands**: ![Text Adventure Gameplay](/screenshots/text-adventure-gameplay.png)

---

### 🏗️ Resource Manager

**Description**: Real-time strategy game focused on settlement building, resource management, and population growth.

**How to Play**:
1. Navigate to the Resource Manager from the homepage or via `/game/resource-manager`
2. Review your starting resources: Wood, Stone, Food, and Gold
3. Click "Start Game" to begin resource production simulation
4. Build structures to increase resource production and population capacity
5. Monitor your population growth and resource consumption
6. Strategically expand your settlement over time

**Building Types**:
- **🪵 Lumber Mill**: Produces +2 Wood per second (Cost: 20 Stone, 50 Gold)
- **🪨 Stone Quarry**: Produces +2 Stone per second (Cost: 30 Wood, 40 Gold)
- **🌾 Farm**: Produces +3 Food per second (Cost: 25 Wood, 15 Stone, 30 Gold)
- **💰 Gold Mine**: Produces +1 Gold per second (Cost: 40 Wood, 60 Stone)
- **🏠 House**: Increases max population by +5 (Cost: 50 Wood, 30 Stone, 20 Gold)

**Game Controls**:
- 🎮 **Start/Pause Game**: Control the simulation
- 🏗️ **Build Buttons**: Construct buildings (if you have enough resources)
- 🔄 **Reset Game**: Start over with initial resources
- ⏰ **Real-time Simulation**: Resources automatically produce when game is running

**Screenshots**:
- **Main Interface**: ![Resource Manager Main](/screenshots/resource-manager-main.png)
- **Gameplay with Buildings**: ![Resource Manager Gameplay](/screenshots/resource-manager-gameplay.png)

---

### ❌ Tic Tac Toe

**Description**: Real-time multiplayer Tic Tac Toe with WebSocket-powered room-based matchmaking.

**How to Play**:
1. Navigate to Tic Tac Toe from the homepage or via `/game/tic-tac-toe`
2. Enter your player name in the "Enter your name" field
3. Enter a room ID (e.g., "room1") to create or join a game room
4. Click "Join Game" to connect to the multiplayer session
5. Wait for another player to join (2 players required)
6. Take turns clicking on the 3x3 grid to place your symbol (X or O)
7. Get three in a row horizontally, vertically, or diagonally to win

**Game Features**:
- 🌐 **Real-time Multiplayer**: WebSocket-powered live gameplay
- 🏠 **Room System**: Create or join custom game rooms
- 🎯 **Turn-based Mechanics**: Players alternate moves
- 🏆 **Win Detection**: Automatic detection of winning combinations
- 👥 **Player Management**: Shows current players and turn order

**Game Controls**:
- 🖱️ **Mouse Clicks**: Click on grid squares to make moves
- 🚪 **Leave Game**: Exit the current game room
- 🔄 **Room System**: Use any room ID to create/join games

**Screenshots**:
- **Join Game Interface**: ![Tic Tac Toe Main](/screenshots/tic-tac-toe-main.png)
- **Game Board**: ![Tic Tac Toe Gameplay](/screenshots/tic-tac-toe-gameplay.png)

---

### 🔴 Connect Four

**Description**: Multiplayer Connect Four with real-time gameplay and drop-disc mechanics.

**How to Play**:
1. Navigate to Connect Four from the homepage or via `/game/connect-four`
2. Enter your player name in the "Enter your name" field
3. Enter a room ID (e.g., "room1") to create or join a game room
4. Click "Join Game" to connect to the multiplayer session
5. Wait for another player to join (2 players required)
6. Take turns clicking column drop buttons to drop your colored disc
7. Get four discs in a row (horizontal, vertical, or diagonal) to win

**Game Features**:
- 🌐 **Real-time Multiplayer**: WebSocket-powered live gameplay
- 🎯 **Drop Disc Mechanics**: Physics-based disc dropping
- 🏠 **Room System**: Create or join custom game rooms
- 🔴🟡 **Two-Player Colors**: Red and Yellow disc colors
- 🏆 **4-in-a-Row Detection**: Automatic win detection in all directions
- 📊 **Visual Game Board**: Clear 7x6 grid display

**Game Controls**:
- 🖱️ **Column Drop Buttons**: Click ↓ buttons to drop discs in columns
- 🚪 **Leave Game**: Exit the current game room
- 🔄 **Room System**: Use any room ID to create/join games

**Screenshots**:
- **Join Game Interface**: ![Connect Four Main](/screenshots/connect-four-main.png)
- **Game Board**: ![Connect Four Gameplay](/screenshots/connect-four-gameplay.png)

---

## 📸 Automated Screenshot Generation

### Prerequisites for Screenshot Automation
- Node.js and npm installed
- Backend server running on `http://localhost:5000`
- Frontend server running on `http://localhost:3000`
- Playwright dependencies installed

### Step-by-Step Instructions

1. **Install Playwright Dependencies**:
   ```bash
   npm install --save-dev @playwright/test playwright
   npx playwright install chromium
   ```

2. **Start the Application Servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend  
   cd frontend
   npm start
   ```

3. **Generate Screenshots**:
   ```bash
   # Run the automated screenshot generation script
   npm run screenshots
   ```

4. **Manual Screenshot Generation** (Alternative):
   ```bash
   # Using the Playwright script directly
   node scripts/generate-screenshots.js
   ```

### Screenshot Files Generated
- `homepage.png` - Main platform homepage
- `snake-main.png` - Snake game initial interface
- `snake-gameplay.png` - Snake game in action/game over state
- `text-adventure-main.png` - Text adventure initial interface
- `text-adventure-gameplay.png` - Text adventure with command interaction
- `resource-manager-main.png` - Resource manager initial interface
- `resource-manager-gameplay.png` - Resource manager with buildings constructed
- `tic-tac-toe-main.png` - Tic tac toe join game interface
- `tic-tac-toe-gameplay.png` - Tic tac toe game board
- `connect-four-main.png` - Connect four join game interface
- `connect-four-gameplay.png` - Connect four game board

### Troubleshooting Screenshot Generation
- Ensure both servers are running before generating screenshots
- Check that port 3000 (frontend) and 5000 (backend) are available
- If screenshots appear blank, increase wait times in the script
- For multiplayer games, screenshots show single-player room creation state

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

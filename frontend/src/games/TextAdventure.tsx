import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GameState {
  currentRoom: string;
  inventory: string[];
  health: number;
  score: number;
  gameOver: boolean;
  victory: boolean;
}

interface Room {
  id: string;
  name: string;
  description: string;
  exits: { [key: string]: string };
  items?: string[];
  enemy?: {
    name: string;
    health: number;
    damage: number;
  };
}

const rooms: { [key: string]: Room } = {
  start: {
    id: 'start',
    name: 'Forest Entrance',
    description: 'You stand at the entrance of a dark forest. Ancient trees tower above you, their branches creating shadows that dance in the moonlight.',
    exits: { north: 'clearing', east: 'cave' },
    items: ['stick']
  },
  clearing: {
    id: 'clearing',
    name: 'Forest Clearing',
    description: 'A peaceful clearing with a small pond reflecting the stars. You can hear the gentle sound of flowing water.',
    exits: { south: 'start', west: 'ruins' },
    items: ['healing potion']
  },
  cave: {
    id: 'cave',
    name: 'Dark Cave',
    description: 'A damp, dark cave with strange markings on the walls. You hear a growling sound echoing from within.',
    exits: { west: 'start', north: 'treasure' },
    enemy: {
      name: 'Cave Goblin',
      health: 30,
      damage: 10
    }
  },
  ruins: {
    id: 'ruins',
    name: 'Ancient Ruins',
    description: 'Crumbling stone structures covered in mysterious runes. An ancient altar stands in the center.',
    exits: { east: 'clearing' },
    items: ['magic sword']
  },
  treasure: {
    id: 'treasure',
    name: 'Treasure Chamber',
    description: 'A magnificent chamber filled with gold and precious gems. At the center lies the legendary Crystal of Power!',
    exits: { south: 'cave' },
    items: ['Crystal of Power']
  }
};

const TextAdventure: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 'start',
    inventory: [],
    health: 100,
    score: 0,
    gameOver: false,
    victory: false
  });
  const [command, setCommand] = useState<string>('');
  const [gameLog, setGameLog] = useState<string[]>(['Welcome to the Forest Adventure!']);

  const addToLog = (text: string) => {
    setGameLog(prev => [...prev, text]);
  };

  const processCommand = (cmd: string) => {
    const words = cmd.toLowerCase().trim().split(' ');
    const action = words[0];
    const target = words.slice(1).join(' ');

    const currentRoom = rooms[gameState.currentRoom];
    let newMessage = '';

    switch (action) {
      case 'look':
      case 'examine':
        if (target === '' || target === 'room') {
          newMessage = `${currentRoom.name}: ${currentRoom.description}`;
          if (currentRoom.items && currentRoom.items.length > 0) {
            newMessage += ` You see: ${currentRoom.items.join(', ')}.`;
          }
          if (currentRoom.exits) {
            newMessage += ` Exits: ${Object.keys(currentRoom.exits).join(', ')}.`;
          }
        } else {
          newMessage = `You examine the ${target}. Nothing special about it.`;
        }
        break;

      case 'go':
      case 'move':
      case 'north':
      case 'south':
      case 'east':
      case 'west':
        const direction = action === 'go' || action === 'move' ? target : action;
        if (currentRoom.exits[direction]) {
          const newRoomId = currentRoom.exits[direction];
          const newRoom = rooms[newRoomId];
          
          // Check for enemy in new room
          if (newRoom.enemy && newRoomId === 'cave' && !gameState.inventory.includes('magic sword')) {
            newMessage = `A ${newRoom.enemy.name} blocks your path! You need a weapon to defeat it.`;
          } else {
            setGameState(prev => ({ ...prev, currentRoom: newRoomId, score: prev.score + 10 }));
            newMessage = `You move ${direction} to ${newRoom.name}. ${newRoom.description}`;
            if (newRoom.items && newRoom.items.length > 0) {
              newMessage += ` You see: ${newRoom.items.join(', ')}.`;
            }
          }
        } else {
          newMessage = `You can't go ${direction} from here.`;
        }
        break;

      case 'take':
      case 'get':
        if (currentRoom.items && currentRoom.items.includes(target)) {
          setGameState(prev => ({
            ...prev,
            inventory: [...prev.inventory, target],
            score: prev.score + 20
          }));
          // Remove item from room
          currentRoom.items = currentRoom.items.filter(item => item !== target);
          newMessage = `You take the ${target}.`;
          
          // Check for victory condition
          if (target === 'Crystal of Power') {
            setGameState(prev => ({ ...prev, victory: true, score: prev.score + 100 }));
            newMessage += ' Congratulations! You have found the legendary Crystal of Power and won the game!';
          }
        } else {
          newMessage = `There is no ${target} here.`;
        }
        break;

      case 'use':
        if (gameState.inventory.includes(target)) {
          if (target === 'healing potion') {
            setGameState(prev => ({
              ...prev,
              health: Math.min(100, prev.health + 50),
              inventory: prev.inventory.filter(item => item !== target)
            }));
            newMessage = 'You drink the healing potion and feel refreshed! (+50 health)';
          } else if (target === 'magic sword' && currentRoom.enemy) {
            const enemyName = currentRoom.enemy.name;
            setGameState(prev => ({ ...prev, score: prev.score + 50 }));
            currentRoom.enemy = undefined;
            newMessage = `You defeat the ${enemyName} with the magic sword!`;
          } else {
            newMessage = `You can't use the ${target} right now.`;
          }
        } else {
          newMessage = `You don't have a ${target}.`;
        }
        break;

      case 'inventory':
      case 'i':
        newMessage = gameState.inventory.length > 0 
          ? `Inventory: ${gameState.inventory.join(', ')}`
          : 'Your inventory is empty.';
        break;

      case 'help':
        newMessage = 'Commands: look, go [direction], take [item], use [item], inventory, help. Directions: north, south, east, west.';
        break;

      default:
        newMessage = `I don't understand "${cmd}". Type "help" for available commands.`;
    }

    addToLog(`> ${cmd}`);
    addToLog(newMessage);
    setCommand('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim() && !gameState.gameOver && !gameState.victory) {
      processCommand(command);
    }
  };

  const resetGame = () => {
    setGameState({
      currentRoom: 'start',
      inventory: [],
      health: 100,
      score: 0,
      gameOver: false,
      victory: false
    });
    setGameLog(['Welcome to the Forest Adventure!']);
    setCommand('');
    
    // Reset room items
    rooms.start.items = ['stick'];
    rooms.clearing.items = ['healing potion'];
    rooms.ruins.items = ['magic sword'];
    rooms.treasure.items = ['Crystal of Power'];
    rooms.cave.enemy = {
      name: 'Cave Goblin',
      health: 30,
      damage: 10
    };
  };

  return (
    <div className="container">
      <div className="category-header">
        <h1>⚔️ Text Adventure</h1>
        <p>Explore the mysterious forest and find the legendary Crystal of Power!</p>
      </div>
      
      <div className="game-board">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Game Log */}
          <div>
            <div 
              style={{
                backgroundColor: '#000',
                color: '#00ff00',
                padding: '20px',
                borderRadius: '10px',
                fontFamily: 'monospace',
                fontSize: '14px',
                height: '400px',
                overflowY: 'scroll',
                border: '2px solid #00ff00'
              }}
            >
              {gameLog.map((line, index) => (
                <div key={index} style={{ marginBottom: '5px' }}>
                  {line}
                </div>
              ))}
            </div>
            
            {/* Command Input */}
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                placeholder="Enter command..."
                disabled={gameState.gameOver || gameState.victory}
                style={{
                  width: '70%',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '5px',
                  border: '2px solid #00ff00',
                  backgroundColor: '#000',
                  color: '#00ff00',
                  fontFamily: 'monospace'
                }}
              />
              <button 
                type="submit" 
                className="btn" 
                disabled={gameState.gameOver || gameState.victory}
                style={{ marginLeft: '10px' }}
              >
                Enter
              </button>
            </form>
          </div>
          
          {/* Stats Panel */}
          <div>
            <div 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <h3>Character Stats</h3>
              <p><strong>Health:</strong> {gameState.health}/100</p>
              <p><strong>Score:</strong> {gameState.score}</p>
              <p><strong>Location:</strong> {rooms[gameState.currentRoom].name}</p>
              
              <h4>Inventory:</h4>
              {gameState.inventory.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {gameState.inventory.map((item, index) => (
                    <li key={index} style={{ padding: '2px 0' }}>• {item}</li>
                  ))}
                </ul>
              ) : (
                <p>Empty</p>
              )}
              
              {gameState.victory && (
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <h3 style={{ color: '#4ecdc4' }}>Victory!</h3>
                  <p>You found the Crystal of Power!</p>
                </div>
              )}
              
              <button className="btn" onClick={resetGame} style={{ marginTop: '20px', width: '100%' }}>
                New Game
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default TextAdventure;
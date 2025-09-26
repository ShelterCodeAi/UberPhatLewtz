import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AINPC, NPCFactory, DialogueContext } from '../utils/aiNPC';

interface Player {
  name: string;
  level: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  experience: number;
  gold: number;
  inventory: string[];
  stats: {
    strength: number;
    intelligence: number;
    agility: number;
  };
}

interface GameLocation {
  id: string;
  name: string;
  description: string;
  backgroundImage: string;
  npcs: AINPC[];
  items: string[];
  exits: { [direction: string]: string };
  discovered: boolean;
}

interface GameState {
  player: Player;
  currentLocation: string;
  gameLog: string[];
  currentNPC: AINPC | null;
  inDialogue: boolean;
  gameStarted: boolean;
}

const DungeonQuest: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      name: "Hero",
      level: 1,
      health: 100,
      maxHealth: 100,
      mana: 50,
      maxMana: 50,
      experience: 0,
      gold: 100,
      inventory: ["Health Potion", "Iron Sword"],
      stats: {
        strength: 10,
        intelligence: 8,
        agility: 7
      }
    },
    currentLocation: 'village',
    gameLog: ['Welcome to Dungeon Quest! A graphically enhanced RPG adventure with AI-driven NPCs.'],
    currentNPC: null,
    inDialogue: false,
    gameStarted: false
  });

  const [locations] = useState<{ [key: string]: GameLocation }>({
    village: {
      id: 'village',
      name: 'Mystical Village',
      description: 'A peaceful village surrounded by ancient ruins and magical auras. Crystal formations glow softly in the evening light.',
      backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      npcs: [
        NPCFactory.createNPC('merchant', 'Elder Merchant Gareth'),
        NPCFactory.createNPC('wise', 'Oracle Seraphina'),
        NPCFactory.createNPC('friendly', 'Village Guard Marcus')
      ],
      items: ['Ancient Map', 'Magic Crystal'],
      exits: { north: 'forest', east: 'dungeon', south: 'lake' },
      discovered: true
    },
    forest: {
      id: 'forest',
      name: 'Enchanted Forest',
      description: 'Dark trees pulse with magical energy. Ethereal lights dance between the branches, and you can hear whispers in the wind.',
      backgroundImage: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      npcs: [
        NPCFactory.createNPC('mysterious', 'Shadow Walker Nyx'),
        NPCFactory.createNPC('hostile', 'Forest Bandit Chief')
      ],
      items: ['Elven Bow', 'Forest Herbs'],
      exits: { south: 'village', east: 'cave' },
      discovered: false
    },
    dungeon: {
      id: 'dungeon',
      name: 'Ancient Dungeon',
      description: 'Stone corridors glow with arcane symbols. The air crackles with magical energy and ancient power.',
      backgroundImage: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)',
      npcs: [
        NPCFactory.createNPC('hostile', 'Dungeon Guardian'),
        NPCFactory.createNPC('mysterious', 'Ancient Spirit')
      ],
      items: ['Legendary Sword', 'Dragon Scale'],
      exits: { west: 'village', down: 'depths' },
      discovered: false
    },
    lake: {
      id: 'lake',
      name: 'Crystal Lake',
      description: 'A serene lake with waters that shimmer like liquid starlight. Magical creatures can be seen beneath the surface.',
      backgroundImage: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      npcs: [
        NPCFactory.createNPC('wise', 'Lake Sprite Aquarina'),
        NPCFactory.createNPC('friendly', 'Fisherman Finn')
      ],
      items: ['Water Crystal', 'Healing Spring Water'],
      exits: { north: 'village' },
      discovered: false
    },
    cave: {
      id: 'cave',
      name: 'Mystic Cave',
      description: 'Glowing crystals illuminate cavern walls covered in ancient runes. The air hums with mystical power.',
      backgroundImage: 'linear-gradient(135deg, #8e44ad 0%, #3742fa 100%)',
      npcs: [
        NPCFactory.createNPC('wise', 'Cave Hermit Zephyr')
      ],
      items: ['Power Crystal', 'Ancient Tome'],
      exits: { west: 'forest' },
      discovered: false
    }
  });

  const [currentDialogue, setCurrentDialogue] = useState<any>(null);

  const addToLog = (message: string) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, message]
    }));
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
    addToLog("Your adventure begins in the mystical village...");
  };

  const moveToLocation = (locationId: string) => {
    const location = locations[locationId];
    if (!location) return;

    setGameState(prev => ({
      ...prev,
      currentLocation: locationId,
      player: {
        ...prev.player,
        experience: prev.player.experience + 10
      }
    }));

    // Mark location as discovered
    location.discovered = true;
    
    addToLog(`You travel to ${location.name}. ${location.description}`);
    
    if (location.npcs.length > 0) {
      addToLog(`You see: ${location.npcs.map(npc => npc.name).join(', ')}`);
    }
    
    if (location.items.length > 0) {
      addToLog(`Items here: ${location.items.join(', ')}`);
    }
  };

  const talkToNPC = (npc: AINPC) => {
    const context: DialogueContext = {
      playerLevel: gameState.player.level,
      playerInventory: gameState.player.inventory,
      previousInteractions: 0,
      currentLocation: gameState.currentLocation
    };

    const dialogue = npc.generateDialogue(context);
    
    setGameState(prev => ({
      ...prev,
      currentNPC: npc,
      inDialogue: true
    }));
    
    setCurrentDialogue(dialogue);
    addToLog(`${npc.name}: "${dialogue.text}"`);
  };

  const handleDialogueOption = (option: any) => {
    if (!gameState.currentNPC) return;

    addToLog(`You: "${option.text}"`);
    
    // Process the option based on action
    switch (option.action) {
      case 'trade':
        addToLog("Trade interface would open here...");
        break;
      case 'fight':
        addToLog("Combat would begin here...");
        break;
      case 'quest':
        addToLog("Quest system would activate here...");
        setGameState(prev => ({
          ...prev,
          player: {
            ...prev.player,
            experience: prev.player.experience + 50
          }
        }));
        break;
      case 'leave':
        endDialogue();
        return;
    }

    // Get NPC response
    const context: DialogueContext = {
      playerLevel: gameState.player.level,
      playerInventory: gameState.player.inventory,
      previousInteractions: 1,
      currentLocation: gameState.currentLocation
    };

    const newDialogue = gameState.currentNPC.generateDialogue(context);
    setCurrentDialogue(newDialogue);
    addToLog(`${gameState.currentNPC.name}: "${newDialogue.text}"`);
  };

  const endDialogue = () => {
    setGameState(prev => ({
      ...prev,
      currentNPC: null,
      inDialogue: false
    }));
    setCurrentDialogue(null);
  };

  const takeItem = (item: string) => {
    const location = locations[gameState.currentLocation];
    if (location.items.includes(item)) {
      location.items = location.items.filter(i => i !== item);
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          inventory: [...prev.player.inventory, item],
          experience: prev.player.experience + 20
        }
      }));
      addToLog(`You picked up: ${item}`);
    }
  };

  const currentLocation = locations[gameState.currentLocation];

  const getHealthBarColor = () => {
    const healthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
    if (healthPercent > 60) return '#4ecdc4';
    if (healthPercent > 30) return '#f7dc6f';
    return '#e74c3c';
  };

  const getManaBarColor = () => '#3498db';

  return (
    <div className="container" style={{ minHeight: '100vh', background: currentLocation.backgroundImage }}>
      <div className="category-header">
        <h1>⚔️ Dungeon Quest</h1>
        <p>An AI-Enhanced RPG Adventure with Dynamic NPCs</p>
      </div>

      {!gameState.gameStarted ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.8)', 
            padding: '30px', 
            borderRadius: '15px',
            maxWidth: '600px',
            margin: '0 auto',
            border: '2px solid #4ecdc4'
          }}>
            <h2>Welcome to Dungeon Quest!</h2>
            <p>Experience an enhanced RPG with AI-driven NPCs, dynamic dialogue, and immersive graphics.</p>
            <p>• Explore mystical locations with beautiful visuals</p>
            <p>• Interact with intelligent NPCs that adapt to your choices</p>
            <p>• Discover items and gain experience as you adventure</p>
            <button className="btn" onClick={startGame} style={{ marginTop: '20px', fontSize: '18px' }}>
              Begin Your Quest
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
          {/* Game World */}
          <div style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.85)', 
            padding: '20px', 
            borderRadius: '15px',
            minHeight: '600px',
            border: '2px solid #4ecdc4'
          }}>
            <h3 style={{ color: '#4ecdc4', textAlign: 'center' }}>{currentLocation.name}</h3>
            <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>{currentLocation.description}</p>

            {/* Game Log */}
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '10px',
              height: '200px',
              overflowY: 'scroll',
              marginBottom: '20px',
              border: '1px solid #333'
            }}>
              {gameState.gameLog.map((log, index) => (
                <div key={index} style={{ marginBottom: '5px', fontSize: '14px' }}>
                  {log}
                </div>
              ))}
            </div>

            {/* NPCs */}
            {currentLocation.npcs.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Characters:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {currentLocation.npcs.map((npc, index) => (
                    <button
                      key={index}
                      onClick={() => talkToNPC(npc)}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#4ecdc4',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Talk to {npc.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Items */}
            {currentLocation.items.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4>Items:</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {currentLocation.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => takeItem(item)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: '#f39c12',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Take {item}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Movement */}
            <div>
              <h4>Exits:</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {Object.entries(currentLocation.exits).map(([direction, locationId]) => (
                  <button
                    key={direction}
                    onClick={() => moveToLocation(locationId)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#9b59b6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Go {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player Stats & Dialogue */}
          <div>
            {/* Player Stats */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #4ecdc4'
            }}>
              <h3 style={{ color: '#4ecdc4' }}>Player Stats</h3>
              <p><strong>Name:</strong> {gameState.player.name}</p>
              <p><strong>Level:</strong> {gameState.player.level}</p>
              <p><strong>Experience:</strong> {gameState.player.experience}</p>
              <p><strong>Gold:</strong> {gameState.player.gold}</p>

              {/* Health Bar */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Health</span>
                  <span>{gameState.player.health}/{gameState.player.maxHealth}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#333', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(gameState.player.health / gameState.player.maxHealth) * 100}%`,
                    height: '100%',
                    backgroundColor: getHealthBarColor(),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Mana Bar */}
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Mana</span>
                  <span>{gameState.player.mana}/{gameState.player.maxMana}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#333', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(gameState.player.mana / gameState.player.maxMana) * 100}%`,
                    height: '100%',
                    backgroundColor: getManaBarColor(),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#e74c3c' }}>⚔️</div>
                  <div>STR: {gameState.player.stats.strength}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#3498db' }}>🧠</div>
                  <div>INT: {gameState.player.stats.intelligence}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: '#2ecc71' }}>🏃</div>
                  <div>AGI: {gameState.player.stats.agility}</div>
                </div>
              </div>

              {/* Inventory */}
              <h4>Inventory:</h4>
              <div style={{ 
                maxHeight: '100px', 
                overflowY: 'scroll',
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '5px'
              }}>
                {gameState.player.inventory.length > 0 ? (
                  gameState.player.inventory.map((item, index) => (
                    <div key={index} style={{ padding: '2px 0', fontSize: '14px' }}>
                      • {item}
                    </div>
                  ))
                ) : (
                  <p>Empty</p>
                )}
              </div>
            </div>

            {/* Dialogue Panel */}
            {gameState.inDialogue && currentDialogue && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                padding: '20px',
                borderRadius: '15px',
                border: '2px solid #f39c12'
              }}>
                <h3 style={{ color: '#f39c12' }}>💬 Dialogue</h3>
                <div style={{
                  backgroundColor: '#1a1a1a',
                  padding: '15px',
                  borderRadius: '10px',
                  marginBottom: '15px'
                }}>
                  <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>
                    {gameState.currentNPC?.name}:
                  </p>
                  <p>"{currentDialogue.text}"</p>
                </div>
                
                <div>
                  <h4>Your Response:</h4>
                  {currentDialogue.options.map((option: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleDialogueOption(option)}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px',
                        margin: '5px 0',
                        backgroundColor: '#f39c12',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      {option.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default DungeonQuest;
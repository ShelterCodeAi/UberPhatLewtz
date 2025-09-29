import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AINPC, NPCFactory, DialogueContext } from '../utils/aiNPC';

interface VillageState {
  playerName: string;
  reputation: number;
  gold: number;
  inventory: string[];
  completedQuests: string[];
  currentQuest: string | null;
  relationships: { [npcName: string]: number };
  gameLog: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  dayCount: number;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  requiredItems: string[];
  reward: { gold: number; reputation: number; items?: string[] };
  completed: boolean;
}

const MysticVillage: React.FC = () => {
  const [gameState, setGameState] = useState<VillageState>({
    playerName: "Traveler",
    reputation: 50,
    gold: 200,
    inventory: ["Travel Pack", "Letter of Introduction"],
    completedQuests: [],
    currentQuest: null,
    relationships: {},
    gameLog: ['Welcome to Mystic Village! A place where AI-driven NPCs create a living, breathing community.'],
    timeOfDay: 'morning',
    dayCount: 1
  });

  const [npcs] = useState<{ [key: string]: AINPC }>({
    'mayor': NPCFactory.createNPC('wise', 'Mayor Aldric'),
    'blacksmith': NPCFactory.createNPC('friendly', 'Blacksmith Thorin'),
    'merchant': NPCFactory.createNPC('merchant', 'Merchant Isabella'),
    'witch': NPCFactory.createNPC('mysterious', 'Witch Morgana'),
    'guard': NPCFactory.createNPC('friendly', 'Guard Captain Rex'),
    'innkeeper': NPCFactory.createNPC('friendly', 'Innkeeper Sarah'),
    'scholar': NPCFactory.createNPC('wise', 'Scholar Elias'),
    'thief': NPCFactory.createNPC('hostile', 'Shadow Thief Vex')
  });

  const [quests] = useState<{ [key: string]: Quest }>({
    'welcome': {
      id: 'welcome',
      title: 'Welcome to the Village',
      description: 'Introduce yourself to the Mayor and learn about the village.',
      requiredItems: [],
      reward: { gold: 50, reputation: 10 },
      completed: false
    },
    'herb_gathering': {
      id: 'herb_gathering',
      title: 'Magical Herb Collection',
      description: 'Collect rare herbs for the village witch.',
      requiredItems: ['Moonflower', 'Dragon Root'],
      reward: { gold: 100, reputation: 15, items: ['Healing Potion'] },
      completed: false
    },
    'stolen_goods': {
      id: 'stolen_goods',
      title: 'The Missing Artifacts',
      description: 'Help recover stolen magical artifacts.',
      requiredItems: ['Ancient Relic'],
      reward: { gold: 200, reputation: 25 },
      completed: false
    }
  });

  const [currentNPC, setCurrentNPC] = useState<AINPC | null>(null);
  const [currentDialogue, setCurrentDialogue] = useState<any>(null);
  const [showShop, setShowShop] = useState(false);
  const [availableItems] = useState(['Healing Potion', 'Mana Potion', 'Iron Sword', 'Magic Staff', 'Moonflower', 'Dragon Root']);

  useEffect(() => {
    // Simulate day/night cycle
    const timeInterval = setInterval(() => {
      setGameState(prev => {
        const times: VillageState['timeOfDay'][] = ['morning', 'afternoon', 'evening', 'night'];
        const currentIndex = times.indexOf(prev.timeOfDay);
        const nextIndex = (currentIndex + 1) % times.length;
        const newTimeOfDay = times[nextIndex];
        
        return {
          ...prev,
          timeOfDay: newTimeOfDay,
          dayCount: newTimeOfDay === 'morning' ? prev.dayCount + 1 : prev.dayCount
        };
      });
    }, 10000); // Change every 10 seconds for demo

    return () => clearInterval(timeInterval);
  }, []);

  const addToLog = (message: string) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog, `[${prev.timeOfDay.toUpperCase()}] ${message}`]
    }));
  };

  const talkToNPC = (npcKey: string) => {
    const npc = npcs[npcKey];
    if (!npc) return;

    const context: DialogueContext = {
      playerLevel: Math.floor(gameState.reputation / 20) + 1,
      playerInventory: gameState.inventory,
      previousInteractions: gameState.relationships[npc.name] || 0,
      currentLocation: 'village'
    };

    const dialogue = npc.generateDialogue(context);
    setCurrentNPC(npc);
    setCurrentDialogue(dialogue);
    addToLog(`You approach ${npc.name}...`);
  };

  const handleDialogueOption = (option: any) => {
    if (!currentNPC) return;

    addToLog(`You: "${option.text}"`);

    // Update relationship
    const relationshipChange = option.action === 'help' ? 5 : option.action === 'trade' ? 2 : 1;
    setGameState(prev => ({
      ...prev,
      relationships: {
        ...prev.relationships,
        [currentNPC.name]: (prev.relationships[currentNPC.name] || 0) + relationshipChange
      }
    }));

    // Handle different actions
    switch (option.action) {
      case 'trade':
        setShowShop(true);
        break;
      case 'quest':
        handleQuestStart();
        break;
      case 'leave':
        endDialogue();
        return;
    }

    // Generate NPC response
    const context: DialogueContext = {
      playerLevel: Math.floor(gameState.reputation / 20) + 1,
      playerInventory: gameState.inventory,
      previousInteractions: gameState.relationships[currentNPC.name] || 0,
      currentLocation: 'village'
    };

    const newDialogue = currentNPC.generateDialogue(context);
    setCurrentDialogue(newDialogue);
    addToLog(`${currentNPC.name}: "${newDialogue.text}"`);
  };

  const handleQuestStart = () => {
    // Simple quest assignment logic
    const availableQuests = Object.values(quests).filter(q => 
      !gameState.completedQuests.includes(q.id) && q.id !== gameState.currentQuest
    );
    
    if (availableQuests.length > 0) {
      const quest = availableQuests[0];
      setGameState(prev => ({
        ...prev,
        currentQuest: quest.id
      }));
      addToLog(`Quest Started: ${quest.title} - ${quest.description}`);
    }
  };

  const endDialogue = () => {
    setCurrentNPC(null);
    setCurrentDialogue(null);
    setShowShop(false);
  };

  const buyItem = (item: string, price: number) => {
    if (gameState.gold >= price) {
      setGameState(prev => ({
        ...prev,
        gold: prev.gold - price,
        inventory: [...prev.inventory, item]
      }));
      addToLog(`You bought ${item} for ${price} gold.`);
    } else {
      addToLog("You don't have enough gold!");
    }
  };

  const completeQuest = (questId: string) => {
    const quest = quests[questId];
    if (!quest) return;

    // Check if player has required items
    const hasAllItems = quest.requiredItems.every(item => 
      gameState.inventory.includes(item)
    );

    if (hasAllItems) {
      // Remove required items from inventory
      let newInventory = [...gameState.inventory];
      quest.requiredItems.forEach(item => {
        const index = newInventory.indexOf(item);
        if (index > -1) newInventory.splice(index, 1);
      });

      // Add reward items
      if (quest.reward.items) {
        newInventory = [...newInventory, ...quest.reward.items];
      }

      setGameState(prev => ({
        ...prev,
        gold: prev.gold + quest.reward.gold,
        reputation: prev.reputation + quest.reward.reputation,
        inventory: newInventory,
        completedQuests: [...prev.completedQuests, questId],
        currentQuest: null
      }));

      addToLog(`Quest Completed: ${quest.title}! Gained ${quest.reward.gold} gold and ${quest.reward.reputation} reputation.`);
    } else {
      addToLog(`You need: ${quest.requiredItems.join(', ')} to complete this quest.`);
    }
  };

  const getTimeOfDayBackground = () => {
    const backgrounds = {
      morning: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      afternoon: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      evening: 'linear-gradient(135deg, #ff8a80 0%, #ea80fc 100%)',
      night: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
    };
    return backgrounds[gameState.timeOfDay];
  };

  const getReputationLevel = () => {
    if (gameState.reputation >= 80) return "Hero";
    if (gameState.reputation >= 60) return "Respected";
    if (gameState.reputation >= 40) return "Known";
    if (gameState.reputation >= 20) return "Newcomer";
    return "Stranger";
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      background: getTimeOfDayBackground(),
      transition: 'background 2s ease-in-out'
    }}>
      <div className="category-header">
        <h1>🏘️ Mystic Village</h1>
        <p>A Living Village with AI-Driven NPCs and Dynamic Relationships</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          <span>Day {gameState.dayCount}</span>
          <span>{gameState.timeOfDay.charAt(0).toUpperCase() + gameState.timeOfDay.slice(1)}</span>
          <span>Reputation: {getReputationLevel()}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
        {/* Main Game Area */}
        <div>
          {/* Village Map */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid #4ecdc4'
          }}>
            <h3 style={{ color: '#4ecdc4', textAlign: 'center' }}>Village Square</h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(4, 1fr)', 
              gap: '10px',
              marginTop: '20px'
            }}>
              {Object.entries(npcs).map(([key, npc]) => (
                <button
                  key={key}
                  onClick={() => talkToNPC(key)}
                  style={{
                    padding: '15px',
                    backgroundColor: currentNPC === npc ? '#4ecdc4' : 'rgba(255, 255, 255, 0.1)',
                    color: currentNPC === npc ? '#1a1a1a' : 'white',
                    border: '1px solid #4ecdc4',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '12px',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '5px' }}>
                    {key === 'mayor' ? '👑' : 
                     key === 'blacksmith' ? '🔨' : 
                     key === 'merchant' ? '💰' : 
                     key === 'witch' ? '🔮' : 
                     key === 'guard' ? '⚔️' : 
                     key === 'innkeeper' ? '🍺' : 
                     key === 'scholar' ? '📚' : '🥷'}
                  </div>
                  <div>{npc.name}</div>
                  <div style={{ fontSize: '10px', marginTop: '5px' }}>
                    Relationship: {gameState.relationships[npc.name] || 0}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Game Log */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            border: '2px solid #4ecdc4'
          }}>
            <h3 style={{ color: '#4ecdc4' }}>Village Chronicle</h3>
            <div style={{
              height: '200px',
              overflowY: 'scroll',
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '10px',
              border: '1px solid #333'
            }}>
              {gameState.gameLog.map((log, index) => (
                <div key={index} style={{ marginBottom: '8px', fontSize: '14px' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Player Stats */}
          <div style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: '20px',
            borderRadius: '15px',
            marginBottom: '20px',
            border: '2px solid #4ecdc4'
          }}>
            <h3 style={{ color: '#4ecdc4' }}>Player Status</h3>
            <p><strong>Name:</strong> {gameState.playerName}</p>
            <p><strong>Gold:</strong> {gameState.gold} 💰</p>
            <p><strong>Reputation:</strong> {gameState.reputation}/100</p>
            <div style={{
              width: '100%',
              height: '15px',
              backgroundColor: '#333',
              borderRadius: '10px',
              marginBottom: '15px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${gameState.reputation}%`,
                height: '100%',
                backgroundColor: gameState.reputation > 60 ? '#2ecc71' : gameState.reputation > 30 ? '#f39c12' : '#e74c3c',
                transition: 'width 0.3s ease'
              }} />
            </div>

            <h4>Inventory:</h4>
            <div style={{
              maxHeight: '120px',
              overflowY: 'scroll',
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '5px'
            }}>
              {gameState.inventory.map((item, index) => (
                <div key={index} style={{ padding: '2px 0', fontSize: '14px' }}>
                  • {item}
                </div>
              ))}
            </div>
          </div>

          {/* Current Quest */}
          {gameState.currentQuest && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #f39c12'
            }}>
              <h3 style={{ color: '#f39c12' }}>Current Quest</h3>
              {(() => {
                const quest = quests[gameState.currentQuest];
                return quest ? (
                  <div>
                    <h4>{quest.title}</h4>
                    <p style={{ fontSize: '14px' }}>{quest.description}</p>
                    {quest.requiredItems.length > 0 && (
                      <div>
                        <strong>Required:</strong>
                        <ul style={{ fontSize: '12px', marginLeft: '20px' }}>
                          {quest.requiredItems.map((item, index) => (
                            <li key={index} style={{
                              color: gameState.inventory.includes(item) ? '#2ecc71' : '#e74c3c'
                            }}>
                              {item} {gameState.inventory.includes(item) ? '✓' : '✗'}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={() => completeQuest(gameState.currentQuest!)}
                      style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: '#2ecc71',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                      }}
                    >
                      Complete Quest
                    </button>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Dialogue */}
          {currentNPC && currentDialogue && !showShop && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              border: '2px solid #9b59b6'
            }}>
              <h3 style={{ color: '#9b59b6' }}>💬 {currentNPC.name}</h3>
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                borderRadius: '10px',
                marginBottom: '15px'
              }}>
                <p>"{currentDialogue.text}"</p>
              </div>
              
              {currentDialogue.options.map((option: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleDialogueOption(option)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#9b59b6',
                    color: 'white',
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
          )}

          {/* Shop */}
          {showShop && (
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              border: '2px solid #f39c12'
            }}>
              <h3 style={{ color: '#f39c12' }}>🛒 Shop</h3>
              {availableItems.map((item, index) => {
                const price = Math.floor(Math.random() * 100) + 20;
                return (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    marginBottom: '5px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '5px'
                  }}>
                    <span>{item}</span>
                    <button
                      onClick={() => buyItem(item, price)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#f39c12',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      {price}g
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => setShowShop(false)}
                style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Close Shop
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default MysticVillage;
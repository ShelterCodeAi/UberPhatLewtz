import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Resources {
  wood: number;
  stone: number;
  food: number;
  gold: number;
}

interface Building {
  id: string;
  name: string;
  cost: Resources;
  production: Resources;
  count: number;
}

interface GameState {
  resources: Resources;
  buildings: { [key: string]: Building };
  population: number;
  maxPopulation: number;
  gameStarted: boolean;
}

const initialBuildings: { [key: string]: Building } = {
  lumberMill: {
    id: 'lumberMill',
    name: 'Lumber Mill',
    cost: { wood: 0, stone: 20, food: 0, gold: 50 },
    production: { wood: 2, stone: 0, food: 0, gold: 0 },
    count: 0
  },
  quarry: {
    id: 'quarry',
    name: 'Stone Quarry',
    cost: { wood: 30, stone: 0, food: 0, gold: 40 },
    production: { wood: 0, stone: 2, food: 0, gold: 0 },
    count: 0
  },
  farm: {
    id: 'farm',
    name: 'Farm',
    cost: { wood: 25, stone: 15, food: 0, gold: 30 },
    production: { wood: 0, stone: 0, food: 3, gold: 0 },
    count: 0
  },
  goldMine: {
    id: 'goldMine',
    name: 'Gold Mine',
    cost: { wood: 40, stone: 60, food: 0, gold: 0 },
    production: { wood: 0, stone: 0, food: 0, gold: 1 },
    count: 0
  },
  house: {
    id: 'house',
    name: 'House',
    cost: { wood: 50, stone: 30, food: 0, gold: 20 },
    production: { wood: 0, stone: 0, food: 0, gold: 0 },
    count: 0
  }
};

const ResourceManager: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    resources: { wood: 100, stone: 50, food: 75, gold: 100 },
    buildings: { ...initialBuildings },
    population: 5,
    maxPopulation: 10,
    gameStarted: false
  });

  const [message, setMessage] = useState<string>('Welcome to Resource Manager! Build structures to gather resources and grow your settlement.');
  const [gameTime, setGameTime] = useState<number>(0);

  const canAfford = useCallback((cost: Resources): boolean => {
    return (
      gameState.resources.wood >= cost.wood &&
      gameState.resources.stone >= cost.stone &&
      gameState.resources.food >= cost.food &&
      gameState.resources.gold >= cost.gold
    );
  }, [gameState.resources]);

  const buildStructure = (buildingId: string) => {
    const building = gameState.buildings[buildingId];
    
    if (canAfford(building.cost)) {
      setGameState(prev => ({
        ...prev,
        resources: {
          wood: prev.resources.wood - building.cost.wood,
          stone: prev.resources.stone - building.cost.stone,
          food: prev.resources.food - building.cost.food,
          gold: prev.resources.gold - building.cost.gold
        },
        buildings: {
          ...prev.buildings,
          [buildingId]: {
            ...building,
            count: building.count + 1
          }
        },
        maxPopulation: buildingId === 'house' 
          ? prev.maxPopulation + 5 
          : prev.maxPopulation
      }));

      setMessage(`Built ${building.name}! Now you have ${building.count + 1}.`);
    } else {
      setMessage(`Not enough resources to build ${building.name}!`);
    }
  };

  const produceResources = useCallback(() => {
    setGameState(prev => {
      let newResources = { ...prev.resources };
      
      // Production from buildings
      Object.values(prev.buildings).forEach(building => {
        if (building.count > 0) {
          newResources.wood += building.production.wood * building.count;
          newResources.stone += building.production.stone * building.count;
          newResources.food += building.production.food * building.count;
          newResources.gold += building.production.gold * building.count;
        }
      });

      // Population consumes food
      newResources.food = Math.max(0, newResources.food - prev.population);

      // Population growth (if enough food and housing)
      let newPopulation = prev.population;
      if (newResources.food > prev.population && prev.population < prev.maxPopulation) {
        if (Math.random() < 0.1) { // 10% chance per tick
          newPopulation++;
        }
      }

      return {
        ...prev,
        resources: newResources,
        population: newPopulation
      };
    });
  }, []);

  useEffect(() => {
    if (gameState.gameStarted) {
      const interval = setInterval(() => {
        produceResources();
        setGameTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.gameStarted, produceResources]);

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
    setMessage('Game started! Resources are now being produced automatically.');
  };

  const resetGame = () => {
    setGameState({
      resources: { wood: 100, stone: 50, food: 75, gold: 100 },
      buildings: { ...initialBuildings },
      population: 5,
      maxPopulation: 10,
      gameStarted: false
    });
    setMessage('Welcome to Resource Manager! Build structures to gather resources and grow your settlement.');
    setGameTime(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container">
      <div className="category-header">
        <h1>🏗️ Resource Manager</h1>
        <p>Build and manage your settlement! Gather resources and grow your population.</p>
      </div>
      
      <div className="game-board">
        {/* Game Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <h3>Resources</h3>
            <p>🪵 Wood: {gameState.resources.wood}</p>
            <p>🪨 Stone: {gameState.resources.stone}</p>
            <p>🌾 Food: {gameState.resources.food}</p>
            <p>💰 Gold: {gameState.resources.gold}</p>
          </div>
          
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
            <h3>Population</h3>
            <p>👥 Population: {gameState.population}/{gameState.maxPopulation}</p>
            <p>⏰ Time: {formatTime(gameTime)}</p>
            <p>📊 Status: {gameState.gameStarted ? 'Running' : 'Paused'}</p>
          </div>
        </div>

        {/* Message */}
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
          <p>{message}</p>
        </div>

        {/* Game Controls */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {!gameState.gameStarted ? (
            <button className="btn" onClick={startGame}>Start Game</button>
          ) : (
            <button className="btn" onClick={() => setGameState(prev => ({ ...prev, gameStarted: false }))}>
              Pause Game
            </button>
          )}
          <button className="btn" onClick={resetGame} style={{ marginLeft: '10px' }}>
            Reset Game
          </button>
        </div>

        {/* Buildings */}
        <div>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Buildings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.values(gameState.buildings).map(building => (
              <div
                key={building.id}
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <h4>{building.name} ({building.count})</h4>
                
                <div style={{ marginBottom: '10px' }}>
                  <strong>Cost:</strong>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {building.cost.wood > 0 && `🪵 ${building.cost.wood} `}
                    {building.cost.stone > 0 && `🪨 ${building.cost.stone} `}
                    {building.cost.food > 0 && `🌾 ${building.cost.food} `}
                    {building.cost.gold > 0 && `💰 ${building.cost.gold} `}
                  </div>
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <strong>Production per second:</strong>
                  <div style={{ fontSize: '14px', opacity: 0.8 }}>
                    {building.production.wood > 0 && `🪵 +${building.production.wood} `}
                    {building.production.stone > 0 && `🪨 +${building.production.stone} `}
                    {building.production.food > 0 && `🌾 +${building.production.food} `}
                    {building.production.gold > 0 && `💰 +${building.production.gold} `}
                    {building.id === 'house' && '🏠 +5 max population'}
                    {Object.values(building.production).every(val => val === 0) && building.id !== 'house' && 'No production'}
                  </div>
                </div>
                
                <button
                  className="btn"
                  onClick={() => buildStructure(building.id)}
                  disabled={!canAfford(building.cost)}
                  style={{ width: '100%' }}
                >
                  Build {building.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default ResourceManager;
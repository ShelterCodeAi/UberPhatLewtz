import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

interface Resources {
  population: number;
  happiness: number;
  energy: number;
  water: number;
  money: number;
  research: number;
}

interface Building {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'service' | 'utility';
  cost: Partial<Resources>;
  production: Partial<Resources>;
  upkeep: Partial<Resources>;
  count: number;
  maxCount?: number;
  unlocked: boolean;
  description: string;
  icon: string;
}

interface Technology {
  id: string;
  name: string;
  description: string;
  cost: number;
  unlocked: boolean;
  researched: boolean;
  effects: string[];
}

interface CityStats {
  level: number;
  experience: number;
  nextLevelExp: number;
  totalBuildings: number;
  efficiency: number;
}

interface GameState {
  resources: Resources;
  buildings: { [key: string]: Building };
  technologies: { [key: string]: Technology };
  cityStats: CityStats;
  gameTime: number;
  gameStarted: boolean;
  selectedBuilding: string | null;
  notifications: string[];
  achievements: string[];
}

const CityBuilderPro: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    resources: {
      population: 10,
      happiness: 75,
      energy: 100,
      water: 100,
      money: 1000,
      research: 0
    },
    buildings: {
      house: {
        id: 'house',
        name: 'Residential House',
        type: 'residential',
        cost: { money: 200 },
        production: { population: 4 },
        upkeep: { energy: 2, water: 3, money: 10 },
        count: 2,
        unlocked: true,
        description: 'Basic housing for citizens',
        icon: '🏠'
      },
      apartment: {
        id: 'apartment',
        name: 'Apartment Complex',
        type: 'residential',
        cost: { money: 800 },
        production: { population: 20 },
        upkeep: { energy: 8, water: 12, money: 40 },
        count: 0,
        unlocked: false,
        description: 'High-density housing for more citizens',
        icon: '🏢'
      },
      shop: {
        id: 'shop',
        name: 'Shopping Center',
        type: 'commercial',
        cost: { money: 500 },
        production: { money: 80, happiness: 5 },
        upkeep: { energy: 5, water: 2 },
        count: 1,
        unlocked: true,
        description: 'Generates income and happiness',
        icon: '🛍️'
      },
      mall: {
        id: 'mall',
        name: 'Shopping Mall',
        type: 'commercial',
        cost: { money: 2000 },
        production: { money: 300, happiness: 20 },
        upkeep: { energy: 20, water: 8 },
        count: 0,
        unlocked: false,
        description: 'Large commercial center',
        icon: '🏬'
      },
      factory: {
        id: 'factory',
        name: 'Manufacturing Plant',
        type: 'industrial',
        cost: { money: 1200 },
        production: { money: 150 },
        upkeep: { energy: 15, water: 10, happiness: -10 },
        count: 0,
        unlocked: true,
        description: 'Produces goods but reduces happiness',
        icon: '🏭'
      },
      powerplant: {
        id: 'powerplant',
        name: 'Power Plant',
        type: 'utility',
        cost: { money: 1500 },
        production: { energy: 200 },
        upkeep: { money: 100, happiness: -5 },
        count: 1,
        unlocked: true,
        description: 'Generates electricity for the city',
        icon: '⚡'
      },
      waterplant: {
        id: 'waterplant',
        name: 'Water Treatment Plant',
        type: 'utility',
        cost: { money: 1000 },
        production: { water: 150 },
        upkeep: { energy: 10, money: 50 },
        count: 1,
        unlocked: true,
        description: 'Provides clean water to citizens',
        icon: '💧'
      },
      park: {
        id: 'park',
        name: 'City Park',
        type: 'service',
        cost: { money: 300 },
        production: { happiness: 15 },
        upkeep: { water: 5, money: 20 },
        count: 1,
        unlocked: true,
        description: 'Improves citizen happiness',
        icon: '🌳'
      },
      hospital: {
        id: 'hospital',
        name: 'Hospital',
        type: 'service',
        cost: { money: 2500 },
        production: { happiness: 25, population: 5 },
        upkeep: { energy: 20, water: 15, money: 150 },
        count: 0,
        unlocked: false,
        description: 'Improves health and allows population growth',
        icon: '🏥'
      },
      university: {
        id: 'university',
        name: 'University',
        type: 'service',
        cost: { money: 3000 },
        production: { research: 10, happiness: 10 },
        upkeep: { energy: 15, water: 10, money: 200 },
        count: 0,
        unlocked: false,
        description: 'Generates research points and happiness',
        icon: '🎓'
      }
    },
    technologies: {
      planning: {
        id: 'planning',
        name: 'Urban Planning',
        description: 'Unlocks apartment complexes and improves building efficiency',
        cost: 50,
        unlocked: true,
        researched: false,
        effects: ['Unlocks Apartment Complex', '+10% building efficiency']
      },
      commerce: {
        id: 'commerce',
        name: 'Advanced Commerce',
        description: 'Unlocks shopping malls and improves commercial income',
        cost: 100,
        unlocked: false,
        researched: false,
        effects: ['Unlocks Shopping Mall', '+20% commercial income']
      },
      healthcare: {
        id: 'healthcare',
        name: 'Modern Healthcare',
        description: 'Unlocks hospitals and improves population growth',
        cost: 150,
        unlocked: false,
        researched: false,
        effects: ['Unlocks Hospital', '+50% population growth rate']
      },
      education: {
        id: 'education',
        name: 'Higher Education',
        description: 'Unlocks universities and boosts research',
        cost: 200,
        unlocked: false,
        researched: false,
        effects: ['Unlocks University', '+100% research generation']
      }
    },
    cityStats: {
      level: 1,
      experience: 0,
      nextLevelExp: 100,
      totalBuildings: 5,
      efficiency: 100
    },
    gameTime: 0,
    gameStarted: false,
    selectedBuilding: null,
    notifications: [],
    achievements: []
  });

  const addNotification = useCallback((message: string) => {
    setGameState(prev => ({
      ...prev,
      notifications: [...prev.notifications.slice(-4), message] // Keep last 5 notifications
    }));
  }, []);

  const checkAchievements = useCallback((newState: GameState) => {
    const achievements: string[] = [];
    
    if (newState.resources.population >= 100 && !gameState.achievements.includes('Population Boom')) {
      achievements.push('Population Boom');
    }
    if (newState.resources.money >= 10000 && !gameState.achievements.includes('Wealthy City')) {
      achievements.push('Wealthy City');
    }
    if (newState.cityStats.totalBuildings >= 20 && !gameState.achievements.includes('Master Builder')) {
      achievements.push('Master Builder');
    }
    
    if (achievements.length > 0) {
      setGameState(prev => ({
        ...prev,
        achievements: [...prev.achievements, ...achievements]
      }));
      
      achievements.forEach(achievement => {
        addNotification(`🏆 Achievement Unlocked: ${achievement}!`);
      });
    }
  }, [gameState.achievements, addNotification]);

  const canAfford = useCallback((cost: Partial<Resources>): boolean => {
    return Object.entries(cost).every(([resource, amount]) => {
      const currentAmount = gameState.resources[resource as keyof Resources];
      return currentAmount >= (amount || 0);
    });
  }, [gameState.resources]);

  const buildStructure = (buildingId: string) => {
    const building = gameState.buildings[buildingId];
    
    if (!building.unlocked) {
      addNotification(`${building.name} is not unlocked yet!`);
      return;
    }
    
    if (!canAfford(building.cost)) {
      addNotification(`Not enough resources to build ${building.name}!`);
      return;
    }

    setGameState(prev => {
      const newResources = { ...prev.resources };
      
      // Deduct costs
      Object.entries(building.cost).forEach(([resource, amount]) => {
        if (amount) {
          newResources[resource as keyof Resources] -= amount;
        }
      });

      const newBuildings = {
        ...prev.buildings,
        [buildingId]: {
          ...building,
          count: building.count + 1
        }
      };

      const newState = {
        ...prev,
        resources: newResources,
        buildings: newBuildings,
        cityStats: {
          ...prev.cityStats,
          totalBuildings: prev.cityStats.totalBuildings + 1,
          experience: prev.cityStats.experience + 10
        }
      };

      return newState;
    });

    addNotification(`Built ${building.name}!`);
  };

  const researchTechnology = (techId: string) => {
    const tech = gameState.technologies[techId];
    
    if (!tech.unlocked) {
      addNotification(`${tech.name} is not available for research!`);
      return;
    }
    
    if (tech.researched) {
      addNotification(`${tech.name} is already researched!`);
      return;
    }
    
    if (gameState.resources.research < tech.cost) {
      addNotification(`Not enough research points for ${tech.name}!`);
      return;
    }

    setGameState(prev => {
      const newState = {
        ...prev,
        resources: {
          ...prev.resources,
          research: prev.resources.research - tech.cost
        },
        technologies: {
          ...prev.technologies,
          [techId]: {
            ...tech,
            researched: true
          }
        }
      };

      // Apply technology effects
      if (techId === 'planning') {
        newState.buildings.apartment.unlocked = true;
        newState.cityStats.efficiency = 110;
      } else if (techId === 'commerce') {
        newState.buildings.mall.unlocked = true;
        newState.technologies.healthcare.unlocked = true;
      } else if (techId === 'healthcare') {
        newState.buildings.hospital.unlocked = true;
        newState.technologies.education.unlocked = true;
      } else if (techId === 'education') {
        newState.buildings.university.unlocked = true;
      }

      return newState;
    });

    addNotification(`🔬 Researched ${tech.name}!`);
  };

  const startGame = () => {
    setGameState(prev => ({ ...prev, gameStarted: true }));
  };

  // Game loop
  useEffect(() => {
    if (!gameState.gameStarted) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newResources = { ...prev.resources };
        
        // Calculate production and upkeep
        Object.values(prev.buildings).forEach(building => {
          if (building.count > 0) {
            // Add production
            Object.entries(building.production).forEach(([resource, amount]) => {
              if (amount) {
                const efficiency = prev.cityStats.efficiency / 100;
                newResources[resource as keyof Resources] += amount * building.count * efficiency;
              }
            });
            
            // Subtract upkeep
            Object.entries(building.upkeep).forEach(([resource, amount]) => {
              if (amount) {
                newResources[resource as keyof Resources] -= amount * building.count;
              }
            });
          }
        });

        // Ensure resources don't go negative (except happiness which can)
        newResources.population = Math.max(0, newResources.population);
        newResources.energy = Math.max(0, newResources.energy);
        newResources.water = Math.max(0, newResources.water);
        newResources.money = Math.max(0, newResources.money);
        newResources.research = Math.max(0, newResources.research);
        
        // Happiness can be negative but affects other resources
        if (newResources.happiness < 0) {
          newResources.money -= 10; // Unhappy citizens pay less taxes
          newResources.population -= 1; // People leave the city
        }
        
        // Check for resource shortages
        if (newResources.energy <= 0) {
          newResources.happiness -= 5;
        }
        if (newResources.water <= 0) {
          newResources.happiness -= 5;
          newResources.population -= 2;
        }

        // Level up check
        let newCityStats = { ...prev.cityStats };
        if (newCityStats.experience >= newCityStats.nextLevelExp) {
          newCityStats.level += 1;
          newCityStats.experience = 0;
          newCityStats.nextLevelExp = newCityStats.level * 100;
          
          // Unlock new technologies
          if (newCityStats.level >= 2 && !prev.technologies.commerce.unlocked) {
            setGameState(current => ({
              ...current,
              technologies: {
                ...current.technologies,
                commerce: { ...current.technologies.commerce, unlocked: true }
              }
            }));
          }
        }

        const newState = {
          ...prev,
          resources: newResources,
          cityStats: newCityStats,
          gameTime: prev.gameTime + 1
        };

        // Check achievements asynchronously
        setTimeout(() => checkAchievements(newState), 0);

        return newState;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(gameLoop);
  }, [gameState.gameStarted, checkAchievements]);

  const getResourceColor = (current: number, isPositive: boolean = true) => {
    if (!isPositive && current < 0) return '#e74c3c';
    if (current < 20) return '#e74c3c';
    if (current < 50) return '#f39c12';
    return '#2ecc71';
  };

  const formatNumber = (num: number) => {
    return Math.floor(num).toLocaleString();
  };

  return (
    <div className="container" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="category-header">
        <h1>🏙️ City Builder Pro</h1>
        <p>Advanced City Building with Enhanced Graphics and Complex Systems</p>
      </div>

      {!gameState.gameStarted ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.9)', 
            padding: '40px', 
            borderRadius: '20px',
            maxWidth: '800px',
            margin: '0 auto',
            border: '3px solid #4ecdc4'
          }}>
            <h2>Welcome to City Builder Pro!</h2>
            <p>Build and manage a thriving metropolis with advanced systems:</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '30px 0' }}>
              <div>
                <h3>🏗️ Advanced Building System</h3>
                <p>Residential, Commercial, Industrial, Service, and Utility buildings</p>
              </div>
              <div>
                <h3>🔬 Research & Technology</h3>
                <p>Unlock new buildings and improvements through research</p>
              </div>
              <div>
                <h3>📊 Complex Resource Management</h3>
                <p>Balance Population, Happiness, Energy, Water, Money, and Research</p>
              </div>
              <div>
                <h3>🏆 Achievements & Progression</h3>
                <p>Level up your city and unlock achievements</p>
              </div>
            </div>
            <button 
              className="btn" 
              onClick={startGame} 
              style={{ 
                fontSize: '20px', 
                padding: '15px 30px',
                background: 'linear-gradient(45deg, #4ecdc4, #44a08d)'
              }}
            >
              Start Building Your City
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginTop: '20px' }}>
          {/* Main Game Area */}
          <div>
            {/* Resource Dashboard */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #4ecdc4'
            }}>
              <h3 style={{ color: '#4ecdc4', textAlign: 'center' }}>City Resources</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, 1fr)', 
                gap: '15px',
                marginTop: '15px'
              }}>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>👥</div>
                  <div style={{ color: getResourceColor(gameState.resources.population) }}>
                    Population: {formatNumber(gameState.resources.population)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>😊</div>
                  <div style={{ color: getResourceColor(gameState.resources.happiness, false) }}>
                    Happiness: {formatNumber(gameState.resources.happiness)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>⚡</div>
                  <div style={{ color: getResourceColor(gameState.resources.energy) }}>
                    Energy: {formatNumber(gameState.resources.energy)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>💧</div>
                  <div style={{ color: getResourceColor(gameState.resources.water) }}>
                    Water: {formatNumber(gameState.resources.water)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>💰</div>
                  <div style={{ color: getResourceColor(gameState.resources.money) }}>
                    Money: {formatNumber(gameState.resources.money)}
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '15px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '24px' }}>🔬</div>
                  <div style={{ color: getResourceColor(gameState.resources.research) }}>
                    Research: {formatNumber(gameState.resources.research)}
                  </div>
                </div>
              </div>
            </div>

            {/* Buildings */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #4ecdc4'
            }}>
              <h3 style={{ color: '#4ecdc4' }}>Buildings</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                gap: '15px'
              }}>
                {Object.values(gameState.buildings).map(building => (
                  <div
                    key={building.id}
                    style={{
                      padding: '15px',
                      backgroundColor: building.unlocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                      borderRadius: '10px',
                      border: `2px solid ${building.unlocked ? '#4ecdc4' : '#666'}`,
                      opacity: building.unlocked ? 1 : 0.6
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ fontSize: '20px', marginRight: '10px' }}>{building.icon}</span>
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{building.name}</div>
                        <div style={{ fontSize: '12px', opacity: 0.8 }}>Count: {building.count}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', marginBottom: '10px' }}>{building.description}</div>
                    
                    {/* Cost */}
                    <div style={{ fontSize: '11px', marginBottom: '8px' }}>
                      <strong>Cost:</strong> {Object.entries(building.cost).map(([resource, amount]) => 
                        `${resource}: ${amount}`
                      ).join(', ')}
                    </div>
                    
                    {/* Production */}
                    {Object.keys(building.production).length > 0 && (
                      <div style={{ fontSize: '11px', marginBottom: '8px', color: '#2ecc71' }}>
                        <strong>Production:</strong> {Object.entries(building.production).map(([resource, amount]) => 
                          `${resource}: +${amount}`
                        ).join(', ')}
                      </div>
                    )}
                    
                    {/* Upkeep */}
                    {Object.keys(building.upkeep).length > 0 && (
                      <div style={{ fontSize: '11px', marginBottom: '10px', color: '#e74c3c' }}>
                        <strong>Upkeep:</strong> {Object.entries(building.upkeep).map(([resource, amount]) => 
                          `${resource}: -${amount}`
                        ).join(', ')}
                      </div>
                    )}
                    
                    <button
                      onClick={() => buildStructure(building.id)}
                      disabled={!building.unlocked || !canAfford(building.cost)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        backgroundColor: building.unlocked && canAfford(building.cost) ? '#4ecdc4' : '#666',
                        color: building.unlocked && canAfford(building.cost) ? '#1a1a1a' : '#ccc',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: building.unlocked && canAfford(building.cost) ? 'pointer' : 'not-allowed'
                      }}
                    >
                      {building.unlocked ? 'Build' : 'Locked'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* City Stats */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #4ecdc4'
            }}>
              <h3 style={{ color: '#4ecdc4' }}>City Stats</h3>
              <p><strong>Level:</strong> {gameState.cityStats.level}</p>
              <p><strong>Buildings:</strong> {gameState.cityStats.totalBuildings}</p>
              <p><strong>Efficiency:</strong> {gameState.cityStats.efficiency}%</p>
              
              {/* Experience Bar */}
              <div style={{ marginTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span>Experience</span>
                  <span>{gameState.cityStats.experience}/{gameState.cityStats.nextLevelExp}</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '20px', 
                  backgroundColor: '#333', 
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(gameState.cityStats.experience / gameState.cityStats.nextLevelExp) * 100}%`,
                    height: '100%',
                    backgroundColor: '#4ecdc4',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>

            {/* Research & Technology */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '20px',
              border: '2px solid #9b59b6'
            }}>
              <h3 style={{ color: '#9b59b6' }}>🔬 Research</h3>
              {Object.values(gameState.technologies).map(tech => (
                <div
                  key={tech.id}
                  style={{
                    padding: '10px',
                    marginBottom: '10px',
                    backgroundColor: tech.researched ? 'rgba(46, 204, 113, 0.2)' : 
                                   tech.unlocked ? 'rgba(255, 255, 255, 0.1)' : 'rgba(100, 100, 100, 0.1)',
                    borderRadius: '8px',
                    border: `1px solid ${tech.researched ? '#2ecc71' : tech.unlocked ? '#9b59b6' : '#666'}`,
                    opacity: tech.unlocked ? 1 : 0.6
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                    {tech.name} {tech.researched ? '✅' : ''}
                  </div>
                  <div style={{ fontSize: '12px', marginBottom: '8px' }}>{tech.description}</div>
                  <div style={{ fontSize: '11px', marginBottom: '8px', color: '#f39c12' }}>
                    Cost: {tech.cost} Research Points
                  </div>
                  {tech.unlocked && !tech.researched && (
                    <button
                      onClick={() => researchTechnology(tech.id)}
                      disabled={gameState.resources.research < tech.cost}
                      style={{
                        width: '100%',
                        padding: '6px',
                        backgroundColor: gameState.resources.research >= tech.cost ? '#9b59b6' : '#666',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: gameState.resources.research >= tech.cost ? 'pointer' : 'not-allowed',
                        fontSize: '12px'
                      }}
                    >
                      Research
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Notifications */}
            {gameState.notifications.length > 0 && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: '15px',
                borderRadius: '15px',
                marginBottom: '20px',
                border: '2px solid #f39c12'
              }}>
                <h4 style={{ color: '#f39c12' }}>📢 Notifications</h4>
                {gameState.notifications.slice(-3).map((notification, index) => (
                  <div key={index} style={{ 
                    fontSize: '12px', 
                    marginBottom: '5px',
                    padding: '5px',
                    backgroundColor: 'rgba(243, 156, 18, 0.1)',
                    borderRadius: '4px'
                  }}>
                    {notification}
                  </div>
                ))}
              </div>
            )}

            {/* Achievements */}
            {gameState.achievements.length > 0 && (
              <div style={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: '15px',
                borderRadius: '15px',
                border: '2px solid #f1c40f'
              }}>
                <h4 style={{ color: '#f1c40f' }}>🏆 Achievements</h4>
                {gameState.achievements.map((achievement, index) => (
                  <div key={index} style={{ 
                    fontSize: '12px', 
                    marginBottom: '3px',
                    color: '#f1c40f'
                  }}>
                    🏆 {achievement}
                  </div>
                ))}
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

export default CityBuilderPro;
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityY: number;
  onGround: boolean;
  color: string;
  trail: { x: number; y: number; opacity: number }[];
}

interface Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'spike' | 'barrier' | 'moving' | 'laser';
  color: string;
  speed?: number;
  direction?: number;
  pattern?: string;
}

interface PowerUp {
  x: number;
  y: number;
  type: 'speed' | 'jump' | 'shield' | 'score';
  color: string;
  collected: boolean;
  pulsePhase: number;
}

interface Particle {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface GameState {
  player: Player;
  obstacles: Obstacle[];
  powerUps: PowerUp[];
  particles: Particle[];
  score: number;
  distance: number;
  level: number;
  speed: number;
  gameStarted: boolean;
  gameOver: boolean;
  isPaused: boolean;
  highScore: number;
  combo: number;
  shieldActive: boolean;
  speedBoostActive: boolean;
  backgroundOffset: number;
  neonIntensity: number;
}

const NeonRunner: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const keysRef = useRef<{ [key: string]: boolean }>({});

  const [gameState, setGameState] = useState<GameState>({
    player: {
      x: 100,
      y: 400,
      width: 30,
      height: 30,
      velocityY: 0,
      onGround: true,
      color: '#00ffff',
      trail: []
    },
    obstacles: [],
    powerUps: [],
    particles: [],
    score: 0,
    distance: 0,
    level: 1,
    speed: 3,
    gameStarted: false,
    gameOver: false,
    isPaused: false,
    highScore: parseInt(localStorage.getItem('neonRunnerHighScore') || '0'),
    combo: 0,
    shieldActive: false,
    speedBoostActive: false,
    backgroundOffset: 0,
    neonIntensity: 1
  });

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.8;
  const JUMP_FORCE = -15;
  const GROUND_Y = 500;

  const generateObstacle = useCallback((x: number): Obstacle => {
    const types: Obstacle['type'][] = ['spike', 'barrier', 'moving', 'laser'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const obstacles = {
      spike: {
        width: 20,
        height: 40,
        y: GROUND_Y - 40,
        color: '#ff3030',
        pattern: 'triangle'
      },
      barrier: {
        width: 30,
        height: 80,
        y: GROUND_Y - 80,
        color: '#ff8800',
        pattern: 'rectangle'
      },
      moving: {
        width: 25,
        height: 25,
        y: GROUND_Y - 100,
        color: '#ff00ff',
        speed: 2,
        direction: 1,
        pattern: 'circle'
      },
      laser: {
        width: 5,
        height: 150,
        y: GROUND_Y - 150,
        color: '#ff0000',
        pattern: 'laser'
      }
    };

    return {
      x,
      ...obstacles[type],
      type
    };
  }, []);

  const generatePowerUp = useCallback((x: number): PowerUp => {
    const types: PowerUp['type'][] = ['speed', 'jump', 'shield', 'score'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const colors = {
      speed: '#ffff00',
      jump: '#00ff00',
      shield: '#0080ff',
      score: '#ff8000'
    };

    return {
      x,
      y: GROUND_Y - 60 - Math.random() * 100,
      type,
      color: colors[type],
      collected: false,
      pulsePhase: 0
    };
  }, []);

  const createParticle = useCallback((x: number, y: number, color: string) => {
    return {
      x,
      y,
      velocityX: (Math.random() - 0.5) * 8,
      velocityY: (Math.random() - 0.5) * 8,
      life: 30,
      maxLife: 30,
      color,
      size: Math.random() * 4 + 2
    };
  }, []);

  const checkCollision = useCallback((rect1: any, rect2: any): boolean => {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }, []);

  const drawPlayer = useCallback((ctx: CanvasRenderingContext2D, player: Player) => {
    // Draw trail
    player.trail.forEach((point, index) => {
      const alpha = point.opacity * 0.6;
      ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      const size = 15 * alpha;
      ctx.fillRect(point.x, point.y, size, size);
    });

    // Draw main player with neon effect
    ctx.shadowColor = player.color;
    ctx.shadowBlur = gameState.shieldActive ? 30 : 15;
    ctx.fillStyle = gameState.shieldActive ? '#0080ff' : player.color;
    
    // Player body
    ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Additional glow effect
    ctx.shadowBlur = 25;
    ctx.fillRect(player.x + 2, player.y + 2, player.width - 4, player.height - 4);
    
    ctx.shadowBlur = 0;
  }, [gameState.shieldActive]);

  const drawObstacle = useCallback((ctx: CanvasRenderingContext2D, obstacle: Obstacle) => {
    ctx.shadowColor = obstacle.color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = obstacle.color;

    switch (obstacle.pattern) {
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(obstacle.x + obstacle.width / 2, obstacle.y);
        ctx.lineTo(obstacle.x, obstacle.y + obstacle.height);
        ctx.lineTo(obstacle.x + obstacle.width, obstacle.y + obstacle.height);
        ctx.closePath();
        ctx.fill();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height / 2, obstacle.width / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'laser':
        // Animated laser effect
        ctx.shadowBlur = 25;
        for (let i = 0; i < 3; i++) {
          ctx.fillRect(obstacle.x + i, obstacle.y, obstacle.width - i * 2, obstacle.height);
        }
        break;
      default:
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
    
    ctx.shadowBlur = 0;
  }, []);

  const drawPowerUp = useCallback((ctx: CanvasRenderingContext2D, powerUp: PowerUp) => {
    if (powerUp.collected) return;

    const pulse = Math.sin(powerUp.pulsePhase) * 0.3 + 0.7;
    ctx.shadowColor = powerUp.color;
    ctx.shadowBlur = 20 * pulse;
    ctx.fillStyle = powerUp.color;
    
    const size = 20 * pulse;
    const offset = (20 - size) / 2;
    
    ctx.fillRect(powerUp.x + offset, powerUp.y + offset, size, size);
    
    // Draw icon based on type
    ctx.fillStyle = '#000';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    const iconX = powerUp.x + 10;
    const iconY = powerUp.y + 15;
    
    switch (powerUp.type) {
      case 'speed': ctx.fillText('⚡', iconX, iconY); break;
      case 'jump': ctx.fillText('↑', iconX, iconY); break;
      case 'shield': ctx.fillText('🛡️', iconX, iconY); break;
      case 'score': ctx.fillText('★', iconX, iconY); break;
    }
    
    ctx.shadowBlur = 0;
  }, []);

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = particle.life / particle.maxLife;
    ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10 * alpha;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    ctx.shadowBlur = 0;
  }, []);

  const drawBackground = useCallback((ctx: CanvasRenderingContext2D) => {
    // Animated grid background
    const gridSize = 50;
    const offsetX = gameState.backgroundOffset % gridSize;
    
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 * gameState.neonIntensity})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 5;
    
    // Vertical lines
    for (let x = -offsetX; x < CANVAS_WIDTH; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y < CANVAS_HEIGHT; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    
    // Ground
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    
    // Ground glow
    ctx.fillStyle = `rgba(0, 255, 255, ${0.2 * gameState.neonIntensity})`;
    ctx.fillRect(0, GROUND_Y - 2, CANVAS_WIDTH, 4);
  }, [gameState.backgroundOffset, gameState.neonIntensity]);

  const drawUI = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#00ffff';
    ctx.font = '20px monospace';
    ctx.textAlign = 'left';
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    ctx.fillText(`Distance: ${Math.floor(gameState.distance)}m`, 20, 70);
    ctx.fillText(`Level: ${gameState.level}`, 20, 100);
    ctx.fillText(`Speed: ${gameState.speed.toFixed(1)}x`, 20, 130);
    
    if (gameState.combo > 1) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '24px monospace';
      ctx.fillText(`Combo: x${gameState.combo}`, 20, 170);
    }
    
    // Status effects
    let statusY = 200;
    if (gameState.shieldActive) {
      ctx.fillStyle = '#0080ff';
      ctx.font = '16px monospace';
      ctx.fillText('🛡️ Shield Active', 20, statusY);
      statusY += 25;
    }
    
    if (gameState.speedBoostActive) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px monospace';
      ctx.fillText('⚡ Speed Boost', 20, statusY);
    }
    
    ctx.shadowBlur = 0;
  }, [gameState.score, gameState.distance, gameState.level, gameState.speed, gameState.combo, gameState.shieldActive, gameState.speedBoostActive]);

  const gameLoop = useCallback(() => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.isPaused) {
      return;
    }

    setGameState(prev => {
      const newState = { ...prev };
      
      // Update player
      const player = { ...newState.player };
      
      // Handle input
      if (keysRef.current['Space'] || keysRef.current['ArrowUp']) {
        if (player.onGround) {
          player.velocityY = JUMP_FORCE;
          player.onGround = false;
          
          // Create jump particles
          for (let i = 0; i < 5; i++) {
            newState.particles.push(createParticle(player.x + 15, player.y + 30, '#00ffff'));
          }
        }
      }
      
      // Apply gravity
      if (!player.onGround) {
        player.velocityY += GRAVITY;
      }
      
      // Update position
      player.y += player.velocityY;
      
      // Ground collision
      if (player.y >= GROUND_Y - player.height) {
        player.y = GROUND_Y - player.height;
        player.velocityY = 0;
        player.onGround = true;
      }
      
      // Update trail
      player.trail.unshift({ x: player.x, y: player.y, opacity: 1 });
      player.trail = player.trail.slice(0, 8).map((point, index) => ({
        ...point,
        opacity: 1 - (index / 8)
      }));
      
      newState.player = player;
      
      // Update game speed and difficulty
      newState.distance += newState.speed;
      newState.level = Math.floor(newState.distance / 500) + 1;
      newState.speed = Math.min(8, 3 + (newState.level - 1) * 0.5);
      
      // Update background
      newState.backgroundOffset += newState.speed;
      
      // Generate obstacles
      if (Math.random() < 0.02 * newState.level) {
        newState.obstacles.push(generateObstacle(CANVAS_WIDTH));
      }
      
      // Generate power-ups
      if (Math.random() < 0.005) {
        newState.powerUps.push(generatePowerUp(CANVAS_WIDTH));
      }
      
      // Update obstacles
      newState.obstacles = newState.obstacles.filter(obstacle => {
        obstacle.x -= newState.speed;
        
        // Update moving obstacles
        if (obstacle.type === 'moving' && obstacle.speed && obstacle.direction) {
          obstacle.y += obstacle.speed * obstacle.direction;
          if (obstacle.y <= GROUND_Y - 200 || obstacle.y >= GROUND_Y - 50) {
            obstacle.direction *= -1;
          }
        }
        
        return obstacle.x + obstacle.width > 0;
      });
      
      // Update power-ups
      newState.powerUps = newState.powerUps.filter(powerUp => {
        powerUp.x -= newState.speed;
        powerUp.pulsePhase += 0.2;
        return powerUp.x + 20 > 0;
      });
      
      // Update particles
      newState.particles = newState.particles.filter(particle => {
        particle.x += particle.velocityX;
        particle.y += particle.velocityY;
        particle.velocityY += 0.3; // Gravity for particles
        particle.life--;
        return particle.life > 0;
      });
      
      // Collision detection with obstacles
      for (const obstacle of newState.obstacles) {
        if (checkCollision(player, obstacle)) {
          if (newState.shieldActive) {
            newState.shieldActive = false;
            // Create shield break particles
            for (let i = 0; i < 10; i++) {
              newState.particles.push(createParticle(player.x + 15, player.y + 15, '#0080ff'));
            }
          } else {
            newState.gameOver = true;
            break;
          }
        }
      }
      
      // Collision detection with power-ups
      for (const powerUp of newState.powerUps) {
        if (!powerUp.collected && checkCollision(player, powerUp)) {
          powerUp.collected = true;
          newState.score += 50;
          newState.combo++;
          
          // Apply power-up effect
          switch (powerUp.type) {
            case 'speed':
              newState.speedBoostActive = true;
              setTimeout(() => {
                setGameState(prev => ({ ...prev, speedBoostActive: false }));
              }, 5000);
              break;
            case 'jump':
              player.velocityY = JUMP_FORCE * 1.5;
              player.onGround = false;
              break;
            case 'shield':
              newState.shieldActive = true;
              setTimeout(() => {
                setGameState(prev => ({ ...prev, shieldActive: false }));
              }, 8000);
              break;
            case 'score':
              newState.score += 200 * newState.combo;
              break;
          }
          
          // Create power-up particles
          for (let i = 0; i < 8; i++) {
            newState.particles.push(createParticle(powerUp.x + 10, powerUp.y + 10, powerUp.color));
          }
        }
      }
      
      // Update score
      newState.score += Math.floor(newState.speed) * newState.combo;
      
      // Update neon intensity (pulsing effect)
      newState.neonIntensity = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
      
      // Reset combo if no power-up collected for a while
      if (Math.random() < 0.001) {
        newState.combo = Math.max(1, newState.combo - 1);
      }
      
      return newState;
    });
  }, [gameState.gameStarted, gameState.gameOver, gameState.isPaused, generateObstacle, generatePowerUp, createParticle, checkCollision, JUMP_FORCE]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with dark background
    ctx.fillStyle = '#000011';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (gameState.gameStarted && !gameState.gameOver) {
      drawBackground(ctx);
      
      // Draw game objects
      gameState.obstacles.forEach(obstacle => drawObstacle(ctx, obstacle));
      gameState.powerUps.forEach(powerUp => drawPowerUp(ctx, powerUp));
      gameState.particles.forEach(particle => drawParticle(ctx, particle));
      
      drawPlayer(ctx, gameState.player);
      drawUI(ctx);
      
      if (gameState.isPaused) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.fillStyle = '#00ffff';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        ctx.shadowBlur = 0;
      }
    }
  }, [gameState, drawBackground, drawObstacle, drawPowerUp, drawParticle, drawPlayer, drawUI]);

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true,
      gameOver: false,
      score: 0,
      distance: 0,
      level: 1,
      speed: 3,
      combo: 1,
      obstacles: [],
      powerUps: [],
      particles: [],
      player: {
        ...prev.player,
        x: 100,
        y: GROUND_Y - 30,
        velocityY: 0,
        onGround: true,
        trail: []
      },
      shieldActive: false,
      speedBoostActive: false
    }));
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    if (gameState.score > gameState.highScore) {
      localStorage.setItem('neonRunnerHighScore', gameState.score.toString());
    }
    
    setGameState(prev => ({
      ...prev,
      gameStarted: false,
      gameOver: false,
      highScore: Math.max(prev.highScore, prev.score)
    }));
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      
      if (e.code === 'Space') {
        e.preventDefault();
      }
      
      if (e.code === 'KeyP') {
        pauseGame();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const animate = () => {
      gameLoop();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, draw]);

  return (
    <div className="container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #000011 0%, #001122 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="category-header">
        <h1>🏃‍♂️ Neon Runner</h1>
        <p>High-Speed Arcade Action with Stunning Neon Graphics</p>
      </div>

      {!gameState.gameStarted ? (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 50, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #00ffff',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#00ffff', textShadow: '0 0 20px #00ffff' }}>
            Welcome to Neon Runner!
          </h2>
          <p>Experience high-speed action with spectacular neon visuals</p>
          <div style={{ margin: '20px 0' }}>
            <p>🎮 <strong>Controls:</strong></p>
            <p>SPACE or ↑ - Jump</p>
            <p>P - Pause</p>
          </div>
          <div style={{ margin: '20px 0' }}>
            <p>⚡ <strong>Power-ups:</strong></p>
            <p>Speed Boost • Jump Boost • Shield • Score Multiplier</p>
          </div>
          <p style={{ color: '#ffff00' }}>High Score: {gameState.highScore}</p>
          <button
            onClick={startGame}
            style={{
              padding: '15px 30px',
              fontSize: '20px',
              backgroundColor: '#00ffff',
              color: '#000011',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              textShadow: 'none',
              boxShadow: '0 0 20px #00ffff',
              marginTop: '20px'
            }}
          >
            Start Game
          </button>
        </div>
      ) : gameState.gameOver ? (
        <div style={{
          textAlign: 'center',
          backgroundColor: 'rgba(50, 0, 0, 0.9)',
          padding: '40px',
          borderRadius: '20px',
          border: '2px solid #ff3030',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#ff3030', textShadow: '0 0 20px #ff3030' }}>
            Game Over!
          </h2>
          <p style={{ fontSize: '24px', color: '#00ffff' }}>Final Score: {gameState.score}</p>
          <p style={{ fontSize: '18px', color: '#ffff00' }}>Distance: {Math.floor(gameState.distance)}m</p>
          <p style={{ fontSize: '18px', color: '#ff8800' }}>Level Reached: {gameState.level}</p>
          {gameState.score > gameState.highScore && (
            <p style={{ color: '#ffff00', fontSize: '20px', textShadow: '0 0 10px #ffff00' }}>
              🏆 NEW HIGH SCORE! 🏆
            </p>
          )}
          <button
            onClick={resetGame}
            style={{
              padding: '15px 30px',
              fontSize: '18px',
              backgroundColor: '#00ffff',
              color: '#000011',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 0 20px #00ffff',
              marginTop: '20px'
            }}
          >
            Play Again
          </button>
        </div>
      ) : null}

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: '2px solid #00ffff',
          borderRadius: '10px',
          boxShadow: '0 0 30px #00ffff',
          backgroundColor: '#000011'
        }}
      />

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/" className="btn">Back to Home</Link>
      </div>
    </div>
  );
};

export default NeonRunner;
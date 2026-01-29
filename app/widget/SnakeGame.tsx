import { useState, useEffect, useRef, useCallback } from 'react';
import { SNAKE_CONFIG } from '../game/snakeConstants';
import { SnakeGameLogic } from '../game/snakeGameLogic';
import { SnakeControlsManager } from '../game/snakeControls';
import type { GameState, Snake, Food, GameDimensions } from '../game/snakeTypes';

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLogicRef = useRef<SnakeGameLogic | null>(null);
  const controlsManagerRef = useRef<SnakeControlsManager | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const moveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [dimensions, setDimensions] = useState<GameDimensions>(
    SNAKE_CONFIG.getResponsiveDimensions()
  );

  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    highScore: 0,
    level: 1,
    speed: SNAKE_CONFIG.SNAKE_SPEED,
  });

  const [snake, setSnake] = useState<Snake>({
    body: [],
    direction: 'right',
    color: SNAKE_CONFIG.COLORS.SNAKE_HEAD,
  });

  const [food, setFood] = useState<Food>({
    position: { x: 0, y: 0 },
    color: SNAKE_CONFIG.COLORS.FOOD_NORMAL,
    type: 'normal',
    points: SNAKE_CONFIG.POINTS_PER_FOOD,
  });

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('snake-high-score');
    if (savedHighScore) {
      setGameState(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  // Initialize game
  useEffect(() => {
    if (canvasRef.current) {
      gameLogicRef.current = new SnakeGameLogic(dimensions);

      const newSnake = gameLogicRef.current.createSnake();
      const newFood = gameLogicRef.current.generateFood(newSnake.body);

      setSnake(newSnake);
      setFood(newFood);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newDimensions = SNAKE_CONFIG.getResponsiveDimensions();
      setDimensions(newDimensions);

      if (gameLogicRef.current) {
        gameLogicRef.current.updateDimensions(newDimensions);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Setup controls
  useEffect(() => {
    if (!gameLogicRef.current) return;

    const handleDirectionChange = (newDirection: 'up' | 'down' | 'left' | 'right') => {
      if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

      setSnake(prevSnake => {
        if (gameLogicRef.current!.isValidDirectionChange(newDirection, prevSnake.direction)) {
          return { ...prevSnake, direction: newDirection };
        }
        return prevSnake;
      });
    };

    const handlePauseToggle = () => {
      if (gameState.isPlaying && !gameState.isGameOver) {
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
      }
    };

    const handleRestart = () => {
      startGame();
    };

    controlsManagerRef.current = new SnakeControlsManager(
      handleDirectionChange,
      handlePauseToggle,
      handleRestart
    );

    return () => {
      if (controlsManagerRef.current) {
        controlsManagerRef.current.cleanup();
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver]);

  // Game move logic
  const moveSnake = useCallback(() => {
    if (!gameLogicRef.current || !gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    setSnake(prevSnake => {
      let newSnake = gameLogicRef.current!.moveSnake(prevSnake);

      // Check wall collision
      if (gameLogicRef.current!.checkWallCollision(newSnake)) {
        setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
        return prevSnake;
      }

      // Check self collision
      if (gameLogicRef.current!.checkSelfCollision(newSnake)) {
        setGameState(prev => ({ ...prev, isGameOver: true, isPlaying: false }));
        return prevSnake;
      }

      // Check food collision
      if (gameLogicRef.current!.checkFoodCollision(newSnake, food)) {
        // Snake grows (don't remove tail)
        const points = food.points;
        const newScore = gameState.score + points;
        const newLevel = gameLogicRef.current!.calculateLevel(newScore);
        const newSpeed = SNAKE_CONFIG.getSpeedForLevel(newLevel);

        setGameState(prev => ({
          ...prev,
          score: newScore,
          level: newLevel,
          speed: newSpeed,
          highScore: Math.max(newScore, prev.highScore),
        }));

        // Save high score
        if (newScore > gameState.highScore) {
          localStorage.setItem('snake-high-score', newScore.toString());
        }

        // Generate new food
        setFood(gameLogicRef.current!.generateFood(newSnake.body));
      } else {
        // Remove tail (snake doesn't grow)
        newSnake = gameLogicRef.current!.removeTail(newSnake);
      }

      return newSnake;
    });
  }, [gameState, food]);

  // Setup move interval
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      moveIntervalRef.current = setInterval(moveSnake, gameState.speed);
    } else {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }
    }

    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, [moveSnake, gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.speed]);

  // Render game
  const render = useCallback(() => {
    if (!canvasRef.current || !gameLogicRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = SNAKE_CONFIG.COLORS.BACKGROUND;
    ctx.fillRect(0, 0, dimensions.width, dimensions.height);

    // Draw grid
    gameLogicRef.current.drawGrid(ctx);

    // Draw game elements
    gameLogicRef.current.drawFood(ctx, food);
    gameLogicRef.current.drawSnake(ctx, snake);
    gameLogicRef.current.drawScore(ctx, gameState.score, gameState.highScore, gameState.level);

    // Draw overlays
    if (gameState.isGameOver) {
      gameLogicRef.current.drawGameOver(ctx, gameState.score);
    } else if (gameState.isPaused) {
      gameLogicRef.current.drawPaused(ctx);
    }

    gameLoopRef.current = requestAnimationFrame(render);
  }, [dimensions, snake, food, gameState]);

  // Start render loop
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(render);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [render]);

  const startGame = () => {
    if (gameLogicRef.current) {
      const newSnake = gameLogicRef.current.createSnake();
      const newFood = gameLogicRef.current.generateFood(newSnake.body);

      setSnake(newSnake);
      setFood(newFood);
      setGameState(prev => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isGameOver: false,
        score: 0,
        level: 1,
        speed: SNAKE_CONFIG.SNAKE_SPEED,
      }));
    }
  };

  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      score: 0,
      level: 1,
      speed: SNAKE_CONFIG.SNAKE_SPEED,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Snake Game
          </h2>

          {/* Game Controls */}
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={startGame}
                disabled={gameState.isPlaying && !gameState.isGameOver}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {gameState.isGameOver ? 'New Game' : gameState.isPlaying ? 'Playing' : 'Start Game'}
              </button>
              <button
                onClick={pauseGame}
                disabled={!gameState.isPlaying || gameState.isGameOver}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {gameState.isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Score Display */}
          <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Score:</span>
              <span className="text-green-600 dark:text-green-400 font-bold">{gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">High Score:</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">{gameState.highScore}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Level:</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">{gameState.level}</span>
            </div>
          </div>

          {/* Instructions */}
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>Arrow Keys or WASD - Move snake</p>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="relative flex justify-center">
          <canvas
            ref={canvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="border-2 border-gray-300 dark:border-gray-600 rounded-lg max-w-full"
          />
        </div>

        {/* Game Info */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p className="font-semibold mb-1">How to Play:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Guide the snake to eat food and grow longer</li>
            <li>Avoid hitting walls and your own tail</li>
            <li>Golden food gives bonus points</li>
            <li>Speed increases as you level up</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
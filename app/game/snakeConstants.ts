import type { GameDimensions } from './snakeTypes';

export const SNAKE_CONFIG = {
  // Canvas dimensions
  CANVAS_WIDTH: 600,
  CANVAS_HEIGHT: 400,
  GRID_SIZE: 20,
  
  // Snake settings
  INITIAL_SNAKE_LENGTH: 3,
  SNAKE_SPEED: 100, // milliseconds between moves
  SPEED_INCREMENT: 5,
  MAX_SPEED: 50,
  
  // Game settings
  POINTS_PER_FOOD: 10,
  BONUS_FOOD_POINTS: 50,
  BONUS_FOOD_CHANCE: 0.1,
  LEVEL_UP_THRESHOLD: 50,
  
  // Colors
  COLORS: {
    BACKGROUND: '#1a1a2e',
    GRID: '#16213e',
    SNAKE_HEAD: '#0f4c75',
    SNAKE_BODY: '#3282b8',
    FOOD_NORMAL: '#e94560',
    FOOD_BONUS: '#ffd700',
    TEXT: '#ffffff',
    SCORE: '#00ff00',
    GAME_OVER: '#ff0000',
  },
  
  // Responsive scaling
  getResponsiveDimensions(): GameDimensions {
    if (typeof window === 'undefined') {
      return {
        width: this.CANVAS_WIDTH,
        height: this.CANVAS_HEIGHT,
        gridSize: this.GRID_SIZE,
        cols: Math.floor(this.CANVAS_WIDTH / this.GRID_SIZE),
        rows: Math.floor(this.CANVAS_HEIGHT / this.GRID_SIZE),
      };
    }
    
    const maxWidth = Math.min(window.innerWidth - 40, this.CANVAS_WIDTH);
    const aspectRatio = this.CANVAS_HEIGHT / this.CANVAS_WIDTH;
    const height = Math.floor(maxWidth * aspectRatio);
    const gridSize = Math.floor(maxWidth / 30); // Adjust grid size based on width
    
    return {
      width: maxWidth,
      height: height,
      gridSize: gridSize,
      cols: Math.floor(maxWidth / gridSize),
      rows: Math.floor(height / gridSize),
    };
  },
  
  // Speed levels
  getSpeedForLevel(level: number): number {
    const baseSpeed = this.SNAKE_SPEED;
    const speedReduction = Math.min((level - 1) * this.SPEED_INCREMENT, this.SNAKE_SPEED - this.MAX_SPEED);
    return Math.max(baseSpeed - speedReduction, this.MAX_SPEED);
  },
};